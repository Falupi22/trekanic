import { createContext } from "react"

export interface AppointmentOptionsContextProps {
  issues: any[]
  setIssues: (issues: any[]) => void
  takenDates: any[]
  setTakenDates: (takenDates: any[]) => void
}

const AppointmentOptionsContext = createContext<AppointmentOptionsContextProps>({
  issues: [],
  setIssues: (issues: any[]) => {},
  takenDates: [],
  setTakenDates: (takenDates: any[]) => {},
})

export default AppointmentOptionsContext
