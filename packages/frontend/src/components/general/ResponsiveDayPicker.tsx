import { Box } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { AppointmentOptionsContext } from "../../storage";

interface ResponsiveDayPickerProps {
    disableDays: Date[],
    selectCallback: (date: Date) => void;
    preSelectedDate?: Date
}

const ResponsiveDayPicker = ({ disableDays, preSelectedDate, selectCallback }: ResponsiveDayPickerProps) => {
    const {
        takenDates,
        setTakenDates } = useContext(AppointmentOptionsContext)
    const [selected, setSelected] = useState<Date>();
    // [unSelecteableDays, setUnselectableDays] = useState(
    const date = new Date(Date.now())
    console.log(disableDays)
    useEffect((() => {
        if (preSelectedDate) {
            console.log(preSelectedDate)
            setSelected(preSelectedDate)
        }
    }), [])

    const handleSelected = (date: Date) => {
        setSelected(date);
        selectCallback(date);
    }

    // In case the user selected a 'full' day but one of the appointments are his.
    const disabledDays = [...disableDays];
    if (disableDays.find(date => date.getDay() === preSelectedDate.getDay())) {
        disableDays.splice(disableDays.indexOf(date), 1);
    }

    return (<Box width="35%" color="dark.50">
        <DayPicker mode="single" disabled={disabledDays} fromDate={date} defaultMonth={preSelectedDate} selected={selected} onSelect={handleSelected} />
    </Box>)
}

export default ResponsiveDayPicker;