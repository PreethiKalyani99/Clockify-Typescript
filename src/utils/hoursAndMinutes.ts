import { checkString } from "./checkString"
import { HoursAndMinutesProp, Data } from "../types/types"
import { formatTime } from "./dateFunctions"
import { parseISODuration } from "./checkString"
import { Constants } from "../types/types"

export function convertToHoursAndMinutes(time: string): HoursAndMinutesProp {
    if(time.replace(':', '').length > Constants.HRS_MINS_STR_LENGTH || time.length < 1){
        return {hours: 0, minutes: 0, isValid: false}
    }

    const { isValid, numberOfColons } = checkString(time)

    if(!isValid || (numberOfColons > Constants.NO_OF_COLON_HRS_MIN)){
        return {hours: 0, minutes: 0, isValid: false}
    }

    let hours: number, minutes: number
    const str = time.replace(':', '')

    if((str.length === 2) && (Number(str) > Constants.HRS_PER_DAY) && (numberOfColons === 0)){
        hours = Number(str.slice(0, 1))
        minutes = Number(str.slice(1))
        return {hours, minutes, isValid: true}
    }
    if(numberOfColons > 0){
        const [ hrs, mins ] = time.split(':')
        hours = Number(hrs) === Constants.HRS_PER_DAY ? 0 : Number(hrs)
        minutes = Number(mins)
    }
    else{
        hours = Number(str.slice(0, 2)) === Constants.HRS_PER_DAY ? 0 : Number(str.slice(0,2))
        minutes = Number(str.slice(2))
    }

    hours = (hours + (Math.floor(minutes / Constants.TIME_DIVISOR) % Constants.HRS_PER_DAY)) 
    minutes = minutes % Constants.TIME_DIVISOR

    return {hours, minutes, isValid: true}
}

export function calculateTimeDifference(startTime: Date, endTime: Date) {
    let totalDuration = Math.abs(startTime.getTime() - endTime.getTime())
    
    const hrs = Math.floor(totalDuration / Constants.MS_PER_HR)
    const mins = Math.floor((totalDuration % Constants.MS_PER_HR) / Constants.MS_PER_MIN)

    return { hrs, mins }
}

export function isDurationLimitExceeded(startTime: Date, endTime: Date){
    const { hrs } = calculateTimeDifference(startTime, endTime)
    return hrs > Constants.MAX_TIME_LIMIT
}

export function convertDurationToHrsMinsSecs(duration: string): string{
    let hours: number, minutes: number, seconds: number = 0
    
    if(duration.length <= Constants.DURATION_STR_LENGTH && !duration.includes(':')){
        minutes = Number(duration.slice(-2)) || 0
        hours = Number(duration.slice(0, -2)) || 0
    }
    else{
        const [hrs, mins, secs] = duration.split(':')
        hours = Number(hrs) || 0
        minutes = Number(mins) || 0
        seconds = Number(secs) || 0
    }

    minutes += Math.floor(seconds / Constants.TIME_DIVISOR)
    seconds = seconds % Constants.TIME_DIVISOR
    hours += Math.floor(minutes / Constants.TIME_DIVISOR)
    minutes = minutes % Constants.TIME_DIVISOR

    if(hours > Constants.MAX_TIME_LIMIT){
        return Constants.MAX_DURATION
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
    const sec = Math.floor((totalTimeInMS / Constants.MS_PER_SEC) % Constants.TIME_DIVISOR)
    const min = Math.floor((totalTimeInMS / (Constants.MS_PER_MIN)) % Constants.TIME_DIVISOR)
    const hrs = Math.floor((totalTimeInMS / (Constants.MS_PER_HR)))

    return `${hrs.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`
}

export function addTotalTime(tasks: Data[]){
    const totalTimeInMS = tasks.reduce((acc, cur) => {
       const [hours, minutes, seconds] = (parseISODuration(cur.timeInterval.duration)).split(':').map(Number)
       acc += (hours * Constants.TIME_DIVISOR * Constants.TIME_DIVISOR + minutes * Constants.TIME_DIVISOR + seconds) * Constants.MS_PER_SEC
       return acc
    }, 0)

    return convertMilliSecsToHrsMinsSec(totalTimeInMS)
}