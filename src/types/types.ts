export enum TimeConstants{
    MAX_HOURS_LIMIT = 999,
    COLON_COUNT_IN_HOURS_AND_MINUTES_STRING = 1,
    COLON_COUNT_IN_DURATION_STRING = 2,
    HOURS_AND_MINUTES_STRING_LENGTH = 4,
    MAX_DURATION_STRING_LENGTH = 5,
    HOURS_PER_DAY = 24,
    MILLISECONDS_PER_HOUR = 3600000,
    MILLISECONDS_PER_MINUTE = 60000,
    SECONDS_PER_MINUTE = 60,
    MAX_DURATION = '999:00:00',
    MILLISECONDS_PER_SECOND = 1000,
    DAYS_REMAINING_IN_WEEK_FROM_DAY_2 = 6,
    DECEMBER_MONTH = 12
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
    clientId: string | null
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
    projects: ProjectData[],
    clients: ClientData[],
    currentTask: CurrentTask
}

export type UpdateTimerProp = {
    name: string
    project: string
    client: string
    projectId: string | null
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
    setShowProjects: React.Dispatch<React.SetStateAction<boolean>>
    showProjects: boolean
    onProjectSelect: (value: SelectedOption) => void
    projects: ProjectData[],
    clients: ClientData[]
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

export type TimeEntriesProp = TimeEntryCommonProp & {
    entriesByWeek: EntriesByWeek
}

export type EntriesByWeek = {
    [weekRange: string]: {
        [date: string]: Data[]
    }
}


export type WeekEntriesProp = TimeEntryCommonProp & {
    range: string
    timeEntries: { [date: string]: TimeEntriesValues[] }
}

export type DayEntriesProp = TimeEntryListProp & {
    date: string 
}

export type TimeEntryListProp = TimeEntryCommonProp & {
    entries: TimeEntriesValues[]
}

export type SingleTimeEntryProp = TimeEntryCommonProp & {
    entry: TimeEntriesValues
    onTaskBlur: (description: string, timeStart: Date, timeEnd: Date, id: string, projectId: string | null) => void
    onStartBlur: (e: FocusEvent, description: string, timeEnd: Date, id: string, projectId: string | null) => void
    onEndBlur: (e: FocusEvent, description: string, timeStart: Date, id: string, projectId: string | null) => void
    onDurationBlur: (e: FocusEvent, description: string, timeStart: Date, id: string, projectId: string | null) => void
    onDateChange: (dateTime: Date | null, description: string, timeStart: Date, timeEnd: Date, id: string, projectId: string | null) => void
    onDuplicateTimeEntry: (id: string) => void
    onDeleteTimeEntry: (id: string) => void
}

export type projects = {
    name: string
    id: string
}
export type ClientsAndProjects = {
    [clientName: string]: {
        projectKeys: Set<string>
        projects: projects[]
    }
}

export type ProjectProps = {
    onSelect: (value: SelectedOption) => void
    setShowProjects: React.Dispatch<React.SetStateAction<boolean>>
    selectedProject: SelectedOption
    selectedClient: SelectedOption
    setSelectedProject?: React.Dispatch<React.SetStateAction<SelectedOption>>
    setSelectedClient?: React.Dispatch<React.SetStateAction<SelectedOption>>
    timeEntry?: TimeEntriesValues
}

export type CreateNewProjectProps = {
    isOpen: boolean
    setShowProjects: React.Dispatch<React.SetStateAction<boolean>>
    selectedProject: SelectedOption
    selectedClient: SelectedOption
    setSelectedProject?: React.Dispatch<React.SetStateAction<SelectedOption>>
    setSelectedClient?: React.Dispatch<React.SetStateAction<SelectedOption>>
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    projects: ProjectData[]
    clients: ClientData[]
    timeEntry?: TimeEntriesValues
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>
}

export type CreateClientProp = {
    name: string
}

export type CreateProjectProp = CreateClientProp & {
    clientId: string | null
}

export type TimeEntryCommonProp = {
    projects: Project[]
    toggleTimer: () => void
}

export type TimerProps = {
    totalTime: string
    isModalOpen: boolean
    onNameChange: (e: ChangeEvent) => void
    taskName: string
    onToggleProject: () => void
    selectedProject: SelectedOption
    selectedClient: SelectedOption
    isTimerOn: boolean
    onTimerStop: () => void
    ontoggleActionItem: () => void
    showActionItems: boolean
    onDiscard: () => void
    showProjects: boolean
    setShowProjects: React.Dispatch<React.SetStateAction<boolean>>
    onProjectSelect: (value: SelectedOption) => void
}
