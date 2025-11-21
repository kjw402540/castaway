import React from "react";
import { View, Text } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";

export default function Calendar({ selected, markedDates, onSelectDate, maxDate }) {
  return (
    <RNCalendar
      current={selected}          // ★★★ 핵심
      initialDate={selected}      // ★★★ 핵심
      markedDates={markedDates}
      markingType="custom"
      onDayPress={onSelectDate}
      maxDate={maxDate}

      style={{
        borderRadius: 16,
        paddingBottom: 10,
      }}

      theme={{
        backgroundColor: "transparent",
        calendarBackground: "transparent",
        dayTextColor: "#1F2937",
        textDisabledColor: "#D1D5DB",
        monthTextColor: "#1E3A8A",
        textMonthFontWeight: "600",
        textMonthFontSize: 18,
        textDayFontSize: 16,
        textDayHeaderFontSize: 13,
        textDayFontWeight: "500",
        textDayHeaderFontWeight: "600",
        arrowColor: "#1E3A8A",
      }}

      renderHeader={(date) => {
        const month = date.toString("MMMM");
        const year = date.toString("yyyy");
        return (
          <View style={{ paddingVertical: 10 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1E3A8A",
                textAlign: "center",
              }}
            >
              {month} {year}
            </Text>
          </View>
        );
      }}
    />
  );
}
