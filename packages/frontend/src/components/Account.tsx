import { Box, Flex, Heading, IconButton, useToast, VStack } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import { LogOutIcon } from "../assets/icons"
import "../styles/style.css"
import { requestFailedToast } from "./alerts"
import Appointment from "./Appointment"
import AppointmentsControlPanel from "./AppointmentsControlPanel"
import SkeletonLoader from "./general/SkeletonLoader"

const Account = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    api
      .getAppointments()
      .then((res) => {
        setAppointments(res.data)
        setLoading(false)
      })
      .catch((err) => {
        toast(requestFailedToast)
        setLoading(false)
      })
  }, [toast])

  const logout = () => {
    api
      .logout()
      .then((res) => {
        navigate("/login")
      })
      .catch((error) => {
        toast(requestFailedToast)
      })
  }

  const deleteCallback = (id: string) => {
    const uodatedAppointments = appointments.filter((appointment) => appointment._id !== id)

    setAppointments(uodatedAppointments)
  }

  const appointmentsCards = appointments
    .sort((a, b) => {
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    })
    .map((appointment) => (
      <Appointment key={appointment.id} appointment={appointment} deleteCallback={deleteCallback} />
    ))

  const nextAppointment = appointments
    .sort((a, b) => {
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    })
    .find((appointment) => new Date(appointment.datetime).getTime() > Date.now())
  const nextAppointmentDatetime = nextAppointment?.datetime
  return (
    <Flex minHeight="90vh" flexFlow="column" alignItems="center" shadow="coloredOutline">
      <IconButton
        aria-label="log out"
        icon={<LogOutIcon />}
        onClick={logout}
        marginLeft="auto"
        marginRight="1"
        variant="square"
        size="sm"
      />
      <Heading fontSize="3xl" p="0" mt="0" mb="1">
        Your appointments
      </Heading>
      <VStack gap={0.25} zIndex={1} boxShadow="0 4px 8px rgba(0,0,0,0.1)" overflowY="auto" height="79vh">
        <AppointmentsControlPanel nextAppointmentDatetime={nextAppointmentDatetime} isLoading={loading} />

        {loading || appointmentsCards.length > 0 ? (
          <VStack>
            {loading ? (
              // Display skeletons while loading
              <SkeletonLoader />
            ) : (
              appointmentsCards
            )}
          </VStack>
        ) : (
          <Box>
            <Heading fontSize="sm" p="0" mt="35vh" display="flex" justifyContent="center" alignItems="center">
              Schedule an appointment to make it appear!
            </Heading>
          </Box>
        )}
      </VStack>
    </Flex>
  )
}

export default Account
