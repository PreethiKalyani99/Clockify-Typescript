import { ProjectData, ClientsAndProjects, Data, EntriesByWeek, TimeConstants } from "../types/types"
import { getFormattedDate, splitToDateComponents } from "./dateFunctions"

export function groupProjectsAndClients(projects: ProjectData[]) {
    let clientsAndProjects: ClientsAndProjects = {}
    projects.forEach(item => {
        let clientName = item.clientName || "No Client"
        if (!clientsAndProjects[clientName]) {
            clientsAndProjects[clientName] = { projects: [], projectKeys: new Set() }
        }

        let projectKey = `${item.name}-${item.id}`

        if (!clientsAndProjects[clientName].projectKeys.has(projectKey)) {
            clientsAndProjects[clientName].projects.push({ name: item.name, id: item.id })
            clientsAndProjects[clientName].projectKeys.add(projectKey)
        }
    })
    return clientsAndProjects
}

export function groupEntriesByWeek(timeEntries:Data[]){
    let timeEntriesByWeek: EntriesByWeek = {}
    timeEntries && timeEntries.forEach(timeEntry => {
        const dateStr = getFormattedDate(new Date(timeEntry.timeInterval.start))
        let timeEntryDate = new Date(timeEntry.timeInterval.start)

        const { date: currentEntryDate, year: currentEntryYear, month: currentEntryMonth} = splitToDateComponents(timeEntryDate)

        let firstDayOfWeek = timeEntryDate.getDate() - timeEntryDate.getDay()
        let lastDayOfWeek = firstDayOfWeek + TimeConstants.DAYS_REMAINING_IN_WEEK_FROM_DAY_2

        const { date: weekStartDate, year: weekStartYear, month: weekStartMonth} = splitToDateComponents(new Date(timeEntryDate.setDate(firstDayOfWeek)))

        let { date: weekEndDate, year: weekEndYear, month: weekEndMonth} = splitToDateComponents(new Date(timeEntryDate.setDate(lastDayOfWeek)))


        if((weekEndMonth === TimeConstants.DECEMBER_MONTH && currentEntryMonth < weekEndMonth) ||  // Eg: Dec(week end month) === Dec && Jan(currentMonth) < Dec(week end month)
            (currentEntryDate < weekStartDate && currentEntryMonth > weekEndMonth))           // Eg: 3(current date) < 31(week start date) && Aug(current month) > July(week end month)
        {
            if(currentEntryYear > weekEndYear){      // Eg: 2025(current year) > 2024 (week end year)
                weekEndMonth = currentEntryMonth
                weekEndYear += 1
            }
            else{
                weekEndMonth = currentEntryMonth // sep 29 (week start date) to oct 5 (week end date)  ----> oct 1 (current entry date)
            }
        }

        let weekRange = `${weekStartYear}-${weekStartMonth}-${weekStartDate} to ${weekEndYear}-${weekEndMonth}-${weekEndDate}`

        let found = false
        for (const range in timeEntriesByWeek) {
            let [start, end] = range.split(' to ').map(dateStr => new Date(dateStr))
            if (timeEntryDate >= start && timeEntryDate <= end) {
                if (!timeEntriesByWeek[range][dateStr]) {
                    timeEntriesByWeek[range][dateStr] = []
                }
                timeEntriesByWeek[range][dateStr].push(timeEntry)
                found = true
                break
            }
        }

        if (!found) {
            if (!timeEntriesByWeek[weekRange]) {
                timeEntriesByWeek[weekRange] = {}
            }

            if (!timeEntriesByWeek[weekRange][dateStr]) {
                timeEntriesByWeek[weekRange][dateStr] = []
            }
            timeEntriesByWeek[weekRange][dateStr].push(timeEntry)
        }
    })

    return timeEntriesByWeek
}