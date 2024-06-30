import { Appointment, AppointmentModel, User, UserDocument } from "../models"
import HttpStatus from "http-status-codes"
import asyncHandler from "express-async-handler"
import Mechanic, { MechanicModel } from "../models/Mechanic.model"
import Issue, { IssueModel } from "../models/Issue.model"
import { AppointmentTime } from "../utils"
import IssueCategory, { IssueCategoryModel } from "../models/IssueCategory.model"

const openingTime = 8
const closingTime = 22

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
    console.log("free mechanics: ", freeMechanics)
    console.log("Available mechanics: ", availableMechanics)
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
    }

    const statusCode = availableMechanics.length > 0 ? HttpStatus.OK : HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE

    res.status(statusCode).send(appointment)
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send("An error occurred")
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
        console.log(appointmentTimes[index])
        free =
          !currentAppointmentTime.isSameDay(appointmentTimes[index]) ||
          !(
            appointmentTimes[index].compareTo(currentAppointmentTime.getEndTime()) > -1 ||
            currentAppointmentTime.compareTo(appointmentTimes[index].getEndTime()) > -1
          )
      }

      return free ? mechanic : null // Return mechanic if free, otherwise null
    }),
  )

  return freeMechanics.filter((mechanic) => mechanic !== null)
}