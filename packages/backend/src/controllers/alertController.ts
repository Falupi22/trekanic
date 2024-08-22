import HttpStatus from "http-status-codes"
import asyncHandler from "express-async-handler"
import { AlertModel } from "../models"

export const getAlerts = asyncHandler(async (req, res, next) => {
  let statusCode: number = HttpStatus.BAD_REQUEST

  let result
  if (req.isAuthenticated()) {
    statusCode = HttpStatus.OK

    result = await AlertModel.find().lean()
    res.status(statusCode).json(result)
  } else {
    statusCode = HttpStatus.UNAUTHORIZED
    res.status(statusCode).json()
  }
})
