import { convertToHoursAndMinutes, calculateTimeDifference, convertDurationToHrsMinsSecs, calculateEndTime, isDurationLimitExceeded } from "./hoursAndMinutes"
import { formatTime } from "./dateFunctions"
import { checkString } from "./checkString"
import { Constants } from "../types/types"

export function onStartTimeBlur(timeStart: string, timeEnd: Date){
    const { isValid, hours, minutes } = convertToHoursAndMinutes(timeStart)

    let newStart = new Date(timeEnd)
    newStart.setHours(hours, minutes)

    if(!isValid || isDurationLimitExceeded(newStart, timeEnd)){
        return { isValid: false, start: new Date(), end: timeEnd, duration: '' }
    }
    
    if(hours > timeEnd.getHours() || minutes > timeEnd.getMinutes()){
        timeEnd.setDate(timeEnd.getDate() + 1)
    }

    const { hrs, mins } = calculateTimeDifference(new Date(newStart), timeEnd)

    if(hrs > Constants.MAX_TIME_LIMIT){
        return { isValid: false, start: new Date(), end: timeEnd, duration: '' }
    }
    return { isValid: true, start: newStart, end: timeEnd, duration: formatTime(hrs, mins, 0)}
}


export function onEndTimeBlur(timeStart: Date, timeEnd: string){
    const { isValid, hours, minutes } = convertToHoursAndMinutes(timeEnd)
    
    const newEnd = new Date(timeStart)
    newEnd.setHours(hours, minutes)
    
    if(!isValid || isDurationLimitExceeded(timeStart, newEnd)){
        return { isValid: false, end: new Date(), duration: '' }
    }
    
    if(timeStart.getHours() > hours || timeStart.getMinutes() > minutes){
        newEnd.setDate(newEnd.getDate() + 1)
    }
    const { hrs, mins } = calculateTimeDifference(timeStart, newEnd)

    if(hrs > Constants.MAX_TIME_LIMIT){
        return { isValid: false, end: new Date(), duration: '' }
    }
    return { isValid: true, end: newEnd, duration: formatTime(hrs, mins, 0) }
}


export function onDurationBlur(duration: string, startTime: Date, colonCount: number){
    const { isValid, numberOfColons } = checkString(duration)

    if( !isValid || (numberOfColons > colonCount)){
        return { isValid: false, duration, end: new Date() }
    }

    const timeDuration = convertDurationToHrsMinsSecs(duration)
    const newEndTime = calculateEndTime(startTime, timeDuration)

    return { isValid: true, duration: timeDuration, end: newEndTime }
}