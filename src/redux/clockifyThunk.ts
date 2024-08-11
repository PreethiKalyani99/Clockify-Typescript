import { createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_TOKEN, WORKSPACE_ID } from "../config";
import { 
    Data, 
    TimeEntryDataProp, 
} from "../types/types";

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
            throw new Error('Failed to create time entry')
        }
    
        return await response.json() as Data
    }
    catch(error){
        console.log(error)
        throw error
    }
})