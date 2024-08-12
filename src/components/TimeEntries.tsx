import { TimeEntriesProp } from "../types/types"
import { getLongFormattedDate } from "../utils/dateFunctions"
import { addTotalTime } from "../utils/hoursAndMinutes"

export function TimeEntries(props: TimeEntriesProp){
    return(
        <div className="parent-container" >
           {Object.entries(props.entriesByWeek).map(([range, total_tasks]) => {
             const result = range.split(' to ').map(date => getLongFormattedDate(date))
             const weekTasks = Object.values(total_tasks).flat(1)
             return (<div key={range} className="mt-3">
                <div className="week-total-container">
                    <p><b>{result.join(' - ')}</b></p>
                    <p className="week-total-text">Week total: <span className="week-total ms-2">{addTotalTime(weekTasks)}</span></p>
                </div>
                {Object.entries(total_tasks).map(([key, tasks]) => (
                    <div className="week-container mb-3" key={key}>
                        <div className="total-time-container">
                            <p>{new Date(key).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                            <p className="total-text">Total: <span className="total-time ms-2">{addTotalTime(tasks)}</span></p>
                        </div>
                        {tasks.length > 0 && <div className="display-container" key={key}>
                            <div className="display-container-style"> {tasks.map((task, index) => (
                                    <div className={(tasks.length > 0 && tasks.length-1 !== index) ? "task-sub-container border-style" : "task-sub-container"} key={index}>
                                       Time Entry component
                                    </div>
                                ))}
                            </div>
                        </div>}
                    </div>
                ))}
            </div>)
        })}
        </div>
    )
}