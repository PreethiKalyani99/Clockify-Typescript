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