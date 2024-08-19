import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../redux/store"
import { getFormattedTime, calculateDays, calculateEndDate } from "../utils/dateFunctions"
import { SingleTimeEntryProp, FocusEvent, TimeConstants, SelectedOption } from "../types/types"
import { onStartTimeBlur, onEndTimeBlur, onDurationBlur } from "../utils/onBlurFunctions"
import { updateTimeEntry, duplicateTimeEntry, deleteTimeEntry } from "../redux/clockifyThunk"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import threeDotsIcon from '../assets/icons/menu.png'
import { parseISODuration } from "../utils/checkString"
import circledPlusIcon from '../assets/icons/circledPlusIcon.png'
import { getSelectedProjectAndClient } from "../utils/getSelectedProjectAndClient"
import { Project } from "./Project"
import { updateTimer } from "../redux/clockifySlice"

export function SingleTimeEntry({ entry, projects, toggleTimer }: SingleTimeEntryProp){
    const dispatch = useDispatch<AppDispatch>()

    const timeStart = new Date(entry.timeInterval.start)
    const timeEnd = new Date(entry.timeInterval.end)
    
    const [showActionItems, setShowActionItems] = useState(false)
    const [showProjects, setShowProjects] = useState(false) 

    const [taskDescription, setTaskDescription] = useState(entry.description)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [duration, setDuration] = useState(parseISODuration(entry.timeInterval.duration || '00:00:00'))
    const [days, setDays] = useState(calculateDays(timeStart, timeEnd))

    const [selectedProject, setSelectedProject] = useState({value: entry?.projectId || '', label: entry?.project?.name  || 'Project'})
    const [selectedClient, setSelectedClient] = useState({value: entry?.project?.clientId  || '', label: entry?.project?.clientName  || ''})
 

    useEffect(() => {
        const projectValue = projects?.find(project => project.id === selectedProject.value)
        if(projectValue){
            setSelectedProject({value: projectValue?.id, label: projectValue?.name})
            setSelectedClient({value: projectValue.clientId ?? '', label: projectValue.clientName})
        }
    }, [projects, selectedProject.value])

    const handleStartTimeBlur = (e: FocusEvent): void => {
        const { isValid, start: newStart, end: newEnd, duration: newDuration } = onStartTimeBlur(e.target.value, timeEnd)
        if(!isValid){
            setStartDateTime(getFormattedTime(timeStart))
            return
        }
        setStartDateTime(getFormattedTime(newStart))
        setDuration(newDuration)
        setDays(calculateDays(newStart, newEnd))

        dispatch(updateTimeEntry({
            description: entry.description, 
            start: newStart.toISOString().split('.')[0] + 'Z', 
            end: newEnd.toISOString().split('.')[0] + 'Z', 
            id: entry.id,  
            projectId: entry.projectId
        }))
    }
    
    const handleEndTimeBlur = (e: FocusEvent): void => {
        const { isValid, end: newEnd, duration: newDuration } = onEndTimeBlur(timeStart, e.target.value)
        if(!isValid){
            setEndDateTime(getFormattedTime(timeEnd))
            return
        }
        setEndDateTime(getFormattedTime(newEnd))
        setDuration(newDuration)
        setDays(calculateDays(timeStart, newEnd))

        dispatch(updateTimeEntry({
            description: entry.description, 
            start: timeStart.toISOString().split('.')[0] + 'Z', 
            end: newEnd.toISOString().split('.')[0] + 'Z', 
            id: entry.id, 
            projectId: entry.projectId
        })) 
    }

    const handleDateChange = (dateTime: Date | null): void => {
        if(dateTime){
            const newEndTime = calculateEndDate(dateTime, timeEnd, timeStart)

            setDays(calculateDays(dateTime, newEndTime))
            dispatch(updateTimeEntry({
                description: entry.description, 
                start: dateTime.toISOString().split('.')[0] + 'Z', 
                end: newEndTime.toISOString().split('.')[0] + 'Z', 
                id: entry.id, 
                projectId: entry.projectId
            }))
        }
    }

    const handleDurationBlur = (e: FocusEvent): void => {
        const { isValid, end: newEndTime, duration: newDuration } = onDurationBlur(e.target.value, timeStart, TimeConstants.COLON_COUNT_IN_DURATION_STRING)

        if(!isValid){
            setDuration(entry.timeInterval.duration)
            return
        }
        setDuration(newDuration)
        setEndDateTime(getFormattedTime(newEndTime))
        setDays(calculateDays(timeStart, newEndTime))

        dispatch(updateTimeEntry({
            description: entry.description, 
            start: timeStart.toISOString().split('.')[0] + 'Z', 
            end: newEndTime.toISOString().split('.')[0] + 'Z', 
            id: entry.id, 
            projectId: entry.projectId
        }))

    }

    const handleSelect = (value: SelectedOption) => {
        setSelectedProject(value)
        setShowProjects(false)
        dispatch(updateTimeEntry({
            id: entry.id, 
            start: entry.timeInterval.start, 
            end: entry.timeInterval.end, 
            description: entry.description,
            projectId: value.value
        }))
    }

    function handleDuplicateTimeEntry(id: string){
        dispatch(duplicateTimeEntry({id}))
        setShowActionItems(false)
    }

    function handleDeleteTimeEntry(id: string){
        dispatch(deleteTimeEntry({id}))
        setShowActionItems(false)
    }

    return(
        <>
            <div className="task-container">
                <input
                    className="description-display"
                    type="text"
                    name="task-name"
                    value={taskDescription || ''}
                    onChange={(e) => setTaskDescription(e.target.value)}
                ></input>
                <button 
                    onClick={() => setShowProjects(!showProjects)}
                    className={selectedProject.label === 'Project' ? "project-text-color task-project-text" : "task-project-text"}
                >  
                    { selectedProject.label === 'Project' && 
                        <img 
                            src={circledPlusIcon} 
                            alt="Circled Plus Icon" 
                            style={{ width: '20px', height: '20px', marginRight: '5px'}}
                        />
                    }
                    {getSelectedProjectAndClient(selectedProject, selectedClient)}
                </button> 
                <div className="task-time-container">
                    <input
                        className="start-time-box"
                        type="text"
                        name="startTime"
                        value={startDateTime || '00:00'}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        onBlur={handleStartTimeBlur}
                    ></input>
                    <span className="ms-2 me-2">-</span>
                    <input
                        className="end-time-box"
                        type="text"
                        name="endTime"
                        value={endDateTime || '00:00'}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        onBlur={handleEndTimeBlur}
                    ></input>

                    {days > 0 && <sup className="task-days"><b>{'+' + days}</b></sup>}

                    <DatePicker
                        className="dateIcon"                    
                        selected={timeStart}
                        onChange={handleDateChange}
                        showTimeSelect={false}
                        dateFormat="yyyy-MM-dd"
                        customInput={
                            <button>
                                <i className="bi bi-calendar"></i>
                            </button>
                        }
                    />
                    <input
                        type='text'
                        className='duration-box'
                        value={duration || '00:00:00'}
                        onChange={(e) => setDuration(e.target.value)}
                        onBlur={handleDurationBlur}
                    />
                    <button 
                        onClick={() => {
                            toggleTimer()
                            dispatch(updateTimer({
                                name: entry.description, 
                                project: selectedProject.label, 
                                projectId: entry.projectId ?? null, 
                                client: selectedClient.label, 
                                clientId: selectedClient.value 
                            }))
                        }}
                        className="play-button"
                    >
                        <i className ="bi bi-play"></i>
                    </button>
                </div>
                <button className="three-dots" onClick={() => setShowActionItems(!showActionItems)}>
                    <img src={threeDotsIcon} alt="menu Icon" style={{ width: '25px', height: '25px'}}/>
                </button>
                <div className={showActionItems ? "action-items-container": "hide"}>
                    <ul className="action-items">
                        <li>
                        <button 
                            onClick={() => handleDuplicateTimeEntry(entry.id)}
                            className="duplicate-btn"
                        >
                            Duplicate
                        </button>
                        </li>
                        <li>
                        <button 
                            onClick={() => handleDeleteTimeEntry(entry.id)}
                            className="delete-btn"
                        >
                            Delete
                        </button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className= {showProjects ? "" : ''}>
                {showProjects && 
                    <Project 
                        onSelect={handleSelect}
                        setShowProjects={setShowProjects}
                        selectedProject={selectedProject}
                        setSelectedProject={setSelectedProject}
                        selectedClient={selectedClient}
                        setSelectedClient={setSelectedClient}
                        timeEntry={entry}
                    />
                }    
            </div>
        </>
    )
}