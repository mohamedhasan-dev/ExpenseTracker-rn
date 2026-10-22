import React, { useState } from "react";
import { Keyboard } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import SelectorRow from "./SelectorRow";

interface DatePickerRowProps {
  date: Date;
  onChange: (newDate: Date) => void;
}

// End of today: allows any time today but no future days. (Using "now" as the
// maximum makes Android reject today when the stored time is later than now.)
const endOfToday = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
};

const getFormattedDate = (selectedDate: Date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (selectedDate.toDateString() === today.toDateString()) return "Today";
  if (selectedDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return selectedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const DatePickerRow: React.FC<DatePickerRowProps> = ({ date, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // 1. Immediately hide the picker
    setShowPicker(false);

    // 2. Update the parent if a date was picked
    if (event.type === "set" && selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleOpenPicker = () => {
    Keyboard.dismiss(); // Prevents the layout from jumping if the keyboard is open
    setShowPicker(true);
  };

  return (
    <>
      <SelectorRow
        label="Date"
        value={getFormattedDate(date)}
        icon="calendar-month-outline"
        onPress={handleOpenPicker}
      />

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          maximumDate={endOfToday()}
          onChange={handleDateChange}
        />
      )}
    </>
  );
};

export default DatePickerRow;
