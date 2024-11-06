import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../redux/store"
import { getFormattedTime, calculateDays } from "../utils/dateFunctions"
import { SingleTimeEntryProp, SelectedOption } from "../types/types"
import { updateTimeEntry } from "../redux/clockifyThunk"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import threeDotsIcon from '../assets/icons/menu.png'
import { parseISODuration } from "../utils/checkString"
import circledPlusIcon from '../assets/icons/circledPlusIcon.png'
import { getSelectedProjectAndClient } from "../utils/getSelectedProjectAndClient"
import { Project } from "./Project"
import { updateTimer } from "../redux/clockifySlice"

export function SingleTimeEntry({ entry, projects, toggleTimer, onTaskBlur, onStartBlur, onEndBlur, onDurationBlur, onDateChange, onDuplicateTimeEntry, onDeleteTimeEntry }: SingleTimeEntryProp){
    const dispatch = useDispatch<AppDispatch>()

    const timeStart = new Date(entry.timeInterval.start)
    const timeEnd = new Date(entry.timeInterval.end)
    
    const [showProjects, setShowProjects] = useState(false) 
    const [showActionItems, setShowActionItems] = useState(false)

    const [taskDescription, setTaskDescription] = useState(entry.description)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [duration, setDuration] = useState(parseISODuration(entry.timeInterval.duration || '00:00:00'))

    const [selectedProject, setSelectedProject] = useState({value: entry?.projectId || '', label: entry?.project?.name  || 'Project'})
    const [selectedClient, setSelectedClient] = useState({value: entry?.project?.clientId  || '', label: entry?.project?.clientName  || ''})
 
    useEffect(() => {
        if(getFormattedTime(timeStart) !== startDateTime || getFormattedTime(timeEnd) !== endDateTime || parseISODuration(entry.timeInterval.duration) !== duration || taskDescription !== entry.description){
            setStartDateTime(getFormattedTime(timeStart))
            setEndDateTime(getFormattedTime(timeEnd))
            setDuration(parseISODuration(entry.timeInterval.duration))
            setTaskDescription(entry.description)
            if(selectedProject.value !== entry.projectId){
                setSelectedProject({value: entry.projectId || '', label: entry?.project?.name || selectedProject.label})
                setSelectedClient({value: entry?.project?.clientId || '', label: entry?.project?.clientName || selectedClient.label})
            }
        }
    }, [entry.timeInterval.start, entry.timeInterval.end, entry.timeInterval.duration, entry.description])
    
    useEffect(() => {
        const projectValue = projects?.find(project => project.id === selectedProject.value)
        if(projectValue){
            setSelectedProject({value: projectValue?.id, label: projectValue?.name})
            setSelectedClient({value: projectValue.clientId ?? '', label: projectValue.clientName})
        }
    }, [projects, selectedProject.value])
    
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

    const days = calculateDays(timeStart, timeEnd)

    return(
        <>
            <div className="task-container">
                <input
                    className="description-display"
                    type="text"
                    name="task-name"
                    placeholder="Add Description"
                    value={taskDescription || ''}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    onBlur={() => onTaskBlur(taskDescription, timeStart, timeEnd, entry.id, entry.projectId)}
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
                        onBlur={(e) => onStartBlur(e, entry.description, timeEnd, entry.id, entry.projectId)}
                    ></input>
                    <span className="ms-2 me-2">-</span>
                    <input
                        className="end-time-box"
                        type="text"
                        name="endTime"
                        value={endDateTime || '00:00'}
                        onChange={(e) => setEndDateTime(e.target.value)}
                        onBlur={(e) => onEndBlur(e, entry.description, timeStart, entry.id, entry.projectId)}
                    ></input>

                    {days > 0 && <sup className="task-days"><b>{'+' + days}</b></sup>}

                    <DatePicker
                        className="dateIcon"                    
                        selected={timeStart}
                        onChange={(e) => onDateChange(e, entry.description, timeStart, timeEnd, entry.id, entry.projectId)}
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
                        onBlur={(e) => onDurationBlur(e, entry.description, timeStart, entry.id, entry.projectId)}
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
                            onClick={() => {
                                onDuplicateTimeEntry(entry.id)
                                setShowActionItems(false)
                            }}
                            className="duplicate-btn"
                        >
                            Duplicate
                        </button>
                        </li>
                        <li>
                        <button 
                            onClick={() => {
                                onDeleteTimeEntry(entry.id)
                                setShowActionItems(false)
                            }}
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