import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddTimeEntry } from "./AddTimeEntry";
import { 
    updateStartTime, 
    updateEndTime, 
    updateTaskName, 
    updateDuration,
    resetState
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
import { groupEntriesByWeek } from "../utils/groupEntriesByWeek";
import { RootState, AppDispatch } from "../redux/store";
import { FocusEvent, KeyboardEvent, Type } from "../types/types";
import { checkString } from "../utils/checkString";
import { createTimeEntry } from "../redux/clockifyThunk";
import { TimeEntries } from "./TimeEntries";

export function TimeTracker(){
    const { isModalOpen, currentTask, selectedProject, selectedClient, data} = useSelector((state: RootState) => state.clockify)
    const {startTime, endTime, duration, taskName} = currentTask

    const timeStart = new Date(startTime)
    const timeEnd = new Date(endTime)
    
    const [showProjects, setShowProjects] = useState(false)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [totalDuration, setDuration] = useState(duration)

    const dispatch = useDispatch<AppDispatch>()

    const handleStartTimeBlur = (type: Type, e: FocusEvent): void => {
        const {isValid, hours, minutes} = convertToHoursAndMinutes(e.target.value)
        const newStart = new Date(timeStart)
        newStart.setHours(hours, minutes)
        if (!isValid || isDurationLimitExceeded(newStart, timeEnd)) {
            type === 'add' && setStartDateTime(getFormattedTime(timeStart))
            return
        }
        if(type === 'add'){
            dispatch(updateStartTime(newStart.toString()))
            setStartDateTime(getFormattedTime(newStart))
        }
        if(hours > timeEnd.getHours() || minutes > timeEnd.getMinutes()){
            type === 'add' && timeEnd.setDate(timeEnd.getDate() + 1)
        }
        
        const { hrs, mins } = calculateTimeDifference(new Date(newStart), timeEnd)
        
        type === 'add' && dispatch(updateEndTime(timeEnd.toString()))

        if(hrs <= 999){
            type === 'add' && setDuration(formatTime(hrs, mins, 0))
        }
    }

    const handleEndTimeBlur = (type: Type, e: FocusEvent): void => {
        const {isValid, hours, minutes} = convertToHoursAndMinutes(e.target.value)
        const newEnd = new Date(timeEnd)
        newEnd.setHours(hours, minutes)
        if(!isValid || isDurationLimitExceeded(timeStart, newEnd)) {
            type === 'add' && setEndDateTime(getFormattedTime(timeEnd))
            return
        }

        if(timeStart.getHours() > hours || timeStart.getMinutes() > minutes){
            newEnd.setDate(newEnd.getDate() + 1)
        }
        const { hrs, mins } = calculateTimeDifference(new Date(newEnd), timeStart)

        if(type === 'add'){
            setEndDateTime(getFormattedTime(newEnd))
            dispatch(updateEndTime(newEnd.toString()))
        }

        if(hrs <= 999){
            type === 'add' && setDuration(formatTime(hrs, mins, 0))
        }
    }

    const days = calculateDays(timeStart, timeEnd)

    const handleDateChange = (type: Type, dateTime: Date | null): void => {
        if(dateTime){
            type === 'add' && dispatch(updateStartTime(dateTime.toString()))
            const newEndTime = calculateEndDate(dateTime, timeEnd, timeStart)
            type === 'add' && dispatch(updateEndTime(newEndTime.toString()))
        }
    }

    const handleTotalDurationBlur = (type: Type, e: FocusEvent): void => {
        const { isValid, colon } = checkString(e.target.value)
        if( isValid && (colon < 3)){
            const timeDuration = convertDurationToHrsMinsSecs(e.target.value)
            const newEndTime = calculateEndTime(timeStart, timeDuration)
            
            if(type === 'add'){
                dispatch(updateEndTime(newEndTime.toString()))
                setEndDateTime(getFormattedTime(newEndTime))
                dispatch(updateDuration(timeDuration))
                setDuration(timeDuration)
            }
            
        }
        else{
            type === 'add' && setDuration(duration)
        }
    }

    const toggleProject = () => {
        setShowProjects(!showProjects)
    }

    const addTask = () => {
        if(taskName !== ''){
            dispatch(createTimeEntry({
                description: taskName,
                start: new Date(timeStart).toISOString().split('.')[0] + 'Z',
                end:  new Date(timeEnd).toISOString().split('.')[0] + 'Z',
                projectId: selectedProject.value ? selectedProject.value : null
            }))
            dispatch(resetState())
        }
        else{
            alert('Please enter task description')
        }
    }

    const handleEnter = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') {
            addTask()
        }
    }

    const entriesByWeek = groupEntriesByWeek(data)

    return (
        <>
            <AddTimeEntry
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
            <TimeEntries
                entriesByWeek={entriesByWeek}
            />
        </>
    )
}