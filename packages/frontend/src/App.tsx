import { Box, ChakraProvider } from "@chakra-ui/react"
import "devextreme/dist/css/dx.light.css"
import React from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import "../src/styles/style.css"
import { Account, Admin, Home, Layout } from "./components"
import { theme } from "./theme/theme"
import { PrivateRoute, ROUTE_ACCOUNT, ROUTE_ADMIN, ROUTE_LOGIN, ROUTE_ROOT } from "./utils/routes"
import ErrorBoundary from "./utils/routes/ErrorRoute"

function App() {
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
          errorElement: <Navigate to={ROUTE_ROOT} />,
        },
        {
          path: ROUTE_ADMIN,
          element: (
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          ),
          errorElement: <Navigate to={ROUTE_ROOT} />,
        },
      ],
    },
  ])

  return (
    <>
      <ChakraProvider theme={theme}>
        <Box height="100%">
          <RouterProvider router={router} />
        </Box>
      </ChakraProvider>
    </>
  )
}

export default App
