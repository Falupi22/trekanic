import { Box } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { DayOfWeek, DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

interface ResponsiveDayPickerProps {
  disableDays: Date[]
  selectCallback: (date: Date) => void
  preSelectedDate?: Date
}

const ResponsiveDayPicker = ({ disableDays, preSelectedDate, selectCallback }: ResponsiveDayPickerProps) => {
  const [selected, setSelected] = useState<Date>()
  // [unSelecteableDays, setUnselectableDays] = useState(
  const date = new Date(Date.now())
  console.log(disableDays)
  useEffect(() => {
    if (preSelectedDate) {
      console.log(preSelectedDate)
      setSelected(preSelectedDate)
    }
  }, [preSelectedDate])

  const handleSelected = (date: Date) => {
    setSelected(date)
    selectCallback(date)
  }

  const dayOfWeekMatcher: DayOfWeek = {
    dayOfWeek: [5, 6],
  }

  const disabledDays = [...disableDays, dayOfWeekMatcher]
  // In case the user selected a 'full' day but one of the appointments are his.
  if (disableDays.find((date) => date.getDate() === preSelectedDate.getDate())) {
    disableDays.splice(disableDays.indexOf(date), 1)
  }

  return (
    <Box width="35%" color="dark.50">
      <DayPicker
        mode="single"
        disabled={disabledDays}
        fromDate={date}
        defaultMonth={preSelectedDate}
        selected={selected}
        onSelect={handleSelected}
      />
    </Box>
  )
}

export default ResponsiveDayPicker
