import { AlertStatus } from "@chakra-ui/react"

interface Toast {
  title: string
  status: AlertStatus
  duration: number
  isClosable: boolean
}

const wrongCredentialsToast: Toast = {
  title: "Wrong credentials",
  status: "error",
  duration: 5000,
  isClosable: true,
}

const requestFailedToast: Toast = {
  title: "Request failed. Check your internet connection",
  status: "error",
  duration: 5000,
  isClosable: true,
}

export { wrongCredentialsToast, requestFailedToast }
