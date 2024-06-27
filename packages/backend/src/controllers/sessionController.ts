import { User } from "../models"
import HttpStatus from "http-status-codes"
import asyncHandler from "express-async-handler"
import passport from "passport"

export const login = asyncHandler(async (req, res, next) => {
  let statusCode: number = HttpStatus.BAD_REQUEST

  const user = {
    email: req.body.email,
    password: req.body.password,
  }

  if (!req.isAuthenticated()) {
    if (await User.findOne({ email: user.email, password: user.password })) {
      await new Promise((resolve) =>
        req.login(user, async function (error) {
          if (error) {
            console.log(error)
          } else {
            await new Promise((resolve) => {
              passport.authenticate("local", function (error) {
                if (error) {
                  console.log(error)
                  statusCode = HttpStatus.UNAUTHORIZED
                } else {
                  statusCode = HttpStatus.OK
                }

                resolve(null)
              })(req, res, next)
            })

            resolve(null)
          }
        }),
      )
    } else {
      statusCode = HttpStatus.NOT_FOUND
    }
  } else {
    statusCode = HttpStatus.FORBIDDEN
  }

  res.status(statusCode)
  res.send()
})

export const logout = asyncHandler(async (req, res, _next) => {
  let statusCode: number = HttpStatus.FORBIDDEN

  if (req.isAuthenticated()) {
    await new Promise((resolve) => {
      req.logout(null, () => {
        statusCode = HttpStatus.OK

        resolve(null)
      })
    })
  }

  res.status(statusCode)
  res.send()
})