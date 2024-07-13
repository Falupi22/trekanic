import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react"
import * as jsonpatch from "fast-json-patch"
import React, { useEffect, useState } from "react"
import { Form } from "react-router-dom"
import * as yup from "yup" // Import yup for validation
import { api } from "../../api"
import { useAppointmentOptionsStore } from "../../storage"
import getTakenDays, { getTakenHoursByDay } from "../../utils/appointmentDateUtils"
import { REGEX_ONLY_NUMBERS } from "../../utils/regex"
import { NoChangesHaveBeenMadeToast, requestFailedToast, requestSucceededToast } from "../alerts/toasts"
import { ResponsiveDayPicker } from "../general"

// Validation schema using yup
const validationSchema = yup.object().shape({
  selectedIssueId: yup.string().required("Issue is required"),
  description: yup.string().required("Description is required"),
  catalogNumber: yup.string().required("Catalog Number is required"),
  selectedDay: yup.date().required("Date is required"),
  selectedHour: yup.string().required("Hour is required"),
})

interface AppointmentDetailsPanelProps {
  isOpen: boolean
  onClose: () => void
  initialRef
  finalRef
  operationCallback: (appointment) => void
  appointmentToEdit?
  administrate?: boolean
  onDeletedCallback?
}

function AppointmentDetailsPanel({
  isOpen,
  onClose,
  initialRef,
  finalRef,
  operationCallback,
  appointmentToEdit = null,
  administrate: administate = false,
  onDeletedCallback = () => {},
}: AppointmentDetailsPanelProps) {
  const issues = useAppointmentOptionsStore((state) => state.issues)
  const takenDates = useAppointmentOptionsStore((state) => state.takenDates)
  const [description, setDescription] = useState("")
  const [selectedIssueId, setSelectedIssueId] = useState(null)
  const [catalogNumber, setCatalogNumber] = useState("")
  const [selectedMechanicId, setSelectedMechanicId] = useState(null)
  const [freeMechanics, setFreeMechanics] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedHour, setSelectedHour] = useState(null)
  const [isFormValid, setIsFormValid] = useState(false) // State to track overall form validity
  const [errors, setErrors] = useState(null) // State to store validation errors
  const toast = useToast(requestSucceededToast)

  // Effect to update form validity whenever any required field changes
  useEffect(() => {
    validationSchema
      .isValid({
        selectedIssueId,
        description,
        catalogNumber,
        selectedDay,
        selectedHour,
      })
      .then((valid) => setIsFormValid(valid))
  }, [selectedIssueId, description, catalogNumber, selectedDay, selectedHour])

  useEffect(() => {
    if (appointmentToEdit) {
      setDescription(appointmentToEdit.description)
      setSelectedIssueId(appointmentToEdit.issue._id)
      setCatalogNumber(appointmentToEdit.product.catalogNumber)
      setSelectedDay(new Date(appointmentToEdit.datetime))
      setSelectedHour(new Date(appointmentToEdit.datetime).getHours())
    } else {
      setDescription("")
      setSelectedIssueId(null)
      setCatalogNumber("")
      setSelectedDay(null)
      setSelectedHour(null)
    }

    if (administate && appointmentToEdit) {
      api
        .getMechanicsByTime(new Date(appointmentToEdit.datetime))
        .then((res) => {
          setFreeMechanics(res.data)
        })
        .catch((err) => {
          toast(requestFailedToast)
        })
    }
  }, [administate, appointmentToEdit, toast])

  const generateIssueOptions = () => {
    const optionsByTitle = Object.entries(issues)?.map(([title, details]) => {
      const titleItem = (
        <option value={title} key={title} disabled style={{ fontWeight: "bold", fontStyle: "italic", color: "black" }}>
          {title}
        </option>
      )
      const itemsOfTitle = [titleItem]

      ;(details as unknown as Array<any>).forEach((item) => {
        itemsOfTitle.push(
          <option value={item._id} key={item._id} style={{ color: "black" }}>
            <span style={{ color: "black" }}>{item.description}</span>
          </option>,
        )
      })

      return itemsOfTitle
    })

    const allOptions = []
    optionsByTitle.forEach((item) => allOptions.push(...item))
    return allOptions
  }

  const generateMechanics = () => {
    const options = []

    if (freeMechanics) {
      freeMechanics.forEach((item) => {
        options.push(
          <option value={item._id} key={item._id} style={{ color: "black" }}>
            {item.fullName}
          </option>,
        )
      })
    }

    return options
  }

  const onIssueSelected = (event) => {
    setSelectedIssueId(event.target.value)
  }

  const onDescriptionChanged = (event) => {
    setDescription(event.target.value)
  }

  const onCatalogNumberChanged = (event) => {
    if (new RegExp(REGEX_ONLY_NUMBERS).test(event.target.value)) {
      setCatalogNumber(event.target.value)
    }
  }

  const onMechanicSelected = (event) => {
    setSelectedMechanicId(event.target.value)
  }

  const onDaySelected = (day: Date) => {
    if (administate) {
      const newTime = new Date(new Date(day).setHours(selectedHour))
      api
        .getMechanicsByTime(newTime)
        .then((res) => {
          setFreeMechanics(res.data as unknown as any[])
        })
        .catch((err) => {
          toast(requestFailedToast)
        })
        .finally(() => {})
    }

    setSelectedDay(day)
  }

  const onHourSelected = (event) => {
    setSelectedHour(event.target.value)
    if (administate) {
      const newTime = new Date(new Date(selectedDay).setHours(event.target.value))
      api
        .getMechanicsByTime(newTime)
        .then((res) => {
          setFreeMechanics(res.data as unknown as any[])
        })
        .catch((err) => {
          toast(requestFailedToast)
        })
        .finally(() => {})
    }
  }

  const generateOptionalTimes = (takenHours: Date[], selectedDay: null | Date) => {
    const options = []
    if (selectedDay) {
      const hours = takenHours.map((hour) => {
        return hour.getHours()
      })
      const startHour = 8
      const endHour = 22
      for (let hour = startHour; hour < endHour; hour++) {
        // Checks if the hour is already taken or not pre-selected by the user (stored in the db)
        if (!hours.find((takenHour) => takenHour === hour || takenHour === new Date(appointmentToEdit).getHours())) {
          // Generate hours in format "HH:00" and "HH:30"
          const day = new Date(Date.now()).getDate()
          const month = new Date(Date.now()).getMonth()
          const year = new Date(Date.now()).getFullYear()

          if (selectedDay.getDate() === day && selectedDay.getMonth() === month && selectedDay.getFullYear() === year) {
            const hourNow = new Date(Date.now()).getHours()
            if (hourNow > hour - 2) continue
          }
          options.push(
            <option value={hour} key={hour} style={{ color: "black" }}>
              <span style={{ color: "black" }}>{`${hour}:00`}</span>
            </option>,
          )
        }
      }
    }

    return options
  }

  const onCancel = () => {
    onClose()
  }

  const onDeleted = () => {
    onClose()
    api
      .cancelAppointment(appointmentToEdit._id)
      .then((data) => {
        toast(requestSucceededToast)
        onDeletedCallback(appointmentToEdit)
      })
      .catch((error) => {
        toast(requestFailedToast)
      })
  }

  const handleSubmit = () => {
    validationSchema
      .validate(
        {
          selectedIssueId,
          description,
          catalogNumber,
          selectedDay,
          selectedHour,
        },
        { abortEarly: false },
      )
      .then(() => {
        if (appointmentToEdit) {
          const origin = {
            description: appointmentToEdit.description,
            issue: appointmentToEdit.issue._id,
            datetime: new Date(appointmentToEdit.datetime).toISOString(),
            catalogNumber: appointmentToEdit.product.catalogNumber,
            mechanic: appointmentToEdit.mechanic,
          }

          const edited = {
            description: description,
            issue: selectedIssueId,
            datetime: new Date(new Date(selectedDay).setHours(selectedHour)).toISOString(),
            catalogNumber: catalogNumber,
            mechanic: selectedMechanicId ?? appointmentToEdit.mechanic,
          }

          console.log(origin.mechanic, edited.mechanic)

          const operations = jsonpatch.compare(origin, edited)
          console.log(operations)
          if (operations.length === 0) {
            toast(NoChangesHaveBeenMadeToast)
          } else {
            onClose()
            api
              .editAppointment(appointmentToEdit._id, operations)
              .then(() => {
                toast(requestSucceededToast)
                operationCallback(edited)
              })
              .catch((error) => {
                toast(requestFailedToast)
              })
          }
        } else {
          onClose()

          const appointment = {
            description: description,
            issue: selectedIssueId,
            datetime: new Date(new Date(selectedDay).setHours(selectedHour)).toISOString(),
            product: "667e18ad75fde3dfe38ef27b",
          }

          api
            .createAppointment({ appointment })
            .then(() => {
              toast(requestSucceededToast)
              operationCallback(appointment)
            })
            .catch((error) => {
              toast(requestFailedToast)
            })

          setDescription("")
          setSelectedIssueId(null)
          setCatalogNumber("")
          setSelectedDay(null)
          setSelectedHour(null)
        }
      })
      .catch((validationErrors) => {
        const formattedErrors = {}
        validationErrors.inner.forEach((error) => {
          formattedErrors[error.path] = error.message
        })
        setErrors(formattedErrors)
      })
  }

  return (
    <>
      <Modal
        scrollBehavior="inside"
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg="dark.300">
          <ModalHeader>
            {appointmentToEdit ? <Text>Edit your appointment!</Text> : <Text>Schedule an appointment!</Text>}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={3}>
            <Form onSubmit={handleSubmit}>
              <FormControl isInvalid={!!errors?.selectedIssueId}>
                <FormLabel>Issue</FormLabel>
                <Select
                  ref={initialRef}
                  value={selectedIssueId}
                  variant="normal"
                  onChange={onIssueSelected}
                  placeholder="Select an issue"
                >
                  {generateIssueOptions()}
                </Select>
                <FormErrorMessage>
                  <Text variant="error">{errors?.selectedIssueId}</Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors?.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  variant="normal"
                  maxLength={250}
                  value={description}
                  onChange={onDescriptionChanged}
                  placeholder="Description up to 250 characters"
                />
                <FormErrorMessage>
                  <Text variant="error">{errors?.description}</Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors?.catalogNumber}>
                <FormLabel>Product Catalog Number</FormLabel>
                <Input
                  maxLength={6}
                  variant="normal"
                  value={catalogNumber}
                  onChange={onCatalogNumberChanged}
                  placeholder="For example: 000234"
                />
                <FormErrorMessage>
                  <Text variant="error">{errors?.catalogNumber}</Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors?.selectedDay}>
                <FormLabel>Date</FormLabel>
                <ResponsiveDayPicker
                  disableDays={getTakenDays(takenDates)}
                  preSelectedDate={selectedDay}
                  selectCallback={onDaySelected}
                />
                <FormErrorMessage>
                  <Text variant="error">{errors?.selectedDay}</Text>
                </FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors?.selectedHour}>
                <FormLabel>Hour</FormLabel>
                <Select value={selectedHour} variant="normal" onChange={onHourSelected} placeholder="Select an hour">
                  {generateOptionalTimes(getTakenHoursByDay(takenDates, selectedDay), selectedDay)}
                </Select>
                <FormErrorMessage>
                  <Text variant="error">{errors?.selectedHour}</Text>
                </FormErrorMessage>
              </FormControl>

              {administate ? ( // Means it is an admin
                <FormControl mt={4}>
                  <FormLabel>Mechanic</FormLabel>
                  <Select
                    value={selectedMechanicId}
                    variant="normal"
                    onChange={onMechanicSelected}
                    placeholder="Select a mechanic (optional)"
                  >
                    {generateMechanics()}
                  </Select>
                  <FormErrorMessage>
                    <Text variant="error">{errors?.sesl}</Text>
                  </FormErrorMessage>
                </FormControl>
              ) : null}
            </Form>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="alert"
              onClick={handleSubmit}
              color="white"
              mr={1}
              disabled={!isFormValid} // Disable button if form is not valid
            >
              {appointmentToEdit ? <Text>Edit</Text> : <Text>Create</Text>}
            </Button>
            <Button variant="alert" onClick={onCancel} color="white">
              Cancel
            </Button>
            {administate ? (
              <Button variant="alert" onClick={onDeleted} color="white" bg="red">
                Delete
              </Button>
            ) : null}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AppointmentDetailsPanel
