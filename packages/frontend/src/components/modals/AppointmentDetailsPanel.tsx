import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Text,
    ModalOverlay,
    Select,
    Textarea,
    useToast,
    FormErrorMessage
} from "@chakra-ui/react";
import { Form } from "react-router-dom";
import { AppointmentOptionsContext } from "../../storage";
import { ResponsiveDayPicker } from "../general";
import { api, emitAppointment, EVENT_APPOINTMENTS_FREE, EVENT_APPOINTMENTS_STORE } from "../../api";
import { REGEX_ONLY_NUMBERS } from "../../utils/regex";
import {
    requestSucceeded,
    requestFailedToast,
    NoChangedHaveBeenMade
} from "../alerts/toasts";
import * as jsonpatch from 'fast-json-patch';
import * as yup from 'yup'; // Import yup for validation
import getTakenDays, { getTakenHoursByDay } from "../../utils/appointmentDateUtils";

// Validation schema using yup
const validationSchema = yup.object().shape({
    selectedIssueId: yup.string().required("Issue is required"),
    description: yup.string().required("Description is required"),
    catalogNumber: yup.string().required("Catalog Number is required"),
    selectedDay: yup.date().required("Date is required"),
    selectedHour: yup.string().required("Hour is required")
});

interface AppointmentDetailsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    initialRef;
    finalRef;
    operationCallback: (appointment) => void;
    appointmentToEdit
}

