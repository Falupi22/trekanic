import { Appointment, AppointmentModel, User, UserDocument } from "../models"
import HttpStatus from "http-status-codes"
import asyncHandler from "express-async-handler"
import Mechanic, { MechanicModel } from "../models/Mechanic.model"
import Issue, { IssueModel } from "../models/Issue.model"
import { AppointmentTime, sendEmail } from "../utils"
import IssueCategory, { IssueCategoryModel } from "../models/IssueCategory.model"
import { ObjectId, Types } from "mongoose"
import jsonpatch from "fast-json-patch"
import { startSession } from "mongoose"
import ProductModel, { ProductDocument } from "../models/Product.model"
import { listenerCount } from "events"

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

export const getMechanics = asyncHandler(async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(HttpStatus.UNAUTHORIZED).send()
      return
    }

    const mechanics: Mechanic[] = await MechanicModel.find({}).populate({
      path: "appointments",
      model: AppointmentModel,
      populate: [
        {
          path: "issue",
          model: IssueModel,
          populate: {
            path: "category",
            model: IssueCategoryModel,
          },
        },
        {
          path: "customer",
          model: User,
        },
        {
          path: "product",
          model: ProductModel,
        },
      ],
    })

    res.status(HttpStatus.OK).send(mechanics)
  } catch (error) {
    console.error("An error occurred:", error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
  }
})

