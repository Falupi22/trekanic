import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface AppointmentOptions {
  issues: any[]
  setIssues: (issues: any[]) => void
  takenDates: any[]
  setTakenDates: (takenDates: any[]) => void
}

const useAppointmentOptionsStore = create<AppointmentOptions, Array<any>>(
  persist(
    (set) => ({
      issues: [],
      takenDates: [],
      setIssues: (issues) => set(() => ({ issues: issues })),
      setTakenDates: (takenDates) => set(() => ({ takenDates: takenDates })),
    }),
    {
      name: "appointment-option-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useAppointmentOptionsStore
