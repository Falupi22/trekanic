import { useContext, useEffect, useState } from "react"
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  Text,
  Link,
  FormControl,
  InputRightElement,
  FormLabel,
  FormErrorMessage,
  HStack,
} from "@chakra-ui/react"
import { useForm, Controller } from "react-hook-form"
import React from "react"
import { Form } from "react-router-dom"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { AxiosError } from "axios"
import { api } from "../api"
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { requestFailedToast, wrongCredentialsToast } from "./alerts"
import { AppointmentOptionsContext } from "../storage"

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
})

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setEmail, setUserId } = useContext(AppointmentOptionsContext)

  useEffect(() => {
    async function fetch() {
      await api
        .authenticate()
        .then((value) => {
          if (value.status === 200) navigate("/account")
        })
        .catch((error) => { })
    }
    fetch()
  }, [])
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema), // Use yup resolver for react-hook-form
  })
  const toast = useToast()
  const onSubmit = async (data) => {
    try {
      api
        .login(data.email, data.password)
        .then((value) => {
          setEmail(data.email)
          setUserId(data.userId)
          navigate("/account")
        })
        .catch((error) => {
          if (error instanceof AxiosError && error?.response?.status === 404) {
            toast(wrongCredentialsToast)
          }
        })
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.status === 404) {
        toast(requestFailedToast)
      }
    }
  }
  const [showPassword, setShowPassword] = useState(false)
  const handleShowClick = () => setShowPassword(!showPassword)

  return (
    <Flex flexDirection="column" width="100wh" height="100%" justifyContent="center" alignItems="center">
      <Stack flexDir="column" mb="6" justifyContent="center" alignItems="center">
        <Heading fontSize="4xl">Welcome to our mechanic services!</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} p="1rem" backgroundColor="dark.200" borderRadius="5px" boxShadow="md">
              <FormControl isInvalid={!!errors?.email?.message}>
                <InputGroup>
                  <FormLabel>Email</FormLabel>
                  <Controller name="email" control={control} render={({ field }) => <Input bg="white" {...field} placeholder="Email" />} />
                </InputGroup>
                <FormErrorMessage><Text variant="errorDark">{errors?.email?.message}</Text></FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <InputGroup>
                  <FormLabel>Password</FormLabel>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input type={showPassword ? "text" : "password"} placeholder="Password" bg="white"  {...field} />
                    )}
                  />
                  <InputRightElement>
                    <Button size="sm" onClick={handleShowClick}>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage><Text variant="errorDark">{errors?.password?.message}</Text></FormErrorMessage>
              </FormControl>
              <Button type="submit" variant="solid" width="full">
                Login
              </Button>
            </Stack>
          </Form>
        </Box>
      </Stack>
      <HStack>
        <Text>
          Forgot password? </Text><Link>Change password</Link>
      </HStack>
      <HStack>
        <Text>
          New to us?  </Text><Link href="https://www.ctc.co.il/">Sign Up</Link>
      </HStack>
    </Flex>
  )
}

export default Login
