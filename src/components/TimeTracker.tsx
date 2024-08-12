import { useState, useEffect } from "react";
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
} from "../utils/dateFunctions";
import { groupEntriesByWeek } from "../utils/groupEntriesByWeek";
import { RootState, AppDispatch } from "../redux/store";
import { FocusEvent, KeyboardEvent, Constants } from "../types/types";
import { createTimeEntry, getUserTimeEntries } from "../redux/clockifyThunk";
import { TimeEntries } from "./TimeEntries";
import { onStartTimeBlur, onEndTimeBlur, onDurationBlur } from "../utils/onBlurFunctions";

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

    useEffect(() => {
        dispatch(getUserTimeEntries())
    }, [])
    
    const handleStartTimeBlur = (e: FocusEvent): void => {
        const { isValid, start: newStart, end, duration: newDuration } = onStartTimeBlur(e.target.value, timeEnd)
        if(!isValid){
            setStartDateTime(getFormattedTime(timeStart))
            return
        }
        dispatch(updateStartTime(newStart.toString()))
        setStartDateTime(getFormattedTime(newStart))
        dispatch(updateEndTime(end.toString()))
        setDuration(newDuration)
    }

    const handleEndTimeBlur = (e: FocusEvent): void => {
        const { isValid, end: newEnd, duration: newDuration } = onEndTimeBlur(timeStart, e.target.value)
        if(!isValid){
            setEndDateTime(getFormattedTime(timeEnd))
            return
        }
        setEndDateTime(getFormattedTime(newEnd))
        dispatch(updateEndTime(newEnd.toString()))
        setDuration(newDuration)
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
        const { isValid, end: newEndTime, duration: newDuration } = onDurationBlur(e.target.value, timeStart, Constants.NO_OF_COLON_DURATION)

        if(!isValid){
            setDuration(duration)
            return
        }
        dispatch(updateEndTime(newEndTime.toString()))
        setEndDateTime(getFormattedTime(newEndTime))
        dispatch(updateDuration(newDuration))
        setDuration(newDuration)
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