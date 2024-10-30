import { createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_TOKEN, USER_ID, WORKSPACE_ID } from "../config";
import { 
    Data, 
    TimeEntryDataProp, 
    IdProp, 
    UpdateTimeEntryProp,
    Project,
    ClientData,
    CreateClientProp,
    CreateProjectProp,
} from "../types/types";

export const getUserTimeEntries = createAsyncThunk("getUserTimeEntries", async () => {
    try{
        const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/user/${USER_ID}/time-entries?hydrated=true`, {
                method: "GET",
                headers: {
                    'X-Api-Key':AUTH_TOKEN ?? '',
                    'Content-Type': 'application/json'
                }
            },
        )
        if (!response.ok) {
            console.error(`Failed to get time entries: ${response.status} - ${response.statusText}`)
            throw new Error('Failed to get time entries')
        }
    
        return await response.json() as Data[]
    }
    catch(error){
        console.log(error)
        throw error
    }
})

export const createTimeEntry = createAsyncThunk("createTimeEntry", async (timeEntryData: TimeEntryDataProp) => {
    try{
        const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/time-entries`, {
            method: "POST",
            headers: {
                'X-Api-Key':AUTH_TOKEN ?? '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timeEntryData)
        })
        if (!response.ok) {
            console.error(`Failed to create time entry : ${response.status} - ${response.statusText}`)
            throw new Error('Failed to create time entry')
        }
    
        return await response.json() as Data
    }
    catch(error){
        console.log(error)
        throw error
    }
})

export const updateTimeEntry = createAsyncThunk("updateTimeEntry", async ({id, ...timeEntryData}: UpdateTimeEntryProp) => {
    try{
        const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/time-entries/${id}`, {
            method: "PUT",
            headers: {
                'X-Api-Key':AUTH_TOKEN ?? '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timeEntryData)
        })
        if (!response.ok) {
            throw new Error('Failed to update time entry')
        }
    
        return await response.json() as Data
    }
    catch(error){
        console.log(error)
        throw error
    }
})

export const deleteTimeEntry = createAsyncThunk("deleteTimeEntry", async ({id}: IdProp) => {
    try{
        await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/time-entries/${id}`, {
            method: "DELETE",
            headers: {
                'X-Api-Key':AUTH_TOKEN ?? '',
                'Content-Type': 'application/json'
            }
        })
        return id
    }
    catch(error){
        console.log(error)
        throw error
    }
})

export const duplicateTimeEntry = createAsyncThunk("duplicateTimeEntry", async ({id}: IdProp) => {
    try{
        const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/user/${USER_ID}/time-entries/${id}/duplicate`, {
            method: "POST",
            headers: {
                'X-Api-Key':AUTH_TOKEN ?? '',
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error('Failed to update time entry')
        }
    
        return await response.json() as Data
    }
    catch(error){
        console.log(error)
        throw error
    }
})

export const getProjects = createAsyncThunk("getProjects", async() => {
    try{
        const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/projects`, {
            method: "GET",
            headers: {
                'X-Api-Key':AUTH_TOKEN ?? '',
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error('Failed to get projects from workspace')
        }
    
        return await response.json() as Project[]
    }
    catch(error){
        console.log(error)
        throw error
    }
})

export const getClients = createAsyncThunk("getClients", async() => {
    try{
        const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/clients`, {
            method: "GET",
            headers: {
                'X-Api-Key':AUTH_TOKEN ?? '',
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error('Failed to get clients from workspace')
        }
    
        return await response.json() as ClientData[]
    }
    catch(error){
        console.log(error)
        throw error
    }
})

export const createProject = createAsyncThunk("createProject", async(data: CreateProjectProp) => {
    try{
        const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/projects`, {
            method: "POST",
            headers: {
                'X-Api-Key':AUTH_TOKEN ?? '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error('Failed to create project in workspace')
        }
    
        return await response.json() as Project
    }
    catch(error){
        console.log(error)
        throw error
    }
})


export const createClient = createAsyncThunk("createClient", async(data: CreateClientProp) => {
    try{
        const response = await fetch(`https://api.clockify.me/api/v1/workspaces/${WORKSPACE_ID}/clients`, {
            method: "POST",
            headers: {
                'X-Api-Key':AUTH_TOKEN ?? '',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (!response.ok) {
            throw new Error('Failed to create client in workspace')
        }
    
        return await response.json() as ClientData
    }
    catch(error){
        console.log(error)
        throw error
    }
})