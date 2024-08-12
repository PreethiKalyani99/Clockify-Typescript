import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
    createTimeEntry,
    getUserTimeEntries
} from "./clockifyThunk";
import { InitialState, Data } from "../types/types";

const initialState : InitialState = {
    isLoading: false,
    data: [],
    isModalOpen: false,
    selectedProject: {value: '', label: 'Project'},
    selectedClient: {value: '', label: ''},
    currentTask: {
        startTime: new Date().toString(),
        endTime: new Date().toString(),
        duration: '00:00:00',
        taskName: '',
        project: '',
        client: ''
    }
}

export const ClockifySlice = createSlice({
    name: 'clockify',
    initialState,
    reducers: {
        setIsModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isModalOpen = action.payload
        },
        updateStartTime: (state, action: PayloadAction<string>) => {
            state.currentTask.startTime = action.payload
        },
        updateEndTime: (state, action: PayloadAction<string>) => {
            state.currentTask.endTime = action.payload
        },
        updateDuration: (state, action: PayloadAction<string>) => {
            state.currentTask.duration = action.payload
        },
        updateTaskName: (state, action: PayloadAction<string>) => {
            state.currentTask.taskName = action.payload
        },
        resetState: (state) => {
            state.currentTask.taskName = ''
            state.currentTask.startTime = new Date().toString()
            state.currentTask.endTime = new Date().toString()
            state.currentTask.duration = '00:00:00'
            state.selectedProject = {value: '', label: 'Project'}
            state.selectedClient = {value: '', label: ''}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createTimeEntry.fulfilled, (state, action: PayloadAction<Data>) => {
            state.isLoading = false
            state.data = [...state.data, action.payload] 
        })
        .addCase(getUserTimeEntries.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getUserTimeEntries.fulfilled, (state, action: PayloadAction<Data[] | undefined>) => {
            state.isLoading = false
            state.data = action.payload ?? []
        })
    }
})

export const {
    setIsModalOpen,
    updateStartTime,
    updateEndTime,
    updateDuration,
    updateTaskName,
    resetState,
} = ClockifySlice.actions
