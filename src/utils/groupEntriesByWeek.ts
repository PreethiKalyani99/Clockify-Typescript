import { getFormattedDate, splitToDateComponents } from "./dateFunctions";
import { Data, EntriesByWeek } from "../types/types";


export function groupEntriesByWeek(timeEntries:Data[]){
    let timeEntriesByWeek: EntriesByWeek = {}
    timeEntries && timeEntries.forEach(timeEntry => {
        const dateStr = getFormattedDate(new Date(timeEntry.timeInterval.start))
        let timeEntryDate = new Date(timeEntry.timeInterval.start)

        const { date: timeEntryStartDate, year: timeEntryYear, month: timeEntryMonth} = splitToDateComponents(timeEntryDate)

        let first = timeEntryDate.getDate() - timeEntryDate.getDay()
        let last = first + 6

        const { date: weekStartDate, year: weekStartYear, month: weekStartMonth} = splitToDateComponents(new Date(timeEntryDate.setDate(first)))

        let { date: weekEndDate, year: weekEndYear, month: weekEndMonth} = splitToDateComponents(new Date(timeEntryDate.setDate(last)))

        if((weekEndMonth === 12 && timeEntryMonth < weekEndMonth) || (timeEntryStartDate < weekStartDate && timeEntryMonth > weekEndMonth)){
            if(timeEntryYear > weekEndYear){
                weekEndMonth = timeEntryMonth
                weekEndYear += 1
            }
        }
        else{
            weekEndYear = new Date(timeEntryDate.setDate(last)).getFullYear()
            weekEndMonth = new Date(timeEntryDate.setDate(last)).getMonth() + 1
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
