import { checkString } from "./checkString"
import { HoursAndMinutesProp, Data } from "../types/types"
import { formatTime } from "./dateFunctions"
import { parseISODuration } from "./checkString"

export function convertToHoursAndMinutes(time: string): HoursAndMinutesProp {
    if(time.length <= 5 && time.length > 0){
        const { isValid, colon } = checkString(time)

        if(isValid && (colon < 2)){
            let hours: number, minutes: number
            const str = time.replace(':', '')

            if(str.length === 2 && Number(str) > 24){
                hours = Number(str.slice(0, 1))
                minutes = Number(str.slice(1))
                return {hours, minutes, isValid: true}
            }
            hours = Number(str.slice(0, 2)) === 24 ? 0 : Number(str.slice(0,2))
            minutes = Number(str.slice(2))

            hours = (hours + (Math.floor(minutes / 60) % 24)) 
            minutes = minutes % 60

            return {hours, minutes, isValid: true}
        }
        return {hours: 0, minutes: 0, isValid: false}
    }
    return {hours: 0, minutes: 0, isValid: false}
}

export function calculateTimeDifference(startTime: Date, endTime: Date) {
    let totalDuration = Math.abs(startTime.getTime() - endTime.getTime())
    
    const hrs = Math.floor(totalDuration / (1000 * 60 * 60))
    const mins = Math.floor((totalDuration % (1000 * 60 * 60)) / (1000 * 60))

    return { hrs, mins }
}

export function isDurationLimitExceeded(startTime: Date, endTime: Date){
    const { hrs } = calculateTimeDifference(startTime, endTime)
    return hrs > 999
}

export function convertDurationToHrsMinsSecs(duration: string): string{
    let hours: number, minutes: number, seconds: number = 0
    
    if(duration.length <= 5 && !duration.includes(':')){
        minutes = Number(duration.slice(-2)) || 0
        hours = Number(duration.slice(0, -2)) || 0
    }
    else{
        const [hrs, mins, secs] = duration.split(':')
        hours = Number(hrs) || 0
        minutes = Number(mins) || 0
        seconds = Number(secs) || 0
    }

    minutes += Math.floor(seconds / 60)
    seconds = seconds % 60
    hours += Math.floor(minutes / 60)
    minutes = minutes % 60

    if(hours > 999){
        return `999:00:00`
    }
    return formatTime(hours, minutes, seconds)
}

export function calculateEndTime(startTime: Date, duration: string): Date{
    let startDate = new Date(startTime)
    const [ hours, minutes, seconds ] = duration.split(':').map(Number)
    startDate.setHours(hours + startDate.getHours(), minutes + startDate.getMinutes(), seconds + startDate.getSeconds())
    return startDate
}

export function addTotalTime(tasks: Data[]){
    const totalTimeInMS = tasks.reduce((acc, cur) => {
       const [hours, minutes, seconds] = (parseISODuration(cur.timeInterval.duration)).split(':').map(Number)
       acc += (hours * 60 * 60 + minutes * 60 + seconds) * 1000
       return acc
    }, 0)

    const sec = Math.floor((totalTimeInMS / 1000) % 60)
    const min = Math.floor((totalTimeInMS / (1000 * 60)) % 60)
    const hrs = Math.floor((totalTimeInMS / (1000 * 60 * 60)))

    return `${hrs.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
}