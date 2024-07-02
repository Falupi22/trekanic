import { useEffect, useState } from "react"
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  Box,
  Link,
  FormControl,
  InputRightElement,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react"
import { useForm, Controller } from "react-hook-form"
import React from "react"
import { Form } from "react-router-dom"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { AxiosError } from "axios"
import { api } from "../api"
import { useNavigate } from "react-router-dom"
import { useToast } from "@chakra-ui/react"
import { LockIcon, UnlockIcon } from "@chakra-ui/icons"
import { requestFailedToast, wrongCredentialsToast } from "./alerts"

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
})

const Login = () => {
  const navigate = useNavigate()

  useEffect(() => {
    async function fetch() {
      await api
        .authenticate()
        .then((value) => {
          if (value.status === 200) navigate("/account")
        })
        .catch((error) => {})
    }
    fetch()
  }, [navigate])
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
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack flexDir="column" mb="6" justifyContent="center" alignItems="center">
        <Heading fontSize="4xl">Welcome to our mechanic services!</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
              <FormControl isInvalid={!!errors?.email?.message}>
                <InputGroup>
                  <FormLabel>Email</FormLabel>
                  <Controller name="email" control={control} render={({ field }) => <Input {...field} />} />
                </InputGroup>
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <InputGroup>
                  <FormLabel>Password</FormLabel>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input type={showPassword ? "text" : "password"} placeholder="Password" {...field} />
                    )}
                  />
                  <InputRightElement>
                    <Button size="sm" onClick={handleShowClick}>
                      {showPassword ? <UnlockIcon /> : <LockIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
              <Button type="submit" variant="solid" width="full">
                Login
              </Button>
            </Stack>
          </Form>
        </Box>
      </Stack>
      <Box>
        Forgot password? <Link>Change password</Link>
      </Box>
      <Box>
        New to us? <Link>Sign Up</Link>
      </Box>
    </Flex>
  )
}

export default Login
