export type SelectedOption = {
    value: string
    label: string
}

export type CurrentTask = {
    startTime: string
    endTime: string
    duration: string
    taskName: string
    project: string
    client: string
}

export type InitialState = { 
    isModalOpen: boolean,
    selectedProject: SelectedOption,
    selectedClient: SelectedOption,
    currentTask: CurrentTask
}

export type HeaderProp = {
    toggleSidebar: () => void
}

export type SideBarProp = {
    isSidebarShrunk: boolean
}

export type ChangeEvent =  React.ChangeEvent<HTMLInputElement>

export type FocusEvent = React.FocusEvent<HTMLInputElement>

export type KeyboardEvent = React.KeyboardEvent<HTMLInputElement>

export type AddTaskProp = {
    onToggle: () => void
    selectedProject : SelectedOption
    selectedClient: SelectedOption
    timeStart: Date
    timeEnd: Date
    isModalOpen: boolean
    taskDescription: string
    start: string
    end: string
    totalDuration: string
    days : number
    onNameChange: (e: ChangeEvent) => void
    onStartChange: (e: ChangeEvent) => void
    onEndChange: (e: ChangeEvent) => void
    onDurationChange: (e: ChangeEvent) => void
    onStartBlur: (e: FocusEvent) => void
    onEndBlur: (e: FocusEvent) => void
    onDurationBlur: (e: FocusEvent) => void
    onDateChange: (dateTime: Date | null) => void
    onAddTask: () => void
    onEnter: (e: KeyboardEvent) => void
}

export type HoursAndMinutesProp = {
    hours: number
    minutes: number
    isValid: boolean
}

export type CheckString = {
    isValid : boolean
    colon: number
}

export type TimeEntryDataProp = {
    description: string
    start: string
    end: string
    projectId: string | null
}

export type TimeInterval = {
    duration: string
    end: string
    start: string
}

export type CustomFieldValues = {
    customFieldId: string
    name: string
    timeEntryId: string
    type: string
    value: string
}

export type TimeEntries = {
    customFieldValues: CustomFieldValues[]
    description: string
    id: string
    isLocked: boolean
    kioskId: string | null
    projectId: string | null
    taskId: string | null
    timeInterval: TimeInterval
    type: string
    userId: string
    workspaceId: string
}

export type Project = {
    clientId: string
    clientName: string
    color: string
    duration: string
    id: string
    name: string
}

export type Data = TimeEntries & {
    project: Project
}