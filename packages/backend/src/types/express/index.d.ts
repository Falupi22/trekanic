import express from "express"

declare global {
  namespace Express {
    interface Request {
      user?: Express.User
      isAuthenticated?: () => boolean
      login?: (user: Express.User, done: (err: any) => void) => void
    }
  }
}
