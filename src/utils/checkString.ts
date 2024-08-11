import { CheckString } from "../types/types"

export function checkString(str: string): CheckString{
    const isValid = /^\d*(:\d*){0,2}$/.test(str)
    const colon = str.match(/:/g)?.length ?? 0

    return { isValid, colon }
}