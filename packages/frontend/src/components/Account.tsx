import { Box, Flex, Heading, useToast, VStack } from "@chakra-ui/react"
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api"
import { AppointmentOptionsContext } from "../storage"
import "../styles/style.css"
import { requestFailedToast } from "./alerts"
import Appointment from "./Appointment"
import AppointmentsControlPanel from "./AppointmentsControlPanel"
import { Sidebar } from "./general"
import SkeletonLoader from "./general/SkeletonLoader"

const Account = () => {
    const [appointments, setAppointments] = useState(null)
    const [loading, setLoading] = useState(true)

    const { issues,
        setIssues,
        takenDates,
        setTakenDates, email } = useContext(AppointmentOptionsContext)
    const toast = useToast()
    const navigate = useNavigate()

    useEffect(() => {
        const fetch = async () => {
            if (!appointments) {
                try {
                    console.log("render")
                    setAppointments((await api.getAppointments()).data)
                    if (!issues || issues.length === 0) {
                        setIssues((await api.getIssues()).data)
                    }
                    const storedDates = (await api
                        .getTakenDates()).data;
                    console.log(storedDates)
                    const updatedTakenDates = takenDates ? takenDates : []
                    updatedTakenDates.push(...storedDates)

                    setTakenDates(updatedTakenDates)
                } catch (error) {
                    console.log(error);
                    toast(requestFailedToast)
                }
                finally { setLoading(false) }
            }
        }
        fetch()
    }, [appointments, issues, setAppointments, setIssues, setTakenDates, takenDates, toast])

    const onAppointmentCreated = (appointment) => {
        api
            .getAppointments()
            .then((res) => {
                setAppointments(res.data)
            })
            .catch((err) => {
                toast(requestFailedToast)
                setLoading(false)
            })
    }

    const deleteCallback = (id: string) => {
        const uodatedAppointments = appointments.filter((appointment) => appointment._id !== id)
        setAppointments(uodatedAppointments)
    }

    const appointmentsCards = appointments
        ?.sort((a, b) => {
            return new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        })
        ?.map((appointment) => (
            <Appointment key={appointment._id} appointment={appointment} deleteCallback={deleteCallback} />
        ))

    const nextAppointment = appointments
        ?.sort((a, b) => {
            return new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        })
        ?.find((appointment) => new Date(appointment.datetime).getTime() > Date.now())
    const nextAppointmentDatetime = nextAppointment?.datetime
    return (
        <Flex flexFlow="row"><Sidebar username={email} />
            <Flex flexFlow="column" alignItems="center" pr={25} pt={25} pl={25} w={{ base: "90%", md: "60%" }}>
                <VStack maxH="80vh" gap={0.25} mt={20} minW="30wh" w="100%" boxShadow="0 4px 8px rgba(0,0,0,0.7)" zIndex={1}>
                    <AppointmentsControlPanel creationCallback={onAppointmentCreated} nextAppointmentDatetime={nextAppointmentDatetime} isLoading={loading} />

                    {loading || appointmentsCards.length > 0 ? (
                        <VStack w="100%" overflowY="auto" overflowX="hidden">
                            {loading ? (
                                // Display skeletons while loading
                                <SkeletonLoader />
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
        </Flex>
    )
}

export default Account
