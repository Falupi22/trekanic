import { Box, ChakraProvider } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom"
import "../src/styles/style.css"
import { EVENT_APPOINTMENTS_ALL, EVENT_APPOINTMENTS_FREED, EVENT_APPOINTMENTS_STORED, ROUTE_APPOINTMENTS, socket } from "./api"
import Account from "./components/Account"
import ErrorBoundary from "./components/ErrorRoute"
import Login from "./components/Login"
import Menu from "./components/Menu"
import { AppointmentOptionsContext, AppointmentOptionsContextProps } from "./storage"
import { theme } from "./theme/theme"

function App() {
  const [issues, setIssues] = useState([])
  const [takenDates, setTakenDates] = useState(null)
  const [userId, setUserId] = useState(null)
  const [email, setEmail] = useState(null)

  useEffect(() => {


    const OnAppointmentFreed = (value) => {
      const currentAppointment = value;

      // Removes the appointment from the stored appointments
      if (takenDates && takenDates.find(date =>
        date.mechanicId === "default" && date.appointments.find(existingDate => existingDate === date))) {
        const noMechanicDates = takenDates.find(date =>
          date.mechanic === "default")
        let noMechanicAppointments = noMechanicDates.appointments;
        noMechanicAppointments = noMechanicAppointments.filter(function (item) {
          return item !== value
        })
        noMechanicDates.appointments = noMechanicAppointments;

      }
      console.log(takenDates)
      // Removed the appointment whose datetime and mechanic is either null or the same as the current appointment
      const takenDatesAfterFreeing = takenDates.filter(appointment =>
        !(appointment.datetime === currentAppointment.datetime &&
          (appointment.mechanic === currentAppointment.mechanic || currentAppointment.mechanic === null)))

      setTakenDates(takenDatesAfterFreeing)
    }

    const OnAppointmentStored = (value) => {
      let defaultMechanicAppointments;
      if (takenDates) {
        const date = takenDates.find(date =>
          date.mechanicId === "default")
        if (!date)
          defaultMechanicAppointments = {
            mechanicId: "default",
            appointments: [value]
          }
        else {
          date.appointmentas.push(value)
        }
      }

      const updatedTakenDates = takenDates ? [...takenDates] : []
      if (defaultMechanicAppointments) {
        updatedTakenDates.push(defaultMechanicAppointments)
      }
      console.log(updatedTakenDates)
      setTakenDates(updatedTakenDates)
    }

    const OnAllAppointments = (value) => {
      let defaultMechanicAppointments;
      if (takenDates) {
        const date = takenDates.find(date =>
          date.mechanicId === "default")
        if (!date)
          defaultMechanicAppointments = {
            mechanicId: "default",
            appointments: value
          }
        else {
          date.appointmentas.push(...value)
        }

        const updatedTakenDates = [...takenDates]
        if (defaultMechanicAppointments) {
          updatedTakenDates.push(defaultMechanicAppointments)
        }
        setTakenDates([...updatedTakenDates])
      }
    }

    socket.on(`${ROUTE_APPOINTMENTS}:${EVENT_APPOINTMENTS_FREED}`, OnAppointmentFreed);
    socket.on(`${ROUTE_APPOINTMENTS}:${EVENT_APPOINTMENTS_STORED}`, OnAppointmentStored);
    socket.on(`${ROUTE_APPOINTMENTS}:${EVENT_APPOINTMENTS_ALL}`, OnAllAppointments);

    return () => {
      socket.off(EVENT_APPOINTMENTS_FREED, OnAppointmentFreed);
      socket.off(EVENT_APPOINTMENTS_STORED, OnAppointmentStored);
      socket.off(EVENT_APPOINTMENTS_ALL, OnAllAppointments);
    };
  }, []);

  const AppointmentOptions: AppointmentOptionsContextProps = {
    issues,
    setIssues,
    takenDates,
    setTakenDates,
    userId,
    setUserId,
    email,
    setEmail
  }

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
    }
  ])

  return (
    <>
      <ChakraProvider theme={theme}>
        <AppointmentOptionsContext.Provider value={AppointmentOptions}>
          <Box bg="dark.400" height="100%">
            <Menu />
            <RouterProvider router={router} />
          </Box>
        </AppointmentOptionsContext.Provider>
      </ChakraProvider>
    </>
  )
}

export default App
