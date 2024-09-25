import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, IconButton, Text, useDisclosure, useToast } from "@chakra-ui/react"
import React from "react"
import { api } from "../api"
import { useAppointmentOptionsStore } from "../storage"
import { getFormattedDate } from "../theme"
import getTakenDays from "../utils/appointmentDateUtils"
import { requestFailedToast } from "./alerts"
import AppointmentDetailsPanel from "./modals/AppointmentDetailsPanel"

interface AppointmentControlPanelProps {
  nextAppointmentDatetime: string
  isLoading: boolean
  creationCallback: (appointmentCallback) => void
}

const AppointmentsControlPanel = ({
  nextAppointmentDatetime,
  isLoading,
  creationCallback,
}: AppointmentControlPanelProps) => {
  const onOpenCreateCallback = () => {
    api
      .getTakenDates()
      .then((res) => {
        const takenSavedDates: Array<any> = getTakenDays(res.data)
        const allTakenDates = []
        allTakenDates.push(...takenSavedDates)
        setTakenDates([...allTakenDates])
        onOpen()
      })
      .catch((err) => {
        toast(requestFailedToast)
      })
  }

  const toast = useToast()
  const setTakenDates = useAppointmentOptionsStore((state) => state.setTakenDates)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  return (
    <Flex width="100%" justify="center" h="2em" mb="2">
      <Box pl={2} pt={2}>
        {!isLoading ? (
          nextAppointmentDatetime ? (
            <Text color="dark.100" fontWeight="bold" size="xs">
              Next appointment: {getFormattedDate(nextAppointmentDatetime)}
            </Text>
          ) : (
            <Text color="dark.100" fontWeight="bold" size="xs">
              You have no pending appointments
            </Text>
          )
        ) : null}
      </Box>
      <Box marginLeft="auto" marginRight="0">
        <IconButton
          aria-label="Schedule an appointment"
          variant="square"
          size="sm"
          _hover={{ border: "1px solid white" }}
          icon={<AddIcon m={0.5} />}
          onClick={onOpenCreateCallback}
        />
        <IconButton aria-label="Edit an appointment" display="none" variant="square" icon={<EditIcon m={0.5} />} />
        <IconButton aria-label="Cancel an appointment" display="none" variant="square" icon={<DeleteIcon m={0.5} />} />
        <AppointmentDetailsPanel
          appointmentToEdit={null}
          operationCallback={creationCallback}
          isOpen={isOpen}
          onClose={onClose}
          initialRef={initialRef}
          finalRef={finalRef}
        />
      </Box>
    </Flex>
  )
}

export default AppointmentsControlPanel
