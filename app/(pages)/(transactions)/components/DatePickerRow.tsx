import React, { useState } from "react";
import { Keyboard } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SelectorRow } from "./SelectorRow";

interface DatePickerRowProps {
  date: Date;
  onChange: (newDate: Date) => void;
}

export const DatePickerRow: React.FC<DatePickerRowProps> = ({
  date,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const getFormattedDate = (selectedDate: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (selectedDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (selectedDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return selectedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    // return selectedDate.toLocaleDateString("en-US", {
    //   month: "short",
    //   day: "numeric",
    //   year: "numeric",
    // });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // 1. Immediately hide the picker
    setShowPicker(false);

    // 2. Synchronously update the parent state if a date was picked
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
          onChange={handleDateChange}
          // I have entirely removed the maximumDate prop to prevent
          // Android from rejecting the date based on timezone differences.
        />
      )}
    </>
  );
};
