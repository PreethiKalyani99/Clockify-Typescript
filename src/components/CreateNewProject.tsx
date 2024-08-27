import { useState } from "react";
import Creatable from 'react-select/creatable';
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setIsModalOpen, updateClientValue, updateProjectValue } from "../redux/clockifySlice";
import { createClient, createProject, updateTimeEntry } from "../redux/clockifyThunk";
import { CreateNewProjectProps, SelectedOption, ChangeEvent, Project  } from "../types/types";
import { AppDispatch } from "../redux/store";
import { SingleValue } from "react-select";

export function CreateNewProject(props: CreateNewProjectProps){
    const [projectInput, setProjectInput] = useState('')
    const dispatch = useDispatch<AppDispatch>()

    function handleClose(){
        props.setIsOpen(false)
        dispatch(setIsModalOpen(false))
        props.setShowPopup(false)
    }

    function handleInputChange(e: ChangeEvent){
        setProjectInput(e.target.value)
    }

    function handleSelect(value: SingleValue<SelectedOption>){
        if(!value) {
            return
        }
        if(!props.setSelectedClient){
            dispatch(updateClientValue(value))
            return 
        }
        props.setSelectedClient(value)
    }

    function handleCreateOption(input: string){
        const isClientExists = props.clients.some(client => client.name === input)
        if(!isClientExists){
            dispatch(createClient({ name: input }))
            if(!props.setSelectedClient){
                dispatch(updateClientValue({ label: input, value: '' }))
                return
            }
            props.setSelectedClient({ label: input, value: '' })
        }
    }

    async function addProject(){
        const clientInfo = props?.clients?.find(item => item.name === props.selectedClient.label)
        const response = await dispatch(createProject({
            name: projectInput,
            clientId: clientInfo ? clientInfo.id : null
        }))

        const projectInfo =  response.payload as Project | undefined

        if(!props.setSelectedProject){
            dispatch(updateProjectValue({value: projectInfo?.id ?? '', label: projectInput}))
            dispatch(updateClientValue({value: clientInfo?.id ?? '', label: props.selectedClient.label}))
        }
        else{
            props.setSelectedProject({value: projectInfo?.id ?? '', label: projectInput})
            props.timeEntry && dispatch(updateTimeEntry({
                id: props.timeEntry.id, 
                start: props.timeEntry.timeInterval.start, 
                end: props.timeEntry.timeInterval.end, 
                description: props.timeEntry.description,
                projectId: projectInfo?.id ?? ''
            }))
        }
        setProjectInput('')
        props.setIsOpen(false)
        dispatch(setIsModalOpen(false))
        props.setShowPopup(false)
        props.setShowProjects(false)
    }

    return (
        <>
            <Modal show={props.isOpen} onHide={handleClose}>
                <ModalHeader closeButton>
                    <ModalTitle>
                        Create New Project
                    </ModalTitle>
                </ModalHeader>
                <ModalBody className="modal-body">
                    <input
                        className="create-project" 
                        type="text" 
                        placeholder="Enter Project name" 
                        name="project"
                        required
                        value={projectInput} 
                        onChange={handleInputChange}
                    ></input>
                    <sup className="mt-3 ms-2 required fs-5">*</sup>
                     <Creatable
                        className="react-selectcomponent ms-4"
                        onChange={handleSelect}
                        onCreateOption={handleCreateOption}
                        options={props?.clients?.map(client => {
                            return ({
                                label: client.name,
                                value: client.id
                            })
                        })}
                        isSearchable
                        value={props.selectedClient}
                        placeholder="Select client"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={addProject} disabled={projectInput.length < 2}>CREATE</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}