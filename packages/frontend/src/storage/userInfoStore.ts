import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const initialState = {
  email: "",
  isAdmin: false,
  isAuth: false,
}

interface UserInfo {
  email: string
  isAdmin: boolean
  setEmail: (email: string) => void
  setIsAdmin: (isAdmin: boolean) => void
  setIsAuth: (isAuth: boolean) => void
  reset: () => void
  isAuth: boolean
}

const useUserInfoStore = create<UserInfo, Array<any>>(
  persist(
    (set) => ({
      email: "",
      isAdmin: false,
      setEmail: (email) => set(() => ({ email: email })),
      setIsAdmin: (isAdmin) => set(() => ({ isAdmin: isAdmin })),
      reset: () => {
        set(initialState)
      },
      isAuth: false,
      setIsAuth: (isAuth) => set(() => ({ isAuth: isAuth })),
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useUserInfoStore
