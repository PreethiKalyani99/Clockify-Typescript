import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFormattedDate } from "../utils/dateFunctions";
import circledPlusIcon from '../assets/icons/circledPlusIcon.png'
import { AddTimeEntryProp } from "../types/types";
import { getSelectedProjectAndClient } from "../utils/getSelectedProjectAndClient";

export function AddTimeEntry(props: AddTimeEntryProp) {
    return (
        <>
            <div className={props.isModalOpen ? "add-task-container" : "add-task-container zIndex"}>
                <div className="description-project-container">
                    <input
                        type="text"
                        placeholder="What are you working on?"
                        className="input-box"
                        onChange={props.onNameChange} 
                        value={props.taskDescription}
                        onKeyDown={props.onEnter}
                    ></input>
                    <button onClick={props.onToggle} className={!props.selectedProject.value ? "project-text-color project-text" : 'project-text'}>
                        {!props.selectedProject.value && 
                            <img 
                                src={circledPlusIcon} 
                                alt="Circled Plus Icon" 
                                style={{ width: '20px', height: '20px', marginRight: '5px'}}
                            />
                        }
                        {getSelectedProjectAndClient(props.selectedProject, props.selectedClient)}
                    </button>
                </div>
                <div className="add-sub-container">
                    <input
                        className="startTimeBox"
                        type="text"
                        name="startTime"
                        onBlur={(e) => props.onStartBlur(e)}
                        onChange={props.onStartChange}
                        value={props.start}
                    ></input>
                    <span className="mt-2 ms-2 me-2">-</span>
                    <input
                        className="endTimeBox"
                        type="text"
                        name="endTime"
                        onBlur={(e) => props.onEndBlur(e)}
                        onChange={props.onEndChange}
                        value={props.end}
                    ></input>
                    {props.days > 0 && <sup className="days"><b>{'+' + props.days}</b></sup>}
                    <DatePicker
                        className="dateIcon"
                        id="date-picker"
                        selected={props.timeStart}
                        onChange={(e) => props.onDateChange(e)}
                        showTimeSelect={false}
                        dateFormat="yyyy-MM-dd"
                        customInput={
                            <button>
                                <i className="bi bi-calendar"></i>
                            </button>
                        }
                    />
                    <p className="date-text mt-2">
                        {getFormattedDate(props.timeStart)}
                    </p>
                    <input
                        type='text'
                        className='durationBox'
                        onBlur={(e) => props.onDurationBlur(e)}
                        onChange={props.onDurationChange}
                        value={props.totalDuration}
                    />
                    <button onClick={props.onAddTask} className="addButton">
                        Add
                    </button>
                </div>
            </div>
        </>
    )
}