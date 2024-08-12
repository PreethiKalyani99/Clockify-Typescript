export enum Constants{
    MAX_TIME_LIMIT = 999,
    NO_OF_COLON_HRS_MIN = 1,
    NO_OF_COLON_DURATION = 2,
    HRS_MINS_STR_LENGTH= 4,
    DURATION_STR_LENGTH = 5,
    HRS_PER_DAY = 24,
    MS_PER_HR = 3600000,
    MS_PER_MIN = 60000,
    TIME_DIVISOR = 60,
    MAX_DURATION = '999:00:00',
    MS_PER_SEC = 1000,
    DAYS_TO_END_OF_WEEK = 6,
    LAST_MONTH_OF_YEAR = 12
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

export type TimeEntriesValues = {
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
    project: Project
}

export type Page = {
    pageSize: number
    page: number
}

export type TimeEntryDataProp = {
    description: string
    start: string
    end: string
    projectId: string | null
}

export type IdProp = {
    id: string
}

export type UpdateTimeEntryProp = TimeEntryDataProp & IdProp

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

export type Project = {
    clientId: string
    clientName: string
    color: string
    duration: string
    id: string
    name: string
}

export type ProjectId = {
    projectId: string | null
}

export type User = {
    email: string
    id: string
    name: string
    profilePicture: string
    workspaceId: string
}

export type Data = TimeEntriesValues & {
    project: Project
}

export type ProjectData = Project & IdProp

export type ClientData = IdProp & {
    name : string
    email: string
}

export type InitialState = { 
    isLoading: boolean,
    data: Data[],
    isModalOpen: boolean,
    selectedProject: SelectedOption,
    selectedClient: SelectedOption,
    currentTask: CurrentTask
}

export type UpdateTimerProp = {
    name: string
    project: string
    client: string
    projectId: string
    clientId: string
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

export type AddTimeEntryProp = {
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
    numberOfColons: number
}

export type TimeEntriesProp = {
    entriesByWeek: EntriesByWeek
}

export type EntriesByWeek = {
    [weekRange: string]: {
        [date: string]: Data[]
    }
}


export type WeekEntriesProp = {
    range: string
    timeEntries: { [date: string]: TimeEntriesValues[] }
}

export type DayEntriesProp = TimeEntryListProp & {
    date: string 
}

export type TimeEntryListProp = {
    entries: TimeEntriesValues[]
}