export const getMechanicsByTime = asyncHandler(async (req, res) => {
  const selectedTime = req.params.time
  try {
    if (!req.isAuthenticated()) {
      res.status(HttpStatus.UNAUTHORIZED).send()
      return
    }

    const mechanics: Mechanic[] = await MechanicModel.find({ "appointments.datetime": { $ne: selectedTime } }).lean()

    res.status(HttpStatus.OK).send(mechanics)
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

    const mechanicsTakenTime = await Promise.all(
      mechanics.map(async (mechanic) => {
        const mechanicAppointments = allAppointments.filter((appointment) => appointment.mechanic.equals(mechanic.id))
        return {
          mechanicId: mechanic._id,
          appointments: mechanicAppointments.map((appointment) => {
            const duration = ((appointment.issue as unknown as Issue).category as unknown as IssueCategory).duration
            const data = {
              datetime: appointment.datetime,
              duration: duration,
              customer: appointment.customer,
            }
            return data
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

export const getAppointmentsOfAllUsers = asyncHandler(async (req, res) => {
  try {
    let statusCode: number = HttpStatus.BAD_REQUEST
    let appointments: Appointment[] = []

    const month = parseInt(req.params.month)
    const year = parseInt(req.params.year)

    if (req.isAuthenticated()) {
      const startDate = new Date(year, month - 1, 1) // month is 0-indexed in JavaScript Date
      const endDate = new Date(year, month, 1)

      appointments = await AppointmentModel.find({
        datetime: {
          $gte: startDate,
          $lt: endDate,
        },
      }).populate([
        {
          path: "issue",
          populate: {
            path: "category",
          },
        },
        {
          path: "mechanic",
        },
        {
          path: "product",
        },
      ])
      statusCode = HttpStatus.OK
    } else {
      statusCode = HttpStatus.UNAUTHORIZED
    }

    res.status(statusCode)
    res.send(appointments)
  } catch (error) {
    console.error("An error occurred: ", error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
  }
})

export const getAppointments = asyncHandler(async (req, res) => {
  try {
    let appointments: Appointment[] = []

    if (!req.isAuthenticated()) {
      res.status(HttpStatus.UNAUTHORIZED).json()
      return
    }

    const userDoc = req.user as UserDocument
    appointments = await AppointmentModel.find({ customer: userDoc.id }).populate([
      {
        path: "issue",
        populate: {
          path: "category",
        },
      },
      {
        path: "mechanic",
      },
      {
        path: "product",
      },
    ])

    res.status(HttpStatus.OK).send(appointments)
  } catch (error) {
    console.error("An error occurred: ", error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
  }
})

export const createAppointment = asyncHandler(async (req, res) => {
  let session
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

    const oneHourAfterNow = new Date(new Date().getTime() + 60 * 60 * 1000)
    if (datetime < oneHourAfterNow || datetime.getHours() < openingTime || datetime.getHours() >= closingTime) {
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

      session = await startSession()
      session.startTransaction()

      const selectedMechanicId = availableMechanics[Math.floor(Math.random() * freeMechanics.length)]._id
      const product = currentAppointment.product as unknown as ProductDocument
      let productDoc = await ProductModel.findOne({ catalogNumber: product.catalogNumber }).session(session).lean()
      if (!productDoc) {
        const products = await ProductModel.create(
          [
            {
              catalogNumber: product.catalogNumber,
              name: "auto-gen-prod-" + product.catalogNumber,
            },
          ],
          { session },
        )
        productDoc = products[0]
      }

      appointment = await AppointmentModel.create(
        [
          {
            issue: currentAppointment.issue,
            description: currentAppointment.description,
            datetime: currentAppointment.datetime,
            customer: user._id,
            mechanic: selectedMechanicId,
            product: productDoc._id,
          },
        ],
        { session },
      )

      await MechanicModel.findOneAndUpdate(
        { _id: selectedMechanicId },
        {
          $push: {
            appointments: {
              _id: appointment[0]._id,
            },
          },
        },
        { session },
      )

      await session.commitTransaction()
      session.endSession()
    }

    const statusCode = availableMechanics.length > 0 ? HttpStatus.OK : HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE

    res.status(statusCode).send(appointment?.at(0))
  } catch (error) {
    if (session) {
      await session.abortTransaction()
      session.endSession()
    }

    console.error(error)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
  }
})

export const editAppointment = asyncHandler(async (req, res) => {
  const appointmentId = req.body.appointmentId
  const appointmentPatch = req.body.appointmentPatch

  let session
  try {
    if (!req.isAuthenticated()) {
      res.status(HttpStatus.UNAUTHORIZED).send()
      return
    }

    const executor = await User.findById((req.user as UserDocument).id).lean()
    const adminEdited = executor.isAdmin
    const originalAppointment: Appointment = await AppointmentModel.findById(appointmentId)
      .populate("customer product")
      .lean()
    const customer = originalAppointment.customer as unknown as UserDocument
    const email = customer.email

    const originalCopy = {
      id: originalAppointment._id,
      datetime: originalAppointment.datetime,
      issue: originalAppointment.issue,
      description: originalAppointment.description,
      customer: originalAppointment.customer,
      mechanic: originalAppointment.mechanic,
      catalogNumber: (originalAppointment.product as unknown as ProductDocument).catalogNumber,
    }

    if (!originalAppointment) {
      res.status(HttpStatus.NOT_FOUND).send("Appointment not found")
      return
    }

    const editedAppointment = jsonpatch.applyPatch(originalCopy, appointmentPatch).newDocument
    const editedAppointmentDate = new Date(editedAppointment.datetime)
    const appointmentHour = editedAppointmentDate.getHours()

    if (editedAppointment.description.length > 250) {
      res.status(HttpStatus.BAD_REQUEST).send()
      return
    }

    const oneHourAfterNow = new Date(new Date().getTime() + 60 * 60 * 1000)
    if (
      (editedAppointmentDate >= oneHourAfterNow && originalAppointment.datetime == editedAppointment.datetime) ||
      (appointmentHour > openingTime && appointmentHour < closingTime)
    ) {
      const appointmentIssue = await IssueModel.findById(editedAppointment.issue).lean()

      if (!appointmentIssue) {
        res.status(HttpStatus.NOT_FOUND).send("Issue not found")
        return
      }

      // Changes mechanics if datetime or mechanics were exchanged
      const dateWasChanged = originalAppointment.datetime !== editedAppointment.datetime
      const mechanicWasChanged = !originalAppointment.mechanic.equals(editedAppointment.mechanic)
      if (dateWasChanged || mechanicWasChanged) {
        const currentAppointmentTime = new AppointmentTime(
          new Date(editedAppointment.datetime),
          appointmentIssue.duration,
        )
        const freeMechanics = await getFreeMechanicsByTime(currentAppointmentTime)

        if (freeMechanics.length > 0) {
          let newMechanicId = editedAppointment.mechanic

          // Checks if the chosen mechanic regsarding that the date time was changed
          if (
            dateWasChanged &&
            !freeMechanics.find((mechanic) => (mechanic._id as Types.ObjectId).equals(originalAppointment.mechanic))
          ) {
            const randomMechanicIndex = Math.floor(Math.random() * freeMechanics.length)
            newMechanicId = freeMechanics[randomMechanicIndex]?._id as Types.ObjectId
          }

          editedAppointment.mechanic = newMechanicId

          session = await startSession()
          session.startTransaction()

          const productCatalogNumber = editedAppointment.catalogNumber
          let productDoc = await ProductModel.findOne({ catalogNumber: productCatalogNumber }).session(session).lean()
          if (!productDoc) {
            const products = await ProductModel.create(
              [
                {
                  catalogNumber: productCatalogNumber,
                  name: "auto-gen-prod-" + productCatalogNumber,
                },
              ],
              { session },
            )

            productDoc = products[0]
          }

          const readyAppointment = {
            ...editedAppointment,
            product: productDoc._id,
          }

          delete readyAppointment.catalogNumber

          await AppointmentModel.updateOne({ _id: editedAppointment.id }, readyAppointment, { session })

          if (!originalAppointment.mechanic.equals(newMechanicId)) {
            await MechanicModel.findOneAndUpdate(
              { _id: originalAppointment.mechanic },
              {
                $pull: {
                  appointments: new Types.ObjectId(originalAppointment._id.toString()),
                },
              },
              { session },
            ).exec()

            await MechanicModel.findOneAndUpdate(
              { _id: newMechanicId },
              {
                $push: {
                  appointments: {
                    _id: originalAppointment._id,
                  },
                },
              },
              { session },
            ).exec()
          }

          if (adminEdited) {
            const updated = await AppointmentModel.findById(appointmentId).populate("product mechanic issue").lean()
            delete updated.customer

            sendEmail(email, updated, "edit")
          }

          await session.commitTransaction()
          session.endSession()

          res.status(HttpStatus.OK).send()
        } else {
          res.status(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE).send("No available mechanics")
        }
      } else {
        const productCatalogNumber = editedAppointment.catalogNumber
        let productDoc = await ProductModel.findOne({ catalogNumber: productCatalogNumber }).session(session).lean()
        if (!productDoc) {
          const products = await ProductModel.create(
            [
              {
                catalogNumber: productCatalogNumber,
                name: "auto-gen-prod-" + productCatalogNumber,
              },
            ],
            { session },
          )

          productDoc = products[0]
        }
        const readyAppointment = {
          ...editedAppointment,
          product: productDoc._id,
        }

        delete readyAppointment.catalogNumber

        await AppointmentModel.updateOne({ _id: editedAppointment.id }, readyAppointment, { session })

        if (adminEdited) {
          const updated = await AppointmentModel.findById(appointmentId).populate("product mechanic issue").lean()
          delete updated.customer

          sendEmail(email, updated, "edit")
        }

        res.status(HttpStatus.OK).send()
      }
    } else {
      res.status(HttpStatus.BAD_REQUEST).send("Invalid appointment time")
    }
  } catch (error) {
    if (session) {
      await session.abortTransaction()
      session.endSession()
    }

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
  const executor = await User.findById((req.user as UserDocument).id).lean()
  const adminDeleted = executor.isAdmin

  let session

  try {
    const originalAppointment = await AppointmentModel.findById(appointmentId).populate("customer mechanic").lean()
    const customer = originalAppointment.customer as unknown as UserDocument
    const email = customer.email

    if (!originalAppointment) {
      res.status(HttpStatus.NOT_FOUND).send("Appointment not found")
      return
    }

    session = await startSession()
    session.startTransaction()

    await MechanicModel.findOneAndUpdate(
      { _id: originalAppointment.mechanic._id },
      {
        $pull: {
          appointments: new Types.ObjectId(originalAppointment._id.toString()),
        },
      },
      { session },
    ).exec()

    await AppointmentModel.deleteOne({ _id: appointmentId }, { session })

    await session.commitTransaction()
    session.endSession()

    if (adminDeleted) {
      delete originalAppointment.customer
      sendEmail(email, originalAppointment, "delete")
    }

    res.status(HttpStatus.OK).send()
  } catch (error) {
    error
    if (session) {
      await session.abortTransaction()
      session.endSession()
    }

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send()
  }
})

const getFreeMechanicsByTime = async (currentAppointmentTime: AppointmentTime) => {
  const mechanics: Mechanic[] = await MechanicModel.find()
    .populate({
      path: "appointments",
      model: AppointmentModel,
      populate: [
        {
          path: "issue",
          model: IssueModel,
          populate: {
            path: "category",
            model: IssueCategoryModel,
          },
        },
      ],
    })
    .lean()

  const freeMechanics = await Promise.all(
    mechanics.map(async (mechanic) => {
      const appointmentTimes: AppointmentTime[] = (mechanic.appointments as unknown as Appointment[]).map(
        (appointment) => {
          const issue: Issue = appointment.issue as unknown as Issue
          const issueCategory = issue.category as unknown as IssueCategory
          const duration = issueCategory.duration
          return new AppointmentTime(appointment.datetime, duration)
        },
      )

      let free = true

      for (let index = 0; index < appointmentTimes.length && free; index++) {
        if (currentAppointmentTime.isSameDay(appointmentTimes[index])) {
          free =
            appointmentTimes[index].compareTo(currentAppointmentTime.datetime) !== 0 &&
            (appointmentTimes[index].compareTo(currentAppointmentTime.getEndTime()) > -1 ||
              currentAppointmentTime.compareTo(appointmentTimes[index].getEndTime()) > -1)
        }
      }

      return free ? mechanic : null // Return mechanic if free, otherwise null
    }),
  )

  console.log(freeMechanics)
  return freeMechanics.filter((mechanic) => mechanic !== null)
}
