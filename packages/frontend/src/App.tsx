import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Login from "./components/Login"
import "../src/styles/style.css"
import Account from "./components/Account"
import Test from "./components/Test"
import { ChakraProvider } from "@chakra-ui/react"
import Menu from "./components/Menu"
import { theme } from "./theme/theme"
import React from "react"

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
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
        <Menu />
        <RouterProvider router={router} />
      </ChakraProvider>
    </>
  )
}

export default App
