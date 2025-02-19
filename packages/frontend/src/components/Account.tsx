import { Box, Flex, Heading, useToast, VStack } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import { useAppointmentOptionsStore, useUserInfoStore } from "../storage"
import "../styles/style.css"
import { ROUTE_ADMIN } from "../utils/routes"
import { requestFailedToast } from "./alerts"
import AppointmentPanel from "./AppointmentPanel"
import AppointmentsControlPanel from "./AppointmentsControlPanel"
import { SkeletonLoader } from "./general/"
import Sidebar from "./Sidebar"
import AlertPanel from "./AlertPanel"
import { Appointment } from "devextreme/ui/scheduler"

const Account = () => {
  const [appointments, setAppointments] = useState(null)
  const [loading, setLoading] = useState(true)
  const [alerts, setAlerts] = useState([])
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
          const updatedTakenDates = takenDates ? takenDates : []
          updatedTakenDates.length = 0
          updatedTakenDates.push(...storedDates)

          setTakenDates(updatedTakenDates)

          const alerts = (await api.getAlerts()).data
          setAlerts(alerts)
        } catch (error) {
          toast(requestFailedToast)
          throw error
        } finally {
          setLoading(false)
        }
      }
    }
    let interval
    try {
      if (!appointments) {
        fetch()
        interval = setInterval(fetch, 10000)
      }
    } catch (err) {
      if (interval) clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [appointments, isAdmin, issues, navigate, setAppointments, setIssues, setTakenDates, takenDates, toast])

  const onAppointmentCreatedOrEdited = (appointment: Appointment | null) => {
    api
      .getAppointments()
      .then((res) => {
        setAppointments(
          res.data?.sort((a, b) => {
            return new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
          }),
        )
      })
      .then(async (res) => {
        const storedDates = (await api.getTakenDates()).data
        const updatedTakenDates = []
        updatedTakenDates.push(...storedDates)

        setTakenDates(updatedTakenDates)
      })
      .catch((err) => {
        toast(requestFailedToast)
        setLoading(false)
      })
  }

  const deleteCallback = (id: string) => {
    onAppointmentCreatedOrEdited(null)
  }

  const appointmentsCards = appointments
    ?.sort((a, b) => {
      return new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    })
    .map((appointment) => (
      <AppointmentPanel
        editCallback={onAppointmentCreatedOrEdited}
        key={appointment._id}
        appointment={appointment}
        deleteCallback={deleteCallback}
      />
    ))

  // sort by date
  const nextAppointment = appointments
    ?.sort((a, b) => {
      return new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    })
    ?.find((appointment) => new Date(appointment.datetime).getTime() > Date.now())

  const nextAppointmentDatetime = nextAppointment?.datetime
  return (
    <Flex flexFlow="row" w="100%" h="100%" justifyContent="center">
      <Sidebar username={email} isAdmin={isAdmin} />
      <Flex flexFlow="column" alignItems="center" pr={25} pt={5} pl={25} w={{ base: "90%", md: "60%" }}>
        <VStack maxH="80vh" gap={0.25} minW="30wh" w="100%" boxShadow="0 4px 8px rgba(0,0,0,0.7)" zIndex={1}>
          <AppointmentsControlPanel
            creationCallback={onAppointmentCreatedOrEdited}
            nextAppointmentDatetime={nextAppointmentDatetime}
            isLoading={loading}
          />

          {loading || (appointmentsCards && appointmentsCards.length && appointmentsCards.length > 0) ? (
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
      <AlertPanel alerts={alerts} />
    </Flex>
  )
}

export default Account
