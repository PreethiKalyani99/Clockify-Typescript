import { TimeConstants } from "../types/types"

export function getFormattedDate(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`
}

export function getFormattedTime(date: Date){
    return formatTime(date.getHours(), date.getMinutes())
}

export function getLongFormattedDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function formatTime(hours: string | number, minutes: string | number, seconds?: string | number): string{
    const hoursStr = hours.toString().padStart(2, '0')
    const minutesStr = minutes.toString().padStart(2, '0')
    const secondsStr = seconds !== undefined ? `:${seconds.toString().padStart(2, '0')}` : ''
  
    return `${hoursStr}:${minutesStr}${secondsStr}`
}

export function splitToDateComponents(taskDate: Date) {
    const date = taskDate.getDate()
    const year = taskDate.getFullYear()
    const month = taskDate.getMonth() + 1
    return {date, year, month}
}
 
export function calculateDays(startDate: Date, endDate: Date): number{ 
    const ONE_DAY = TimeConstants.HOURS_PER_DAY * TimeConstants.MILLISECONDS_PER_HOUR
    const startDateStartOfDay = new Date(startDate.toDateString()).getTime()
    const endDateStartOfDay = new Date(endDate.toDateString()).getTime()
    return Math.floor(Math.abs((startDateStartOfDay - endDateStartOfDay) / ONE_DAY))
}

export function calculateEndDate(startDate: Date, endDate: Date, previousStartDate: Date){
    const days = calculateDays(previousStartDate, endDate)
    let end = new Date(endDate)
    end.setFullYear(startDate.getFullYear(),(startDate.getMonth()),startDate.getDate())

    if(days !== 0){
        end.setDate(startDate.getDate() + days)
        return end
    }
    return end
}