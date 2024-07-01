import { Appointment, AppointmentModel, User, UserDocument } from "../models"
import HttpStatus from "http-status-codes"
import asyncHandler from "express-async-handler"
import Mechanic, { MechanicModel } from "../models/Mechanic.model"
import Issue, { IssueModel } from "../models/Issue.model"
import { AppointmentTime } from "../utils"
import IssueCategory, { IssueCategoryModel } from "../models/IssueCategory.model"
import { Types } from "mongoose"
import jsonpatch from "fast-json-patch"
import { startSession } from "mongoose"
import ws from "../ws/"
import { EVENT_APPOINTMENTS_FREE, EVENT_APPOINTMENTS_STORE } from "../ws/events/message"

const openingTime = 8
const closingTime = 22

export const getIssues = asyncHandler(async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(HttpStatus.UNAUTHORIZED).send()
      return
    }

    const issues: Issue[] = await IssueModel.find({}).populate("category")

    const groupedIssues = issues.reduce((acc, issue) => {
      const key = (issue.category as unknown as IssueCategory).name
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(issue)
      return acc
    }, {})

    res.status(HttpStatus.OK).send(groupedIssues)
  } catch (error) {
    console.error("An error occurred:", error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
  }
})

export const getAllMechanicsTakenTime = asyncHandler(async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(HttpStatus.UNAUTHORIZED).send()
      return
    }
    const mechanics: Mechanic[] = await MechanicModel.find()
    const allAppointments: Appointment[] = await AppointmentModel.find().populate({
      path: "issue",
      populate: {
        path: "category",
      },
    })
    console.log(allAppointments)
    const mechanicsTakenTime = await Promise.all(
      mechanics.map(async (mechanic) => {
        const mechanicAppointments = allAppointments.filter((appointment) => appointment.mechanic.equals(mechanic.id))
        return {
          mechanicId: mechanic._id,
          appointments: mechanicAppointments.map((appointment) => {
            const duration = ((appointment.issue as unknown as Issue).category as unknown as IssueCategory).duration
            return new AppointmentTime(appointment.datetime, duration)
          }),
        }
      }),
    )

    res.status(HttpStatus.OK).send(mechanicsTakenTime)
  } catch (error) {
    console.error("An error occurred:", error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
  }
})

export const getAppointments = asyncHandler(async (req, res) => {
  try {
    let statusCode: number = HttpStatus.BAD_REQUEST
    let appointments: Appointment[] = []

    if (req.isAuthenticated()) {
      const userDoc = req.user as UserDocument
      appointments = await AppointmentModel.find({ customer: userDoc.id })
      statusCode = HttpStatus.OK
    } else {
      statusCode = HttpStatus.FORBIDDEN
    }

    res.status(statusCode)
    res.send(appointments)
  } catch (error) {
    console.error("An error occurred: ", error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
  }
})

export const createAppointment = asyncHandler(async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(HttpStatus.UNAUTHORIZED).send()
      return
    }

    const currentAppointment: Appointment = req.body.appointment
    const datetime: Date = new Date(currentAppointment.datetime)
    if (currentAppointment.description.length > 250) {
      res.status(HttpStatus.BAD_REQUEST).send()
      return
    }

    if (datetime.getHours() < openingTime || datetime.getHours() >= closingTime) {
      res.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).send()
      return
    }

    const appointmentIssue: Issue = await IssueModel.findById(currentAppointment.issue)

    const issueCategory = await IssueCategoryModel.findById(appointmentIssue.category)
    const currentAppointmentTime: AppointmentTime = new AppointmentTime(
      new Date(currentAppointment.datetime),
      issueCategory.duration,
    )

    const freeMechanics: Mechanic[] = await getFreeMechanicsByTime(currentAppointmentTime)
    const availableMechanics = freeMechanics.filter((mechanic) => mechanic !== null)
    let appointment

    const userDoc = req.user as UserDocument

    if (availableMechanics.length > 0) {
      const user = await User.findOne({ email: userDoc.email })

      appointment = await AppointmentModel.create({
        issue: currentAppointment.issue,
        description: currentAppointment.description,
        datetime: currentAppointment.datetime,
        customer: user._id,
        mechanic: availableMechanics[0]._id,
        product: currentAppointment.product,
      })

      await MechanicModel.findOneAndUpdate(
        { _id: availableMechanics[0]._id },
        {
          $push: {
            appointments: {
              _id: appointment._id,
            },
          },
        },
      )

      ws.emitEvent(EVENT_APPOINTMENTS_STORE, appointment)
    }

    const statusCode = availableMechanics.length > 0 ? HttpStatus.OK : HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE

    res.status(statusCode).send(appointment)
  } catch (error) {
    console.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
  }
})

