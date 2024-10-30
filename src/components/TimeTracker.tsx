import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddTimeEntry } from "./AddTimeEntry";
import { 
    updateStartTime, 
    updateEndTime,  
    updateTaskName,
    updateDuration,
    resetState,
    updateProjectValue,
    updateClientValue
} from "../redux/clockifySlice";
import { 
    calculateEndDate, 
    getFormattedTime, 
    calculateDays, 
} from "../utils/dateFunctions";
import { groupEntriesByWeek } from "../utils/groupValues";
import { RootState, AppDispatch } from "../redux/store";
import { FocusEvent, KeyboardEvent, TimeConstants, SelectedOption } from "../types/types";
import { createTimeEntry, getUserTimeEntries, getProjects, getClients } from "../redux/clockifyThunk";
import { TimeEntries } from "./TimeEntries";
import { onStartTimeBlur, onEndTimeBlur, onDurationBlur } from "../utils/onBlurFunctions";
import { calculateEndTime, convertMilliSecsToHrsMinsSec } from "../utils/hoursAndMinutes";
import { Timer } from "./Timer";

export function TimeTracker(){
    const { isModalOpen, currentTask, selectedProject, selectedClient, data, projects, clients} = useSelector((state: RootState) => state.clockify)
    const {startTime, endTime, duration, taskName} = currentTask

    const intervalIdRef = useRef<NodeJS.Timeout | null>(null)
    const timerStart = Date.now()

    const timeStart = new Date(startTime)
    const timeEnd = new Date(endTime)
    
    const [showProjects, setShowProjects] = useState(false)
    const [showActionItems, setShowActionItems] = useState(false)

    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [totalDuration, setDuration] = useState(duration)
    const [isTimerOn, setIsTimerOn] = useState(false)
    const [elapsedTime, setElapsedTime] = useState(0)

    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(getUserTimeEntries())
        dispatch(getProjects())
        dispatch(getClients())
    }, [dispatch])

    useEffect(() => {
        if(isTimerOn){
            intervalIdRef.current = setInterval(() => {
                const currentTimeInMs = Date.now() - timerStart
                setElapsedTime(currentTimeInMs)
            }, 1000)
        }
        else{
            clearInterval(intervalIdRef.current as NodeJS.Timeout)
            intervalIdRef.current = null
        }
        return () => clearInterval(intervalIdRef.current as NodeJS.Timeout)

    }, [isTimerOn])

    useEffect(() => {
        const projectValue = projects?.find(project => project.id === selectedProject.value)
        if(projectValue){
            dispatch(updateProjectValue({value: projectValue?.id, label: projectValue?.name})) 
            dispatch(updateClientValue({value: projectValue.clientId ?? '', label: projectValue.clientName}))
        }
    }, [projects, dispatch, selectedProject.value])
    
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
        const { isValid, end: newEndTime, duration: newDuration } = onDurationBlur(e.target.value, timeStart, TimeConstants.COLON_COUNT_IN_DURATION_STRING)

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

    const handleProjectSelect = (value: SelectedOption) => {
        dispatch(updateProjectValue(value))
        setShowProjects(false)
    }

    const entriesByWeek = groupEntriesByWeek(data)

    const toggleTimer = () => { 
        setIsTimerOn(true)
    }

    const handleTimerStop = () => {
        const start = new Date()
        const newEndTime = calculateEndTime(start, convertMilliSecsToHrsMinsSec(elapsedTime))
        dispatch(createTimeEntry({
            description: taskName,
            start: new Date(start).toISOString().split('.')[0] + 'Z',
            end:  new Date(newEndTime).toISOString().split('.')[0] + 'Z',
            projectId: selectedProject.value
        }))
        setIsTimerOn(false)
        dispatch(resetState())
    }

    const toggleActionItem = () => {
        setShowActionItems(!showActionItems)
    }

    
    const handleDiscardTimer = () => {
        setIsTimerOn(false)
        setShowActionItems(false)
        dispatch(resetState())
    }

    const totalTime = convertMilliSecsToHrsMinsSec(elapsedTime)
    return (
        <>
            {isTimerOn ? 
                <Timer
                    totalTime={totalTime}
                    isModalOpen={isModalOpen}
                    onNameChange={(e) =>  dispatch(updateTaskName(e.target.value))}
                    taskName={taskName}
                    onToggleProject={toggleProject}
                    selectedProject={selectedProject}
                    selectedClient={selectedClient}
                    isTimerOn={isTimerOn}
                    onTimerStop={handleTimerStop}
                    ontoggleActionItem={toggleActionItem}
                    showActionItems={showActionItems}
                    onDiscard={handleDiscardTimer}
                    showProjects={showProjects}
                    setShowProjects={setShowProjects}
                    onProjectSelect={handleProjectSelect}
                /> :
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
                    setShowProjects={setShowProjects}
                    showProjects={showProjects}
                    onProjectSelect={handleProjectSelect}
                    projects={projects}
                    clients={clients}
                />
            }
            <TimeEntries
                entriesByWeek={entriesByWeek}
                projects={projects}
                toggleTimer={toggleTimer}
            />
        </>
    )
}