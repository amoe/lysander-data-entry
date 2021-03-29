import {addDays, setHours, setMinutes, differenceInMinutes, addMinutes, differenceInDays} from 'date-fns';

export interface UserFacingTimeOffset {
    dayOrdinal: number;    // 1-based
    hour: number;
    minute: number;
}

// Pretty simple algorithm -- take the base date, add N days, replace the hh:mm
// with the values from the argument, now calculate minute difference from the base date.

export function convertUserFacingToMinuteOffset(
    baseDate: Date, time: UserFacingTimeOffset
): number {
    const d1 = addDays(baseDate, time.dayOrdinal - 1);
    const d2 = setHours(d1, time.hour);
    const d3 = setMinutes(d2, time.minute);
    return differenceInMinutes(d3, baseDate);
}

export function convertMinuteOffsetToUserFacing(
    baseDate: Date, offset: number
): UserFacingTimeOffset {
    const d1 = addMinutes(baseDate, offset);
    
    return {
        dayOrdinal: differenceInDays(d1, baseDate) + 1,
        hour: d1.getHours(),
        minute: d1.getMinutes()
    };
}
