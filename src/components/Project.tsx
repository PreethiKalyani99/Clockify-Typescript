import { useState } from "react";
import Select, { components, MenuListProps } from 'react-select';
import { CreateNewProject } from "./CreateNewProject";
import { useDispatch } from "react-redux";
import { setIsModalOpen } from "../redux/clockifySlice";
import { ClientsAndProjects, ProjectProps } from "../types/types";
import { groupProjectsAndClients } from "../utils/groupValues";
import { AppDispatch } from "../redux/store";

function customOptions(clientsAndProjects: ClientsAndProjects){
    if (!clientsAndProjects) {
        return []
    }
    return Object.keys(clientsAndProjects).map(clientName => ({
        label: clientName,
        options: clientsAndProjects[clientName].projects.map(project => ({
            value: project.id,
            label: project.name
        }))
    }))
}

export function Project(props: ProjectProps){
    const [showPopup, setShowPopup] = useState(false)
    const projectsAndClients = groupProjectsAndClients(props.projects)
    const options = customOptions(projectsAndClients)
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch<AppDispatch>()

    function componentMenuList(prop: MenuListProps<any>){
        return (
            <components.MenuList {...prop}>
            {prop.children}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px',
                    borderTop: '1px solid #ccc',
                    cursor: 'pointer',
                    position: 'sticky',
                    bottom: 0,
                    background: 'white'
                }}
                onClick={() => {
                    setIsOpen(!isOpen)
                    dispatch(setIsModalOpen(!isOpen))
                    setShowPopup(!showPopup)
                }}
            >
                Create New Project
            </div>
        </components.MenuList>
        )
    }
    return (
        <>
            {options.length > 0 ? 
                <Select
                    className="react-selectcomponent"
                    onChange={props.onSelect}
                    options={options}
                    isSearchable
                    placeholder="Search project"
                    menuIsOpen
                    components={{ MenuList: componentMenuList }}
                /> : 
                <div>Loading Projects...</div>
            }
            {showPopup && 
                <CreateNewProject
                    isOpen={isOpen}
                    setShowProjects={props.setShowProjects}
                    selectedProject={props.selectedProject}
                    setSelectedProject={props.setSelectedProject || null}
                    selectedClient={props.selectedClient}
                    setSelectedClient={props?.setSelectedClient || null}
                    setIsOpen={setIsOpen}
                    projects={props.projects}
                    clients={props.clients}
                    timeEntry={props.timeEntry}
                    setShowPopup={setShowPopup}
                />
            }
        </>
    )
}