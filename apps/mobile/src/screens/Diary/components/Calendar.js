import React from "react";
import { Calendar as RNCalendar } from "react-native-calendars";

export default function Calendar({ selected, markedDates, onSelectDate }) {
  return (
    <RNCalendar
      onDayPress={onSelectDate}
      markedDates={markedDates}
      markingType="custom"
      
      style={{
        borderRadius: 16,
        paddingBottom: 10,
      }}

      theme={{
        backgroundColor: "#FFFFFF",
        calendarBackground: "#FFFFFF",

        monthTextColor: "#1E3A8A",
        arrowColor: "#1E3A8A",

        textDayFontSize: 16,
        textDayHeaderFontSize: 13,

        // ★ 너가 요청한 header 구조 그대로 삽입
        "stylesheet.calendar.header": {
          header: {
            flexDirection: "row",
            justifyContent: "center", // 가운데 정렬
            alignItems: "center",
            paddingVertical: 6,
            marginBottom: 6,
            marginTop: 4,
          },
          monthText: {
            fontSize: 23,   // 날짜보다 살짝 작음
            fontWeight: "600",
            color: "#1E3A8A",
            marginHorizontal: 10, // 화살표와 간격
          },
          arrow: {
            paddingHorizontal: 10, // 터치 영역
            paddingVertical: 4,
          },

          // ★ 이미 네가 써놓은 week 확장도 함께 유지
          week: {
            marginTop: 14,
            marginBottom: 13,
            paddingHorizontal: 6,
            flexDirection: "row",
            justifyContent: "space-around",
          },
        },
      }}
    />
  );
}
