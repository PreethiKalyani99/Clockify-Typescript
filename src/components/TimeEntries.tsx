import { useDispatch } from "react-redux"
import { AppDispatch } from "../redux/store"
import { TimeEntriesProp, WeekEntriesProp, DayEntriesProp, TimeEntryListProp, TimeConstants, FocusEvent } from "../types/types"
import { getLongFormattedDate,calculateEndDate } from "../utils/dateFunctions"
import { addTotalTime } from "../utils/hoursAndMinutes"
import { SingleTimeEntry } from "./SingleTimeEntry"
import { updateTimeEntry, duplicateTimeEntry, deleteTimeEntry } from "../redux/clockifyThunk"
import { onStartTimeBlur, onEndTimeBlur, onDurationBlur } from "../utils/onBlurFunctions"


function TimeEntryList(props : TimeEntryListProp){
    const dispatch = useDispatch<AppDispatch>()

    const handleTaskBlur = (description: string, timeStart: Date, timeEnd: Date, id: string, projectId: string | null): void => {
        dispatch(updateTimeEntry({
            description: description, 
            start: timeStart.toISOString().split('.')[0] + 'Z', 
            end: timeEnd.toISOString().split('.')[0] + 'Z', 
            id: id, 
            projectId: projectId
        }))
    }

    const handleStartTimeBlur = (e: FocusEvent, description: string, timeEnd: Date, id: string, projectId: string | null): void => {
        const { isValid, start: newStart, end: newEnd } = onStartTimeBlur(e.target.value, timeEnd)
        if(!isValid){
            return
        }

        dispatch(updateTimeEntry({
            description: description, 
            start: newStart.toISOString().split('.')[0] + 'Z', 
            end: newEnd.toISOString().split('.')[0] + 'Z', 
            id: id,  
            projectId: projectId
        }))
    }
    
    const handleEndTimeBlur = (e: FocusEvent, description: string, timeStart: Date, id: string, projectId: string | null): void => {
        if(!e){
            return
        }
        const { isValid, end: newEnd } = onEndTimeBlur(timeStart, e.target.value)
        if(!isValid){
            return
        }

        dispatch(updateTimeEntry({
            description: description, 
            start: timeStart.toISOString().split('.')[0] + 'Z', 
            end: newEnd.toISOString().split('.')[0] + 'Z', 
            id: id, 
            projectId: projectId
        })) 
    }

    const handleDateChange = (dateTime: Date | null, description: string, timeStart: Date, timeEnd: Date, id: string, projectId: string | null): void => {
        if(dateTime){
            const newEndTime = calculateEndDate(dateTime, timeEnd, timeStart)

            dispatch(updateTimeEntry({
                description: description, 
                start: dateTime.toISOString().split('.')[0] + 'Z', 
                end: newEndTime.toISOString().split('.')[0] + 'Z', 
                id: id, 
                projectId: projectId
            }))
        }
    }

    const handleDurationBlur = (e: FocusEvent, description: string, timeStart: Date, id: string, projectId: string | null): void => {
        if(!e) return
        const { isValid, end: newEndTime } = onDurationBlur(e.target.value, timeStart, TimeConstants.COLON_COUNT_IN_DURATION_STRING)

        if(!isValid){
            return
        }

        dispatch(updateTimeEntry({
            description: description, 
            start: timeStart.toISOString().split('.')[0] + 'Z', 
            end: newEndTime.toISOString().split('.')[0] + 'Z', 
            id: id, 
            projectId: projectId
        }))

    }

    function handleDuplicateTimeEntry(id: string){
        dispatch(duplicateTimeEntry({id}))
    }

    function handleDeleteTimeEntry(id: string){
        dispatch(deleteTimeEntry({id}))
    }

    return (
        <div className="display-container">
            <div className="display-container-style">
                {props.entries.map((entry, index) => (
                    <div
                        className={`task-sub-container ${props.entries.length - 1 !== index ? 'border-style' : ''}`}
                        key={index}
                    >
                        <SingleTimeEntry
                            key={index}
                            entry={entry}
                            projects={props.projects}
                            toggleTimer={props.toggleTimer}
                            onTaskBlur={handleTaskBlur}
                            onStartBlur={handleStartTimeBlur}
                            onEndBlur={handleEndTimeBlur}
                            onDurationBlur={handleDurationBlur}
                            onDateChange={handleDateChange}
                            onDuplicateTimeEntry={handleDuplicateTimeEntry}
                            onDeleteTimeEntry={handleDeleteTimeEntry}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

function DayEntries(props: DayEntriesProp){
    return (
        <div className="week-container mb-3">
        <div className="total-time-container">
            <p>{getLongFormattedDate(props.date)}</p>
            <p className="total-text">
                Total: <span className="total-time ms-2">{addTotalTime(props.entries)}</span>
            </p>
        </div>
        {props.entries.length > 0 && 
            <TimeEntryList 
                entries={props.entries} 
                projects={props.projects} 
                toggleTimer={props.toggleTimer}
            />
        }
    </div>
    )
}

function WeekEntries(props: WeekEntriesProp){
    const dateRange = props.range.split(' to ').map(getLongFormattedDate)  // first day of the week - last day of the week
    const weekEntries = Object.values(props.timeEntries).flat()  // To calculate week total

    return (
        <div className="mt-3">
            <div className="week-total-container">
            <p><b>{dateRange.join(' - ')}</b></p>
            <p className="week-total-text">Week total: <span className="week-total ms-2">{addTotalTime(weekEntries)}</span></p>
            </div>

            <div>
            {Object.entries(props.timeEntries).map(([date, entries]) => (
                <DayEntries 
                    key={date} 
                    date={date} 
                    entries={entries} 
                    projects={props.projects} 
                    toggleTimer={props.toggleTimer}
                />
            ))}
            </div>
        </div>
    )
    
}
export function TimeEntries(props: TimeEntriesProp){
    return (
        <div className="parent-container">
            {Object.entries(props.entriesByWeek).map(([range, timeEntries]) => (
                <WeekEntries
                    key={range}
                    range={range}
                    timeEntries={timeEntries}
                    projects={props.projects}
                    toggleTimer={props.toggleTimer}
                />
            ))}
        </div>
    )
}