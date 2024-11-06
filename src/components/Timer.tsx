import { Project } from "./Project"
import circledPlusIcon from '../assets/icons/circledPlusIcon.png'
import threeDotsIcon from '../assets/icons/menu.png'
import { TimerProps } from "../types/types"
import { getSelectedProjectAndClient } from "../utils/getSelectedProjectAndClient"

export function Timer(props: TimerProps){
   
    return (
        <>
            <div className={props.isModalOpen ? "timer-task-container" : "timer-task-container z-Index"} data-testid="container">
                <input
                    data-testid="task-name"
                    className="timer-input-box"
                    type="text"
                    placeholder="What are you working on?"
                    onChange={props.onNameChange}
                    value={props.taskName}
                ></input>
                <div className="timer-sub-container">
                    <button onClick={props.onToggleProject} className={props?.selectedProject?.label === 'Project' ? "project-text-color project-text-timer" : 'project-text-timer'}> 
                        {props?.selectedProject?.label === 'Project'  && 
                            <img 
                                src={circledPlusIcon} 
                                alt="Circled Plus Icon" 
                                style={{ width: '20px', height: '20px', marginRight: '5px'}}
                            />
                        }
                        {getSelectedProjectAndClient(props.selectedProject, props.selectedClient)}
                    </button>
                    {props.isTimerOn && <input disabled className="timer-duration" value={props.totalTime}></input>}
                    <button onClick={props.onTimerStop} className="stop-btn">Stop</button>
                </div>
                <button className="three-dots" onClick={props.ontoggleActionItem}>
                    <img src={threeDotsIcon} alt="menu Icon" style={{ width: '25px', height: '25px'}}/>
                </button>
                <div className={props.showActionItems ? "action-items-container": "hide"} >
                <ul className="action-items">
                    <li>
                    <button onClick={props.onDiscard} className="discard-btn">Discard</button>
                    </li>
                </ul>
            </div>
            </div>
            <div className= {props.showProjects ? "project-dropdown-timer" : ''}>
                {props.showProjects && 
                    <Project 
                        onSelect={props.onProjectSelect}
                        setShowProjects={props.setShowProjects}
                        selectedProject={props.selectedProject}
                        selectedClient={props.selectedClient}
                    />
                }    
            </div>
        </>
    )
}