import React, { useState } from "react"
import { Navigate } from "react-router-dom"
import { api } from "../../api"
import { HttpStatusCode } from "axios"
import { ROUTE_LOGIN } from "./naming"
import { SkeletonLoader } from "../../components"

const PrivateRoute = ({ children }) => {
  const [auth, setAuth] = useState(null)

  async function fetch() {
    await api
      .authenticate()
      .then((value) => {
        setAuth(value.status === HttpStatusCode.Ok)
      })
      .catch((error) => {
        setAuth(false)
      })
  }

  if (auth === null) {
    fetch()
  }
  // Your authentication logic goes here...

  let result

  switch (auth) {
    case true:
      result = children
      break
    case false:
      result = <Navigate to={ROUTE_LOGIN} />
      break
    default:
      result = <SkeletonLoader count={1} />
      break
  }

  return result
}

export default PrivateRoute
