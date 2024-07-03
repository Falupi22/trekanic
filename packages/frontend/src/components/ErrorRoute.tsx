import { useRouteError } from "react-router-dom"
import { Text } from "@chakra-ui/react"
import React from "react"

function ErrorBoundary() {
  let error = useRouteError()
  console.error(error)
  // Uncaught ReferenceError: path is not defined
  return <Text>Not found</Text>
}

export default ErrorBoundary
