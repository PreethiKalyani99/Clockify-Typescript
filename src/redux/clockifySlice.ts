import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { 
    getUserTimeEntries,
    createTimeEntry,
    updateTimeEntry,
    duplicateTimeEntry,
    deleteTimeEntry,
    getProjects,
    getClients,
    createProject,
    createClient
} from "./clockifyThunk";
import { InitialState, Data, SelectedOption, Project, ClientData, UpdateTimerProp } from "../types/types";

const initialState : InitialState = {
    isLoading: false,
    data: [],
    isModalOpen: false,
    selectedProject: {value: '', label: 'Project'},
    selectedClient: {value: '', label: ''},
    projects: [],
    clients: [],
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
        },
        updateProjectValue: (state, action: PayloadAction<SelectedOption>) => {
            state.selectedProject = action.payload
        },
        updateClientValue: (state, action: PayloadAction<SelectedOption>) => {
            state.selectedClient = action.payload
        },
        updateTimer: (state, action: PayloadAction<UpdateTimerProp>) => {
            const {name, project, client, projectId, clientId} = action.payload
            state.currentTask.taskName = name
            state.selectedProject = {value: projectId ?? '', label: project}
            state.selectedClient = {value: clientId, label: client}
        },
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
        .addCase(updateTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updateTimeEntry.fulfilled, (state, action: PayloadAction<Data>) => {
            state.isLoading = false
            const id = action.payload?.id
            const timeEntry = state.data.find(entry => entry.id === id)
            if (timeEntry) 
                Object.assign(timeEntry, action.payload)
        })
        .addCase(duplicateTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        .addCase(duplicateTimeEntry.fulfilled, (state, action: PayloadAction<Data | undefined>) => {
            state.isLoading = false
            if(action.payload)
                state.data = [action.payload, ...state.data]
        })
        .addCase(deleteTimeEntry.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteTimeEntry.fulfilled, (state, action: PayloadAction<string | undefined>) => {
            if(action.payload){
                const id = action.payload
                const newData = state.data.filter(entry => entry.id !== id)
                state.data = [...newData]
            }
        })
        .addCase(getProjects.fulfilled, (state, action: PayloadAction<Project[] | undefined>) => {
            if(action.payload)
                state.projects = action.payload
            
        })
        .addCase(getClients.fulfilled, (state, action: PayloadAction<ClientData[] | undefined>) => {
            if(action.payload)
                state.clients = action.payload
        })
        .addCase(createProject.fulfilled, (state, action: PayloadAction<Project | undefined>) => {
            if(action.payload)
                state.projects = [...state.projects, action.payload]
        })
        .addCase(createClient.fulfilled, (state, action: PayloadAction<ClientData | undefined>) => {
            if(action.payload)
                state.clients = [action.payload, ...state.clients]
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
    updateClientValue,
    updateProjectValue,
    updateTimer
} = ClockifySlice.actions
