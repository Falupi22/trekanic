import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import { AxiosError, AxiosResponse, HttpStatusCode } from "axios"
import React, { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Form, useNavigate } from "react-router-dom"
import * as yup from "yup"
import { api } from "../api"
import { useUserInfoStore } from "../storage"
import { ROUTE_ACCOUNT, ROUTE_ADMIN } from "../utils/routes"
import { requestFailedToast, wrongCredentialsToast } from "./alerts"

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
})

interface UserResponse {
  _id: string
  email: string
  isAdmin: boolean
}

const Home = () => {
  const navigate = useNavigate()
  const setEmail = useUserInfoStore((state) => state.setEmail)
  const setIsAdmin = useUserInfoStore((state) => state.setIsAdmin)
  const setIsAuth = useUserInfoStore((state) => state.setIsAuth)

  const isAdmin = useUserInfoStore((state) => state.isAdmin)

  useEffect(() => {
    async function fetch() {
      await api
        .authenticate()
        .then((value) => {
          if (value.status === HttpStatusCode.Ok) {
            if (isAdmin) {
              navigate(ROUTE_ADMIN)
            } else {
              navigate(ROUTE_ACCOUNT)
            }
          }
        })
        .catch((error) => {})
    }
    fetch()
  }, [isAdmin, navigate])
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
        .then((response: AxiosResponse<UserResponse>) => {
          setEmail(response.data.email)
          setIsAdmin(response.data.isAdmin)
          setIsAuth(true)
          if (response.data.isAdmin) {
            navigate(ROUTE_ADMIN)
          } else {
            navigate(ROUTE_ACCOUNT)
          }
        })
        .catch((error) => {
          if (error instanceof AxiosError && error?.response?.status === HttpStatusCode.NotFound) {
            toast(wrongCredentialsToast)
          }
        })
    } catch (error) {
      if (error instanceof AxiosError && error?.response?.status === HttpStatusCode.NotFound) {
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
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <Input bg="white" {...field} placeholder="Email" />}
                  />
                </InputGroup>
                <FormErrorMessage>
                  <Text variant="errorDark">{errors?.email?.message}</Text>
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <InputGroup>
                  <FormLabel>Password</FormLabel>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input type={showPassword ? "text" : "password"} placeholder="Password" bg="white" {...field} />
                    )}
                  />
                  <InputRightElement>
                    <Button size="sm" onClick={handleShowClick}>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  <Text variant="errorDark">{errors?.password?.message}</Text>
                </FormErrorMessage>
              </FormControl>
              <Button type="submit" variant="solid" width="full">
                Login
              </Button>
            </Stack>
          </Form>
        </Box>
      </Stack>
      <HStack>
        <Text>Forgot password? </Text>
        <Link>Change password</Link>
      </HStack>
      <HStack>
        <Text>New to us? </Text>
        <Link href="https://www.ctc.co.il/">Sign Up</Link>
      </HStack>
    </Flex>
  )
}

export default Home
