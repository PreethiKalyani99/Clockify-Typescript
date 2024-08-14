import { getFormattedDate, splitToDateComponents } from "./dateFunctions";
import { Data, EntriesByWeek, Constants } from "../types/types";


export function groupEntriesByWeek(timeEntries:Data[]){
    let timeEntriesByWeek: EntriesByWeek = {}
    timeEntries && timeEntries.forEach(timeEntry => {
        const dateStr = getFormattedDate(new Date(timeEntry.timeInterval.start))
        let timeEntryDate = new Date(timeEntry.timeInterval.start)

        const { date: currentEntryDate, year: currentEntryYear, month: currentEntryMonth} = splitToDateComponents(timeEntryDate)

        let firstDayOfWeek = timeEntryDate.getDate() - timeEntryDate.getDay()
        let lastDayOfWeek = firstDayOfWeek + Constants.DAYS_TO_END_OF_WEEK

        const { date: weekStartDate, year: weekStartYear, month: weekStartMonth} = splitToDateComponents(new Date(timeEntryDate.setDate(firstDayOfWeek)))

        let { date: weekEndDate, year: weekEndYear, month: weekEndMonth} = splitToDateComponents(new Date(timeEntryDate.setDate(lastDayOfWeek)))


        if((weekEndMonth === Constants.LAST_MONTH_OF_YEAR && currentEntryMonth < weekEndMonth) ||  // Eg: Dec(week end month) === Dec && Jan(currentMonth) < Dec(week end month)
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
