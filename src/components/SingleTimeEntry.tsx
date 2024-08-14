import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../redux/store"
import { getFormattedTime, calculateDays, calculateEndDate } from "../utils/dateFunctions"
import { SingleTimeEntryProp, FocusEvent, Constants } from "../types/types"
import { onStartTimeBlur, onEndTimeBlur, onDurationBlur } from "../utils/onBlurFunctions"
import { updateTimeEntry } from "../redux/clockifyThunk"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import threeDotsIcon from '../assets/icons/menu.png'
import { parseISODuration } from "../utils/checkString"

export function SingleTimeEntry({ entry }: SingleTimeEntryProp){
    const dispatch = useDispatch<AppDispatch>()

    const timeStart = new Date(entry.timeInterval.start)
    const timeEnd = new Date(entry.timeInterval.end)
    
    const [showActionItems, setShowActionItems] = useState(false)

    const [taskDescription, setTaskDescription] = useState(entry.description)
    const [startDateTime, setStartDateTime] = useState(getFormattedTime(timeStart))
    const [endDateTime, setEndDateTime] = useState(getFormattedTime(timeEnd))
    const [duration, setDuration] = useState(parseISODuration(entry.timeInterval.duration || '00:00:00'))
    const [days, setDays] = useState(calculateDays(timeStart, timeEnd))
 

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
        const { isValid, end: newEndTime, duration: newDuration } = onDurationBlur(e.target.value, timeStart, Constants.NO_OF_COLON_DURATION)

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
                <div className="task-time-container">
                    <input
                        className="startTimeBox"
                        type="text"
                        name="startTime"
                        value={startDateTime || '00:00'}
                        onChange={(e) => setStartDateTime(e.target.value)}
                        onBlur={handleStartTimeBlur}
                    ></input>
                    <span className="ms-2 me-2">-</span>
                    <input
                        className="endTimeBox"
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
                        className='durationBox'
                        value={duration || '00:00:00'}
                        onChange={(e) => setDuration(e.target.value)}
                        onBlur={handleDurationBlur}
                    />
                </div>
                <button className="three-dots" onClick={() => setShowActionItems(!showActionItems)}>
                    <img src={threeDotsIcon} alt="menu Icon" style={{ width: '25px', height: '25px'}}/>
                </button>
            </div>
        </>
    )
}