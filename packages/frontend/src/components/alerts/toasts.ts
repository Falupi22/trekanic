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
  title: "Request failed.",
  status: "error",
  duration: 5000,
  isClosable: true,
}

const requestSucceeded: Toast = {
  title: "Request succeeded!",
  status: "success",
  duration: 5000,
  isClosable: true,
}

const NoChangedHaveBeenMade: Toast = {
  title: "No changed have been made.",
  status: "info",
  duration: 5000,
  isClosable: true,
}

export { wrongCredentialsToast, requestFailedToast, requestSucceeded, NoChangedHaveBeenMade }
