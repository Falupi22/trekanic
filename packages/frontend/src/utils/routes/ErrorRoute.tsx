import { useRouteError } from "react-router-dom"
import { Text } from "@chakra-ui/react"
import React from "react"

const ErrorBoundary = () => {
  let error = useRouteError()

  return <Text>{JSON.stringify(error)}</Text>
}

export default ErrorBoundary
