import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons"
import { Box, Flex, Heading, IconButton, useDisclosure } from "@chakra-ui/react"
import React from "react"
import { getFormattedDate } from "../theme"
import AppointmentDetailsPanel from "./modals/AppointmentDetailsPanel"

interface AppointmentControlPanelProps {
  nextAppointmentDatetime: string
  isLoading: boolean
}

const AppointmentsControlPanel = ({ nextAppointmentDatetime, isLoading }: AppointmentControlPanelProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  return (
    <Flex width="100%" justify="center" h="2em" mb="2">
      <Box>
        {!isLoading ? (
          nextAppointmentDatetime ? (
            <Heading size="xs">Next appointment: {getFormattedDate(nextAppointmentDatetime)}</Heading>
          ) : (
            <Heading size="xs">You have no pending appointments</Heading>
          )
        ) : null}
      </Box>
      <Box marginLeft="auto" marginRight="0">
        <IconButton aria-label="Schedule an appointment" variant="square" icon={<AddIcon m={0.5} />} onClick={onOpen} />
        <IconButton aria-label="Edit an appointment" variant="square" icon={<EditIcon m={0.5} />} />
        <IconButton aria-label="Cancel an appointment" variant="square" icon={<DeleteIcon m={0.5} />} />
        <AppointmentDetailsPanel isOpen={isOpen} onClose={onClose} initialRef={initialRef} finalRef={finalRef} />
      </Box>
    </Flex>
  )
}

export default AppointmentsControlPanel
