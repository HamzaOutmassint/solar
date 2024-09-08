import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./calendar.scss"

interface calendarProps {
    setMonth : React.Dispatch<React.SetStateAction<number>>
    setDay : React.Dispatch<React.SetStateAction<number>>
}

const Calendar = ({setDay,setMonth}:calendarProps) => {
    const [startDate, setStartDate] = useState<Date>(new Date());

    useEffect(()=>{
        setDay(startDate.getDate());
        setMonth(startDate.getMonth())
    },[setDay, setMonth, startDate])
    
    return (
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date !== null ? date : startDate)} />
    );
}

export default Calendar
