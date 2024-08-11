import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InitialState } from "../types/types";

const initialState : InitialState = {
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
        }
    }
})

export const {
    setIsModalOpen,
    updateStartTime,
    updateEndTime,
    updateDuration,
    updateTaskName
} = ClockifySlice.actions
