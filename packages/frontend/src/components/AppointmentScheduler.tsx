import "devextreme/dist/css/dx.dark.compact.css"

import { Box, useDisclosure, useToast } from "@chakra-ui/react"
import { Editing, Scheduler, View } from "devextreme-react/scheduler"
import { AppointmentClickEvent, CellClickEvent } from "devextreme/ui/scheduler"
import React, { useEffect, useRef, useState } from "react"
import { api } from "../api"
import { requestFailedToast } from "./alerts"
import { AppointmentDetailsPanel } from "./modals"
import { useAppointmentOptionsStore } from "../storage"

const generateTitle = (machanicName: string, issue: string): string => {
  return `${machanicName} - ${issue}`
}

const AppointmentScheduler = () => {
  const takenDates = useAppointmentOptionsStore((state) => state.takenDates)
  const [appointments, setAppointments] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const toast = useToast()
  const initialRef = useRef()
  const finalRef = useRef()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const generateData = (appointmentsByMechanic) => {
    const data = []

    appointmentsByMechanic.forEach((mechanic) => {
      mechanic.appointments.forEach((appointment) => {
        const duration = appointment.issue.category.duration * 60 * 60 * 1000
        const endDate = new Date(new Date(appointment.datetime).getTime() + duration)
        const mechanicData = {
          title: generateTitle(mechanic.fullName, appointment.issue.description),
          startDate: new Date(appointment.datetime),
          endDate: endDate,
          text: appointment.description,
          ...appointment,
        }

        data.push(mechanicData)
      })
    })

    return data
  }

  useEffect(() => {
    async function fetch() {
      try {
        const response = await api.getMechanics()
        setAppointments(generateData(response.data))
      } catch (error) {
        toast(requestFailedToast)
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
  }, [appointments, toast])

  const handleAppointmentClick = (e: AppointmentClickEvent) => {
    e.cancel = true

    setSelectedAppointment(e.appointmentData)
    onOpen()
  }

  const onOperationCompleted = (appointment) => {
    api
      .getMechanics()
      .then((response) => {
        setAppointments(generateData(response.data))
      })
      .then(async (response) => {
        const storedDates = (await api.getTakenDates()).data
        const updatedTakenDates = takenDates ? takenDates : []
        updatedTakenDates.length = 0
        updatedTakenDates.push(...storedDates)
      })
      .catch((err) => {
        toast(requestFailedToast)
      })
  }
  const onCellClick = (e: CellClickEvent) => {
    e.cancel = true
  }

  return (
    <Box maxH="70vh" w="90%" overflowY="auto">
      <Scheduler
        dataSource={appointments}
        textExpr="title"
        onAppointmentClick={handleAppointmentClick}
        onCellClick={onCellClick}
        recurrenceRuleExpr="recurrence"
      >
        <View type="day" startDayHour={8} endDayHour={22} />
        <Editing allowDragging={false} />
      </Scheduler>
      <AppointmentDetailsPanel
        administrate={true}
        onDeletedCallback={onOperationCompleted}
        appointmentToEdit={selectedAppointment}
        operationCallback={onOperationCompleted}
        isOpen={isOpen}
        onClose={onClose}
        initialRef={initialRef}
        finalRef={finalRef}
      />
    </Box>
  )
}

export default AppointmentScheduler
