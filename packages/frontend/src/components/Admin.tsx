import { Flex, HStack, useToast } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { api } from "../api"
import { useAppointmentOptionsStore, useUserInfoStore } from "../storage"
import { requestFailedToast } from "./alerts"
import AppointmentScheduler from "./AppointmentScheduler"
import Sidebar from "./Sidebar"
import { ROUTE_ACCOUNT } from "../utils/routes"
import { useNavigate } from "react-router-dom"

const Admin = () => {
  const isAdmin = useUserInfoStore((state) => state.isAdmin)
  const email = useUserInfoStore((state) => state.email)
  const setTakenDates = useAppointmentOptionsStore((state) => state.setTakenDates)
  const setIssues = useAppointmentOptionsStore((state) => state.setIssues)
  const issues = useAppointmentOptionsStore((state) => state.issues)

  const navigate = useNavigate()
  const [appointments, setAppointments] = useState(null)

  const toast = useToast()

  useEffect(() => {
    async function fetch() {
      try {
        if (!isAdmin) {
          navigate(ROUTE_ACCOUNT)
        }
        setAppointments((await api.getAppointments()).data)
        if (!issues || issues.length === 0) {
          setIssues((await api.getIssues()).data)
        }
        const storedDates = (await api.getTakenDates()).data
        const updatedTakenDates = []
        updatedTakenDates.push(...storedDates)

        setTakenDates(updatedTakenDates)
      } catch (error) {
        toast(requestFailedToast)
        throw error
      }
    }
    let interval
    try {
      if (!appointments) {
        fetch()
        interval = setInterval(fetch, 120000)
      }
    } catch (err) {
      if (interval) clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [appointments, isAdmin, issues, navigate, setAppointments, setIssues, setTakenDates, toast])

  return (
    <HStack h="100%">
      <Sidebar username={email} isAdmin={isAdmin} />
      <Flex ml={5}>
        |<AppointmentScheduler />
      </Flex>
    </HStack>
  )
}

export default Admin
