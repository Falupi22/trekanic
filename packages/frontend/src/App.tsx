import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import Login from "./components/Login"
import "../src/styles/style.css"
import Account from "./components/Account"
import Test from "./components/Test"
import { Box, ChakraProvider } from "@chakra-ui/react"
import Menu from "./components/Menu"
import { theme } from "./theme/theme"
import React from "react"
import ErrorBoundary from "./components/ErrorRoute"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/login",
      element: <Navigate to="/" />,
      errorElement: <ErrorBoundary />,
    },
    {
      path: "/home",
      element: <h1>Hi</h1>,
    },
    {
      path: "/account",
      element: <Account />,
    },
    {
      path: "/test",
      element: <Test />,
    },
  ])

  return (
    <>
      <ChakraProvider theme={theme}>
        <Box bg="normal.100">
          <Menu />
          <RouterProvider router={router} />
        </Box>
      </ChakraProvider>
    </>
  )
}

export default App
