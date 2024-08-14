import { TimeEntriesProp, WeekEntriesProp, DayEntriesProp, TimeEntryListProp } from "../types/types"
import { getLongFormattedDate } from "../utils/dateFunctions"
import { addTotalTime } from "../utils/hoursAndMinutes"
import { SingleTimeEntry } from "./SingleTimeEntry"


function TimeEntryList(props : TimeEntryListProp){
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
        {props.entries.length > 0 && <TimeEntryList entries={props.entries} />}
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
                <DayEntries key={date} date={date} entries={entries} />
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
                />
            ))}
        </div>
    )
}