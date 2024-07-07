import { AddIcon, DeleteIcon, EditIcon, SmallAddIcon } from "@chakra-ui/icons"
import { Box, Flex, Heading, IconButton, useDisclosure, Text, useToast } from "@chakra-ui/react"
import React, { useContext } from "react"
import { getFormattedDate } from "../theme"
import AppointmentDetailsPanel from "./modals/AppointmentDetailsPanel"
import { api } from "../api"
import getTakenDays from "../utils/appointmentDateUtils"
import { requestFailedToast } from "./alerts"
import { AppointmentOptionsContext } from "../storage"

interface AppointmentControlPanelProps {
  nextAppointmentDatetime: string
  isLoading: boolean,
  creationCallback: (appointmentCallback) => void
}

const AppointmentsControlPanel = ({ nextAppointmentDatetime, isLoading, creationCallback }: AppointmentControlPanelProps) => {
  const onOpenCreateCallback = () => {
    api
      .getTakenDates()
      .then((res) => {
        console.log(res.data)
        const takenSavedDates: Array<any> = getTakenDays(res.data);
        const allTakenDates = []
        allTakenDates.push(...takenSavedDates, ...takenDates)
        setTakenDates([...allTakenDates])
        onOpen()
      }).catch((err) => {
        console.log(err)
        toast(requestFailedToast)
      })
  }

  const toast = useToast()
  const { takenDates, setTakenDates } = useContext(AppointmentOptionsContext)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  return (
    <Flex width="100%" justify="center" h="2em" mb="2">
      <Box pl={2} pt={2}>
        {!isLoading ? (
          nextAppointmentDatetime ? (
            <Text color="dark.100" fontWeight="bold" size="xs">Next appointment: {getFormattedDate(nextAppointmentDatetime)}</Text>
          ) : (
            <Text color="dark.100" fontWeight="bold" size="xs">You have no pending appointments</Text>
          )
        ) : null}
      </Box>
      <Box marginLeft="auto" marginRight="0">
        <IconButton aria-label="Schedule an appointment" variant="square"
          size="sm"
          _hover={{ border: "1px solid white" }} icon={<AddIcon m={0.5} />} onClick={onOpenCreateCallback} />
        <IconButton aria-label="Edit an appointment" display="none" variant="square" icon={<EditIcon m={0.5} />} />
        <IconButton aria-label="Cancel an appointment" display="none" variant="square" icon={<DeleteIcon m={0.5} />} />
        <AppointmentDetailsPanel appointmentToEdit={null} operationCallback={creationCallback} isOpen={isOpen} onClose={onClose} initialRef={initialRef} finalRef={finalRef} />
      </Box>
    </Flex>
  )
}

export default AppointmentsControlPanel
