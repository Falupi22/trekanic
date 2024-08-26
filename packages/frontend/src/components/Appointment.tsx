import { DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons" // Import icons as needed
import {
  Badge,
  Card,
  Flex,
  HStack,
  IconButton,
  Image,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { api } from "../api"
import { useAppointmentOptionsStore } from "../storage"
import { getFormattedDate } from "../theme"
import getTakenDays from "../utils/appointmentDateUtils"
import { EnsureDialog } from "./alerts"
import { requestFailedToast, requestSucceededToast } from "./alerts/toasts"
import AppointmentDetailsPanel from "./modals/AppointmentDetailsPanel"

const Appointment = ({ appointment, deleteCallback }) => {
  const { _id, issue, datetime, description, mechanic, product } = appointment
  const [descriptionOfProblem, setDescriptionOfProblem] = useState(description)
  const [issueOfInterest, setIssueOfInterest] = useState(issue)
  const [productToFix, setProductToFix] = useState(product)
  const [dateAndTime, setDateAndTime] = useState(datetime)
  const [mechanicInCharge, setMechanicInCharge] = useState(mechanic)
  const [displayEllipsis, setDisplayEllipsis] = useState(false)
  const setTakenDates = useAppointmentOptionsStore((state) => state.setTakenDates)
  const takenDates = useAppointmentOptionsStore((state) => state.takenDates)
  const cancelRef = React.useRef()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit } = useDisclosure()
  const initialRefEdit = React.useRef(null)
  const finalRefEdit = React.useRef(null)

  useEffect(() => {
    setDescriptionOfProblem(description)
    setIssueOfInterest(issue)
    setProductToFix(product)
    setDateAndTime(datetime)
    setMechanicInCharge(mechanic)
  }, [datetime, description, issue, mechanic, product])

  const onOpenEditCallback = () => {
    api
      .getTakenDates()
      .then((res) => {
        const takenSavedDates: Array<any> = getTakenDays(res.data)
        const allTakenDates = []
        allTakenDates.push(...takenSavedDates, ...takenDates)
        setTakenDates([...allTakenDates])
        onOpenEdit()
      })
      .catch((err) => {
        toast(requestFailedToast)
      })
  }

  const onEditCompleted = (appointment) => {
    api
      .getAppointments()
      .then((res) => {
        const currentAppointment = res.data?.find((existingAppointment) => existingAppointment._id === _id)
        if (currentAppointment) {
          setDescriptionOfProblem(currentAppointment.description)
          setIssueOfInterest(currentAppointment.issue)
          setProductToFix(currentAppointment.product)
          setDateAndTime(currentAppointment.datetime)
          setMechanicInCharge(currentAppointment.mechanic)
        }
      })
      .catch((err) => {
        toast(requestFailedToast)
      })
  }

  const handleMouseEnter = () => {
    setDisplayEllipsis(true)
  }

  const handleMouseLeave = () => {
    setDisplayEllipsis(false)
  }

  const cancelAppointment = () => {
    onOpen()
    onClose()
    api
      .cancelAppointment(_id)
      .then((data) => {
        toast(requestSucceededToast)
        deleteCallback(_id)
      })
      .catch((error) => {
        toast(requestFailedToast)
      })
  }

  return (
    <Card maxH="10em" bg="dark.300" m={1} w="98%" shadow="xs">
      <Flex align="center" w="100%" bg="dark.400" p={2}>
        <Image
          w="1.5em"
          mr={3}
          src={`data:image/svg+xml;utf8,${encodeURIComponent(issueOfInterest?.category?.iconPath)}`}
        />
        <Text fontWeight="bold"> {issueOfInterest?.description}</Text>
        <Spacer />
        <Badge bg="dark.200">{productToFix?.name}</Badge>
        <HStack onMouseEnter={handleMouseEnter} bg="dark.400" onMouseLeave={handleMouseLeave} ml={2} mr="3">
          {displayEllipsis ? (
            <HStack>
              {" "}
              <IconButton
                aria-label="Ellipsis"
                variant="square"
                size="sm"
                _hover={{ border: "1px solid white" }}
                icon={<EditIcon />}
                ml="4"
                onClick={onOpenEditCallback}
              />
              <IconButton
                aria-label="Ellipsis"
                variant="square"
                size="sm"
                _hover={{ border: "1px solid white" }}
                icon={<DeleteIcon />}
                onClick={onOpen}
              />
            </HStack>
          ) : null}

          <AppointmentDetailsPanel
            appointmentToEdit={appointment}
            operationCallback={onEditCompleted}
            isOpen={isOpenEdit}
            onClose={onCloseEdit}
            initialRef={initialRefEdit}
            finalRef={finalRefEdit}
          />
          {Date.parse(appointment.datetime) > Date.now() ? (
            <IconButton
              aria-label="Ellipsis"
              variant="square"
              size="sm"
              _hover={{ border: "1px solid dark.50" }}
              icon={<HamburgerIcon />}
            />
          ) : null}
        </HStack>
        <EnsureDialog isOpen={isOpen} onCommit={cancelAppointment} onCancel={onClose} cancelRef={cancelRef} />
      </Flex>
      <VStack align="start" spacing="0.8" p={2}>
        <Text fontSize="sm">{descriptionOfProblem}</Text>
        <Text fontSize="sm">{mechanicInCharge?.fullName}</Text>
        <Text fontSize="sm">{getFormattedDate(dateAndTime)}</Text>
        <Text fontSize="sm"> ₪{issueOfInterest?.price}</Text>
      </VStack>
    </Card>
  )
}

export default Appointment
