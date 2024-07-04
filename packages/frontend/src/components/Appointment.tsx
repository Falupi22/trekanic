import { DeleteIcon, EditIcon, HamburgerIcon, TimeIcon } from "@chakra-ui/icons" // Import icons as needed
import {
  Badge,
  Box,
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
import React, { useState } from "react"
import { api } from "../api"
import { getFormattedDate } from "../theme"
import { EnsureDialog } from "./alerts"
import { requestFailedToast, requestSucceeded } from "./alerts/toasts"

const Appointment = ({ appointment, deleteCallback }) => {
  const { _id, issue, datetime, description, mechanic, product } = appointment
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [displayEllipsis, setDisplayEllipsis] = useState(false)
  const cancelRef = React.useRef()
  const toast = useToast()

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
        toast(requestSucceeded)
        deleteCallback(_id)
      })
      .catch((error) => {
        toast(requestFailedToast)
      })
  }

  return (
    <Card maxH="10em" bg="normal.200" pb="0.5" pl="3" pt="0.5" mr="0.5" ml="0.5" mt="0.8" w="40em" shadow="xs">
      <Flex align="center" m="1">
        <Image w="1.5em" mr="2" mb="1" src={`data:image/svg+xml;utf8,${encodeURIComponent(issue.category.iconPath)}`} />
        <Text fontWeight="bold"> {issue.description}</Text>
        <Spacer />
        <Badge>{product.name}</Badge>
        <HStack onMouseEnter={handleMouseEnter} bg="normal.200" onMouseLeave={handleMouseLeave}>
          {displayEllipsis ? (
            <HStack>
              {" "}
              <IconButton
                aria-label="Ellipsis"
                variant="square"
                bg="normal.200"
                size="sm"
                _hover={{ border: "1px solid gray" }}
                icon={<EditIcon />}
                ml="4"
              />
              <IconButton
                aria-label="Ellipsis"
                variant="square"
                bg="normal.200"
                size="sm"
                _hover={{ border: "1px solid gray" }}
                icon={<DeleteIcon />}
                onClick={onOpen}
              />
            </HStack>
          ) : null}

          <IconButton
            aria-label="Ellipsis"
            variant="square"
            bg="normal.200"
            size="sm"
            _hover={{ border: "1px solid gray" }}
            icon={<HamburgerIcon />}
          />
        </HStack>
        <EnsureDialog isOpen={isOpen} onCommit={cancelAppointment} onCancel={onClose} cancelRef={cancelRef} />
      </Flex>
      <VStack align="start" spacing="0.8">
        <Text fontSize="sm">{description}</Text>
        <Text fontSize="sm">{mechanic.fullName}</Text>
        <Text fontSize="sm">{getFormattedDate(datetime)}</Text>
        <Text fontSize="sm"> ₪{issue.price}</Text>
      </VStack>
      <Box textAlign="right" mb="0.1" mr="2">
        <TimeIcon color="green" />
      </Box>
    </Card>
  )
}

export default Appointment