function AppointmentDetailsPanel({
    isOpen,
    onClose,
    initialRef,
    finalRef,
    operationCallback,
    appointmentToEdit = null
}: AppointmentDetailsPanelProps) {
    const { issues, takenDates, userId } = useContext(AppointmentOptionsContext);
    const [description, setDescription] = useState("");
    const [selectedIssueId, setSelectedIssueId] = useState(null);
    const [catalogNumber, setCatalogNumber] = useState("");
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false); // State to track overall form validity
    const [errors, setErrors] = useState(null); // State to store validation errors
    const toast = useToast(requestSucceeded);

    // Effect to update form validity whenever any required field changes
    useEffect(() => {
        validationSchema.isValid({
            selectedIssueId,
            description,
            catalogNumber,
            selectedDay,
            selectedHour
        }).then(valid => setIsFormValid(valid));
    }, [selectedIssueId, description, catalogNumber, selectedDay, selectedHour]);

    useEffect(() => {
        if (appointmentToEdit) {
            setDescription(appointmentToEdit.description);
            setSelectedIssueId(appointmentToEdit.issue._id);
            setCatalogNumber(appointmentToEdit.product.catalogNumber);
            setSelectedDay(new Date(appointmentToEdit.datetime));
            setSelectedHour(new Date(appointmentToEdit.datetime).getHours());
        }
    }, [appointmentToEdit]);

    const generateIssueOptions = () => {
        const optionsByTitle = Object.entries(issues)?.map(([title, details]) => {
            const titleItem = (
                <option
                    value={title}
                    key={title}
                    disabled
                    style={{ fontWeight: "bold", fontStyle: "italic", color: "black" }}
                >
                    {title}
                </option>
            );
            const itemsOfTitle = [titleItem];

            details.forEach((item) => {
                itemsOfTitle.push(
                    <option
                        value={item._id}
                        key={item._id}
                        style={{ color: "black" }}
                    >
                        <span style={{ color: "black" }}>{item.description}</span>
                    </option>
                );
            });

            return itemsOfTitle;
        });

        const allOptions = [];
        optionsByTitle.forEach((item) => allOptions.push(...item));
        return allOptions;
    };

    const onIssueSelected = (event) => {
        setSelectedIssueId(event.target.value);
    };

    const onDescriptionChanged = (event) => {
        setDescription(event.target.value);
    };

    const onCatalogNumberChanged = (event) => {
        if (new RegExp(REGEX_ONLY_NUMBERS).test(event.target.value)) {
            setCatalogNumber(event.target.value);
        }
    };

    const onDaySelected = (day: Date) => {
        setSelectedDay(day);
    }

    const onHourSelected = (event) => {
        const selectedTime = new Date(new Date(selectedDay).setHours(event.target.value))

        // Frees only if there is something selected
        if (selectedHour) {
            emitAppointment(EVENT_APPOINTMENTS_FREE, {
                datetime: new Date(new Date(selectedDay).setHours(selectedHour)).toISOString(),
                issue: issues[selectedIssueId],
                description,
                product: {
                    catalogNumber
                },
                customer: userId
            })
        }
        if (selectedTime) {
            emitAppointment(EVENT_APPOINTMENTS_STORE, {
                datetime: new Date(new Date(selectedTime).setHours(event.target.value)).toISOString(),
                issue: issues[selectedIssueId],
                description,
                product: {
                    catalogNumber
                },
                customer: userId
            })
        }
        setSelectedHour(event.target.value);
    }

    const generateOptionalTimes = (takenHours: Date[], selectedDay: null | Date) => {
        const hours = takenHours.map((hour) => { return hour.getHours() });
        const options = [];
        const startHour = 8;
        const endHour = 22;
        for (let hour = startHour; hour < endHour; hour++) {
            let takenHourDate;

            if (selectedDay) {
                takenHourDate = new Date(new Date(selectedDay).setHours(hour));
            }
            // Checks if the hour is already taken or not pre-selected by the user (stored in the db)
            if (!hours.find(takenHour => takenHour === hour || takenHour === new Date(appointmentToEdit).getHours())) {
                // Generate hours in format "HH:00" and "HH:30"

                options.push(
                    <option value={hour} key={hour} style={{ color: "black" }}>
                        <span style={{ color: "black" }}>{`${hour}:00`}</span>
                    </option>)

            }
        }

        return options;
    };

    const onCancel = () => {
        onClose();
        if (selectedDay) {
            emitAppointment(EVENT_APPOINTMENTS_FREE, {

                datetime: new Date(new Date(selectedDay).setHours(selectedHour)).toISOString(),
                issue: issues[selectedIssueId],
                description,
                product: {
                    catalogNumber
                }
            })
        }
    }

    const handleSubmit = () => {
        validationSchema.validate({
            selectedIssueId,
            description,
            catalogNumber,
            selectedDay,
            selectedHour
        }, { abortEarly: false }).then(() => {
            if (appointmentToEdit) {
                const origin = {
                    description: description,
                    issue: selectedIssueId,
                    datetime: new Date().toISOString(),
                    catalogNumber: catalogNumber
                };

                const edited = {
                    description: description,
                    issue: selectedIssueId,
                    datetime: new Date(new Date(selectedDay).setHours(selectedHour)).toISOString(),
                    catalogNumber: catalogNumber
                };

                const operations = jsonpatch.compare(origin, edited);

                if (operations.length === 0) {
                    toast(NoChangedHaveBeenMade);
                } else {
                    onClose();
                    api
                        .editAppointment(appointmentToEdit._id, operations)
                        .then(() => {
                            toast(requestSucceeded);
                            operationCallback(edited);
                        })
                        .catch((error) => {
                            toast(requestFailedToast);
                        });
                }
            } else {
                onClose();

                const appointment = {
                    description: description,
                    issue: selectedIssueId,
                    datetime: new Date(new Date(selectedDay).setHours(selectedHour)).toISOString(),
                    product: "667e18ad75fde3dfe38ef27b"
                };

                api
                    .createAppointment({ appointment })
                    .then(() => {
                        toast(requestSucceeded);
                        operationCallback(appointment);
                    })
                    .catch((error) => {
                        toast(requestFailedToast);
                    });
            }
        }).catch((validationErrors) => {
            const formattedErrors = {};
            validationErrors.inner.forEach(error => {
                formattedErrors[error.path] = error.message;
            });
            setErrors(formattedErrors);
        });
    };

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
                        {appointmentToEdit ? (
                            <Text>Edit your appointment!</Text>
                        ) : (
                            <Text>Schedule an appointment!</Text>
                        )}
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
                                <FormErrorMessage><Text variant="error">{errors?.selectedIssueId}</Text></FormErrorMessage>
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
                                <FormErrorMessage><Text variant="error">{errors?.description}</Text></FormErrorMessage>
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
                                <FormErrorMessage><Text variant="error">{errors?.catalogNumber}</Text></FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4} isInvalid={!!errors?.selectedDay}>
                                <FormLabel>Date</FormLabel>
                                <ResponsiveDayPicker
                                    disableDays={getTakenDays(takenDates)}
                                    preSelectedDate={selectedDay}
                                    selectCallback={onDaySelected}
                                />
                                <FormErrorMessage><Text variant="error">{errors?.selectedDay}</Text></FormErrorMessage>
                            </FormControl>

                            <FormControl mt={4} isInvalid={!!errors?.selectedHour}>
                                <FormLabel>Hour</FormLabel>
                                <Select
                                    value={selectedHour}
                                    variant="normal"
                                    onChange={onHourSelected}
                                    placeholder="Select an hour"
                                >
                                    {generateOptionalTimes(getTakenHoursByDay(takenDates, selectedDay), selectedDay)}
                                </Select>
                                <FormErrorMessage><Text variant="error">{errors?.selectedHour}</Text></FormErrorMessage>
                            </FormControl>
                        </Form>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            variant="alert"
                            onClick={handleSubmit}
                            color="white"
                            mr={3}
                            disabled={!isFormValid} // Disable button if form is not valid
                        >
                            {appointmentToEdit ? <Text>Edit</Text> : <Text>Create</Text>}
                        </Button>
                        <Button variant="alert" onClick={onCancel} color="white">
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AppointmentDetailsPanel;
