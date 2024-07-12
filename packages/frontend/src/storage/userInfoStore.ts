import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const initialState = {
  email: "",
  isAdmin: false,
}

interface UserInfo {
  email: string
  isAdmin: boolean
  setEmail: (email: string) => void
  setIsAdmin: (isAdmin: boolean) => void
  reset: () => void
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
    }),
    {
      name: "user-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useUserInfoStore
