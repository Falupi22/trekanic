import React from "react"
import { Navigate } from "react-router-dom"
import { ROUTE_LOGIN } from "./naming"
import { useUserInfoStore } from "../../storage"

const PrivateRoute = ({ children }) => {
  const isAuth = useUserInfoStore((state) => state.isAuth)

  // Your authentication logic goes here...
  let result

  if (isAuth) {
    result = children
  } else {
    result = <Navigate to={ROUTE_LOGIN} />
  }

  return result
}

export default PrivateRoute
