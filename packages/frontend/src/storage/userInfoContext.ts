import { createContext } from "react"

export interface UserInfoContextProps {
  userId: string
  setUserId: (userId: string) => void
  email: string
  setEmail: (email: string) => void
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
}

const UserInfoContext = createContext<UserInfoContextProps>({
  userId: "",
  setUserId: (userId: string) => {},
  email: "",
  setEmail: (email: string) => {},
  isAdmin: false,
  setIsAdmin: (isAdmin: boolean) => {},
})

export default UserInfoContext
