import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddTask } from "./AddTask";
import { 
    updateStartTime, 
    updateEndTime, 
    updateTaskName, 
    updateDuration 
} from "../redux/clockifySlice";
import { 
    calculateEndDate, 
    getFormattedTime, 
    calculateDays, 
    formatTime 
} from "../utils/dateFunctions";
import { 
    calculateTimeDifference, 
    convertToHoursAndMinutes, 
    isDurationLimitExceeded, 
    convertDurationToHrsMinsSecs, 
    calculateEndTime,
} from "../utils/hoursAndMinutes";
import { RootState } from "../redux/store";
import { FocusEvent, KeyboardEvent } from "../types/types";
import { checkString } from "../utils/checkString";

export function TimeTracker(){
    const { isModalOpen, currentTask, selectedProject, selectedClient} = useSelector((state: RootState) => state.clockify)
    const {startTime, endTime, duration, taskName} = currentTask

    const timeStart = new Date(startTime)
    const timeEnd = new Date(endTime)
    
    const [showProjects, setShowProjects] = useState(false)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [totalDuration, setDuration] = useState(duration)

    const dispatch = useDispatch()

    const handleStartTimeBlur = (e: FocusEvent): void => {
        const {isValid, hours, minutes} = convertToHoursAndMinutes(e.target.value)
        const newStart = new Date(timeStart)
        newStart.setHours(hours, minutes)

        if (!isValid || isDurationLimitExceeded(newStart, timeEnd)) {
            setStartDateTime(getFormattedTime(timeStart))
            return
        }

        dispatch(updateStartTime(newStart.toString()))
        setStartDateTime(getFormattedTime(newStart))
        if(hours > timeEnd.getHours() || minutes > timeEnd.getMinutes()){
            timeEnd.setDate(timeEnd.getDate() + 1)
        }
        
        const { hrs, mins } = calculateTimeDifference(new Date(newStart), timeEnd)
        if(hrs <= 999){
            setDuration(formatTime(hrs, mins, 0))
        }
    }

    const handleEndTimeBlur = (e: FocusEvent): void => {
        const {isValid, hours, minutes} = convertToHoursAndMinutes(e.target.value)
        const newEnd = new Date(timeEnd)
        newEnd.setHours(hours, minutes)

        if(!isValid || isDurationLimitExceeded(timeStart, newEnd)) {
            setEndDateTime(getFormattedTime(timeEnd))
            return
        }

        dispatch(updateEndTime(newEnd.toString()))
        setEndDateTime(getFormattedTime(newEnd))
        if(timeStart.getHours() > hours || timeStart.getMinutes() > minutes){
            newEnd.setDate(newEnd.getDate() + 1)
        }
        const { hrs, mins } = calculateTimeDifference(new Date(newEnd), timeStart)
        if(hrs <= 999){
            setDuration(formatTime(hrs, mins, 0))
        }
    }

    const days = calculateDays(timeStart, timeEnd)

    const handleDateChange = (dateTime: Date | null): void => {
        if(dateTime){
            dispatch(updateStartTime(dateTime.toString()))
            const newEndTime = calculateEndDate(dateTime, timeEnd, timeStart)
            dispatch(updateEndTime(newEndTime.toString()))
        }
    }

    const handleTotalDurationBlur = (e: FocusEvent): void => {
        const { isValid, colon } = checkString(e.target.value)
        if( isValid && (colon < 3)){
            const timeDuration = convertDurationToHrsMinsSecs(e.target.value)
            const newEndTime = calculateEndTime(timeStart, timeDuration)
            dispatch(updateEndTime(newEndTime.toString()))
            setEndDateTime(getFormattedTime(newEndTime))
            dispatch(updateDuration(timeDuration))
            setDuration(timeDuration)
            
        }
        else{
            setDuration(duration)
        }
    }

    const toggleProject = () => {
        setShowProjects(!showProjects)
    }

    const addTask = () => {
        console.log("clicked!")
    }

    const handleEnter = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') {
            addTask()
        }
    }

    return (
        <AddTask
            onToggle={toggleProject}
            selectedProject={selectedProject}
            selectedClient={selectedClient}
            timeStart={new Date(startTime)}
            timeEnd={new Date(endTime)}
            isModalOpen={isModalOpen}
            taskDescription={taskName}
            start={startDateTime}
            end={endDateTime}
            totalDuration={totalDuration}
            days={days}
            onNameChange={(e) =>  dispatch(updateTaskName(e.target.value))}
            onStartChange={(e) =>  setStartDateTime(e.target.value)}
            onEndChange={(e) =>  setEndDateTime(e.target.value)}
            onDurationChange={(e) =>  setDuration(e.target.value)}
            onStartBlur={handleStartTimeBlur}
            onEndBlur={handleEndTimeBlur}
            onDurationBlur={handleTotalDurationBlur}
            onDateChange={handleDateChange}
            onAddTask={addTask}
            onEnter={handleEnter}
        />
    )
}