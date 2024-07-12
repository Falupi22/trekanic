import { Box, Flex, Heading, useToast, VStack } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import { useAppointmentOptionsStore, useUserInfoStore } from "../storage"
import "../styles/style.css"
import { ROUTE_ADMIN } from "../utils/routes"
import { requestFailedToast } from "./alerts"
import Appointment from "./Appointment"
import AppointmentsControlPanel from "./AppointmentsControlPanel"
import { Sidebar, SkeletonLoader } from "./general/"

const Account = () => {
  const [appointments, setAppointments] = useState(null)
  const [loading, setLoading] = useState(true)
  const isAdmin = useUserInfoStore((state) => state.isAdmin)
  const email = useUserInfoStore((state) => state.email)

  const setTakenDates = useAppointmentOptionsStore((state) => state.setTakenDates)
  const setIssues = useAppointmentOptionsStore((state) => state.setIssues)
  const issues = useAppointmentOptionsStore((state) => state.issues)
  const takenDates = useAppointmentOptionsStore((state) => state.takenDates)
  const toast = useToast()

  const navigate = useNavigate()

  useEffect(() => {
    const fetch = async () => {
      if (!appointments) {
        try {
          if (isAdmin) {
            navigate(ROUTE_ADMIN)
          }
          setAppointments((await api.getAppointments()).data)
          if (!issues || issues.length === 0) {
            setIssues((await api.getIssues()).data)
          }
          const storedDates = (await api.getTakenDates()).data
          console.log(storedDates)
          const updatedTakenDates = takenDates ? takenDates : []
          updatedTakenDates.push(...storedDates)

          setTakenDates(updatedTakenDates)
        } catch (error) {
          console.log(error)
          toast(requestFailedToast)
        } finally {
          setLoading(false)
        }
      }
    }
    fetch()
  }, [appointments, isAdmin, issues, navigate, setAppointments, setIssues, setTakenDates, takenDates, toast])

  const onAppointmentCreated = (appointment) => {
    api
      .getAppointments()
      .then((res) => {
        console.log(res.data)
        setAppointments(res.data)
      })
      .catch((err) => {
        toast(requestFailedToast)
        setLoading(false)
      })
  }

  const deleteCallback = (id: string) => {
    const uodatedAppointments = appointments.filter((appointment) => appointment._id !== id)
    setAppointments(uodatedAppointments)
  }

  const appointmentsCards = appointments
    ?.sort((a, b) => {
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    })
    ?.map((appointment) => (
      <Appointment key={appointment._id} appointment={appointment} deleteCallback={deleteCallback} />
    ))

  const nextAppointment = appointments
    ?.sort((a, b) => {
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    })
    ?.find((appointment) => new Date(appointment.datetime).getTime() > Date.now())
  const nextAppointmentDatetime = nextAppointment?.datetime
  return (
    <Flex flexFlow="row" w="100%">
      <Sidebar username={email} isAdmin={isAdmin} />
      <Flex flexFlow="column" alignItems="center" pr={25} pt={25} pl={25} w={{ base: "90%", md: "60%" }}>
        <VStack maxH="80vh" gap={0.25} mt={20} minW="30wh" w="100%" boxShadow="0 4px 8px rgba(0,0,0,0.7)" zIndex={1}>
          <AppointmentsControlPanel
            creationCallback={onAppointmentCreated}
            nextAppointmentDatetime={nextAppointmentDatetime}
            isLoading={loading}
          />

          {loading || appointmentsCards.length > 0 ? (
            <VStack w="100%" overflowY="auto" overflowX="hidden">
              {loading ? (
                // Display skeletons while loading
                <SkeletonLoader count={3} />
              ) : (
                appointmentsCards
              )}
            </VStack>
          ) : (
            <Box h="80vh">
              <Heading fontSize="sm" p="0" mt="35vh" display="flex" justifyContent="center" alignItems="center">
                Schedule an appointment to make it appear!
              </Heading>
            </Box>
          )}
        </VStack>
      </Flex>
    </Flex>
  )
}

export default Account
