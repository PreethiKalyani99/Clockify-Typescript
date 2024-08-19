import { checkString } from "./checkString"
import { HoursAndMinutesProp, Data } from "../types/types"
import { formatTime } from "./dateFunctions"
import { parseISODuration } from "./checkString"
import { TimeConstants } from "../types/types"

export function convertToHoursAndMinutes(time: string): HoursAndMinutesProp {
    if(time.replace(':', '').length > TimeConstants.HOURS_AND_MINUTES_STRING_LENGTH || time.length < 1){
        return {hours: 0, minutes: 0, isValid: false}
    }

    const { isValid, numberOfColons } = checkString(time)

    if(!isValid || (numberOfColons > TimeConstants.COLON_COUNT_IN_HOURS_AND_MINUTES)){
        return {hours: 0, minutes: 0, isValid: false}
    }

    let hours: number, minutes: number
    const str = time.replace(':', '')

    if((str.length === 2) && (Number(str) > TimeConstants.HOURS_PER_DAY) && (numberOfColons === 0)){
        hours = Number(str.slice(0, 1))
        minutes = Number(str.slice(1))
        return {hours, minutes, isValid: true}
    }
    if(numberOfColons > 0){
        const [ hrs, mins ] = time.split(':')
        hours = Number(hrs) === TimeConstants.HOURS_PER_DAY ? 0 : Number(hrs)
        minutes = Number(mins)
    }
    else{
        hours = Number(str.slice(0, 2)) === TimeConstants.HOURS_PER_DAY ? 0 : Number(str.slice(0,2))
        minutes = Number(str.slice(2))
    }

    hours = (hours + (Math.floor(minutes / TimeConstants.SECONDS_PER_MINUTE) % TimeConstants.HOURS_PER_DAY)) 
    minutes = minutes % TimeConstants.SECONDS_PER_MINUTE

    return {hours, minutes, isValid: true}
}

export function calculateTimeDifference(startTime: Date, endTime: Date) {
    let totalDuration = Math.abs(startTime.getTime() - endTime.getTime())
    
    const hrs = Math.floor(totalDuration / TimeConstants.MILLISECONDS_PER_HOUR)
    const mins = Math.floor((totalDuration % TimeConstants.MILLISECONDS_PER_HOUR) / TimeConstants.MILLISECONDS_PER_MINUTE)

    return { hrs, mins }
}

export function isDurationLimitExceeded(startTime: Date, endTime: Date){
    const { hrs } = calculateTimeDifference(startTime, endTime)
    return hrs > TimeConstants.MAX_HOURS_LIMIT
}

export function convertDurationToHrsMinsSecs(duration: string): string{
    let hours: number, minutes: number, seconds: number = 0
    
    if(duration.length <= TimeConstants.MAX_DURATION_STRING_LENGTH && !duration.includes(':')){
        minutes = Number(duration.slice(-2)) || 0
        hours = Number(duration.slice(0, -2)) || 0
    }
    else{
        const [hrs, mins, secs] = duration.split(':')
        hours = Number(hrs) || 0
        minutes = Number(mins) || 0
        seconds = Number(secs) || 0
    }

    minutes += Math.floor(seconds / TimeConstants.SECONDS_PER_MINUTE)
    seconds = seconds % TimeConstants.SECONDS_PER_MINUTE
    hours += Math.floor(minutes / TimeConstants.SECONDS_PER_MINUTE)
    minutes = minutes % TimeConstants.SECONDS_PER_MINUTE

    if(hours > TimeConstants.MAX_HOURS_LIMIT){
        return TimeConstants.MAX_DURATION
    }
    return formatTime(hours, minutes, seconds)
}

export function calculateEndTime(startTime: Date, duration: string): Date{
    let startDate = new Date(startTime)
    const [ hours, minutes, seconds ] = duration.split(':').map(Number)
    startDate.setHours(hours + startDate.getHours(), minutes + startDate.getMinutes(), seconds + startDate.getSeconds())
    return startDate
}

export function convertMilliSecsToHrsMinsSec(totalTimeInMS: number){
    const sec = Math.floor((totalTimeInMS / TimeConstants.MILLISECONDS_PER_SECOND) % TimeConstants.SECONDS_PER_MINUTE)
    const min = Math.floor((totalTimeInMS / (TimeConstants.MILLISECONDS_PER_MINUTE)) % TimeConstants.SECONDS_PER_MINUTE)
    const hrs = Math.floor((totalTimeInMS / (TimeConstants.MILLISECONDS_PER_HOUR)))

    return `${hrs.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
}

export function addTotalTime(tasks: Data[]){
    const totalTimeInMS = tasks.reduce((acc, cur) => {
       const [hours, minutes, seconds] = (parseISODuration(cur.timeInterval.duration)).split(':').map(Number)
       acc += (hours * TimeConstants.SECONDS_PER_MINUTE * TimeConstants.SECONDS_PER_MINUTE + minutes * TimeConstants.SECONDS_PER_MINUTE + seconds) * TimeConstants.MILLISECONDS_PER_SECOND
       return acc
    }, 0)

    return convertMilliSecsToHrsMinsSec(totalTimeInMS)
}