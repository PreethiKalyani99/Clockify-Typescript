import { createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_TOKEN, USER_ID, WORKSPACE_ID } from "../config";
import { 
    Data, 
    TimeEntryDataProp, 
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