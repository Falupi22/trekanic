import { Box, ChakraProvider } from "@chakra-ui/react"
import "devextreme/dist/css/dx.light.css"
import React, { useState } from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import "../src/styles/style.css"
import { Account, Admin, Home, Layout } from "./components"
import { AppointmentOptionsContext } from "./storage"
import UserInfoContext from "./storage/userInfoContext"
import { theme } from "./theme/theme"
import { PrivateRoute, ROUTE_ACCOUNT, ROUTE_ADMIN, ROUTE_LOGIN, ROUTE_ROOT } from "./utils/routes"
import ErrorBoundary from "./utils/routes/ErrorRoute"

function App() {
  const [issues, setIssues] = useState([])
  const [takenDates, setTakenDates] = useState(null)
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState(null)
  const [isAdmin, setIsAdmin] = useState(null)

  const userInfoValue = { userId, setUserId, email, setEmail, isAdmin, setIsAdmin }
  const appointmentOptionsValue = { issues, setIssues, takenDates, setTakenDates }

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: ROUTE_ROOT,
          element: <Home />,
          errorElement: <ErrorBoundary />,
        },
        {
          path: ROUTE_LOGIN,
          element: <Navigate to={ROUTE_ROOT} />,
          errorElement: <ErrorBoundary />,
        },
        {
          path: ROUTE_ACCOUNT,
          element: (
            <PrivateRoute>
              <Account />
            </PrivateRoute>
          ),
        },
        {
          path: ROUTE_ADMIN,
          element: (
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          ),
          errorElement: <ErrorBoundary />,
        },
      ],
    },
  ])

  return (
    <>
      <ChakraProvider theme={theme}>
        <AppointmentOptionsContext.Provider value={appointmentOptionsValue}>
          <UserInfoContext.Provider value={userInfoValue}>
            <Box bg="dark.400" height="100%">
              <RouterProvider router={router} />
            </Box>
          </UserInfoContext.Provider>
        </AppointmentOptionsContext.Provider>
      </ChakraProvider>
    </>
  )
}

export default App