export const editAppointment = asyncHandler(async (req, res) => {
  const appointmentId = req.body.appointmentId
  const appointmentPatch = req.body.appointmentPatch

  try {
    if (!req.isAuthenticated()) {
      res.status(HttpStatus.UNAUTHORIZED).send()
      return
    }

    const originalAppointment: Appointment = await AppointmentModel.findById(appointmentId)
    const originalCopy = {
      id: originalAppointment._id,
      datetime: originalAppointment.datetime,
      issue: originalAppointment.issue,
      description: originalAppointment.description,
      customer: originalAppointment.customer,
      mechanic: originalAppointment.mechanic,
      product: originalAppointment.product,
    }

    if (!originalAppointment) {
      res.status(HttpStatus.NOT_FOUND).send("Appointment not found")
      return
    }

    const editedAppointment = jsonpatch.applyPatch(originalCopy, appointmentPatch).newDocument
    const appointmentHour = new Date(editedAppointment.datetime).getHours()

    if (editedAppointment.description.length > 250) {
      res.status(HttpStatus.BAD_REQUEST).send()
      return
    }

    if (
      originalAppointment.datetime == editedAppointment.datetime ||
      (appointmentHour > openingTime && appointmentHour < closingTime)
    ) {
      const appointmentIssue = await IssueModel.findById(editedAppointment.issue)

      if (!appointmentIssue) {
        res.status(HttpStatus.NOT_FOUND).send("Issue not found")
        return
      }

      if (originalAppointment.datetime != editedAppointment.datetime) {
        const currentAppointmentTime = new AppointmentTime(
          new Date(editedAppointment.datetime),
          appointmentIssue.duration,
        )
        const freeMechanics = await getFreeMechanicsByTime(currentAppointmentTime)

        if (freeMechanics.length > 0) {
          const newMechanicId = freeMechanics[0]?._id as Types.ObjectId
          editedAppointment.mechanic = newMechanicId

          await AppointmentModel.updateOne({ _id: editedAppointment.id }, editedAppointment)

          // Exchanging mechanics.
          if (originalAppointment.mechanic !== newMechanicId) {
            await MechanicModel.findOneAndUpdate(
              { _id: originalAppointment.mechanic },
              {
                $pull: {
                  appointments: {
                    _id: originalAppointment._id,
                  },
                },
              },
            )

            await MechanicModel.findOneAndUpdate(
              { _id: newMechanicId },
              {
                $push: {
                  appointments: {
                    _id: originalAppointment._id,
                  },
                },
              },
            )
          }
          ws.emitEvent(EVENT_APPOINTMENTS_FREE, originalAppointment)
          ws.emitEvent(EVENT_APPOINTMENTS_STORE, editedAppointment)

          res.status(HttpStatus.OK).send()
        } else {
          res.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).send("No available mechanics")
        }
      } else {
        await AppointmentModel.updateOne({ _id: editedAppointment.id }, editedAppointment)
        res.status(HttpStatus.OK).send()
      }
    } else {
      res.status(HttpStatus.BAD_REQUEST).send("Invalid appointment time")
    }
  } catch (error) {
    console.error("An error occurred:", error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
  }
})

export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointmentId = req.params.id

  if (!req.isAuthenticated()) {
    res.status(HttpStatus.UNAUTHORIZED).send()
    return
  }

  let session

  try {
    session = await startSession()
    session.startTransaction()
    const originalAppointment = await AppointmentModel.findById(appointmentId).session(session)

    if (!originalAppointment) {
      res.status(HttpStatus.NOT_FOUND).send("Appointment not found")
      return
    }

    await MechanicModel.findOneAndUpdate(
      { _id: originalAppointment.mechanic },
      {
        $pull: {
          appointments: {
            _id: originalAppointment._id,
          },
        },
      },
      { session },
    )

    await AppointmentModel.deleteOne({ _id: appointmentId }, { session })

    await session.commitTransaction()
    session.endSession()
    ws.emitEvent(EVENT_APPOINTMENTS_FREE, originalAppointment)

    res.status(HttpStatus.OK).send()
  } catch (error) {
    if (session) {
      await session.abortTransaction()
      session.endSession()
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send()
  }
})

const getFreeMechanicsByTime = async (currentAppointmentTime: AppointmentTime) => {
  const mechanics: Mechanic[] = await MechanicModel.find()
  const freeMechanics = await Promise.all(
    mechanics.map(async (mechanic) => {
      const appointmentTimes: AppointmentTime[] = await Promise.all(
        mechanic.appointments.map(async (appointmentId) => {
          const appointment: Appointment = await AppointmentModel.findById(appointmentId)
          const issue: Issue = await IssueModel.findById(appointment.issue).populate("category")
          const issueCategory = issue.category as unknown as IssueCategory
          const duration = issueCategory.duration
          return new AppointmentTime(appointment.datetime, duration)
        }),
      )

      let free = true

      for (let index = 0; index < appointmentTimes.length && free; index++) {
        if (currentAppointmentTime.isSameDay(appointmentTimes[index])) {
          free =
            appointmentTimes[index].compareTo(currentAppointmentTime.datetime) !== 0 &&
            (appointmentTimes[index].compareTo(currentAppointmentTime.getEndTime()) > -1 ||
              currentAppointmentTime.compareTo(appointmentTimes[index].getEndTime()) > -1)
        }

        console.log("iteration appointment " + appointmentTimes[index].datetime)
        console.log("current appointment " + currentAppointmentTime.datetime)
        console.log("Before: " + appointmentTimes[index].compareTo(currentAppointmentTime.getEndTime()))
        console.log("After: " + currentAppointmentTime.compareTo(appointmentTimes[index].getEndTime()))
        console.log("Free: " + free)
      }

      return free ? mechanic : null // Return mechanic if free, otherwise null
    }),
  )

  return freeMechanics.filter((mechanic) => mechanic !== null)
}
