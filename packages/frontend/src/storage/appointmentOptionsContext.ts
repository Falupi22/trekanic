import { createContext } from 'react';

export interface AppointmentOptionsContextProps {
    issues: any[],
    setIssues: (issues: any[]) => void,
    takenDates: any[],
    setTakenDates: (takenDates: any[]) => void,
    userId: string,
    setUserId: (userId: string) => void
    email: string,
    setEmail: (email: string) => void
}

const AppointmentOptionsContext = createContext<AppointmentOptionsContextProps>({
    issues: [],
    setIssues: (issues: any[]) => { },
    takenDates: [],
    setTakenDates: (takenDates: any[]) => { },
    userId: '',
    setUserId: (userId: string) => { },
    email: '',
    setEmail: (email: string) => { }
});

export default AppointmentOptionsContext;