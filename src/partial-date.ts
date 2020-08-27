import {
    compareAsc,
    startOfYear, endOfYear,
    startOfMonth, endOfMonth,
    startOfDay, endOfDay,
    startOfHour, endOfHour,
    startOfMinute, endOfMinute,
    startOfSecond, endOfSecond,
} from 'date-fns';


interface DateComponentInfo {
    [key: string]: {startFn: Function, endFn: Function}
}



const DATE_COMPONENT_INFO: DateComponentInfo = {
    year: {startFn: startOfYear, endFn: endOfYear},
    monthIndex: {startFn: startOfMonth, endFn: endOfMonth},
    day: {startFn: startOfDay, endFn: endOfDay},
    hours: {startFn: startOfHour, endFn: endOfHour},
    minutes: {startFn: startOfMinute, endFn: endOfMinute},
    seconds: {startFn: startOfSecond, endFn: endOfSecond},
}

const DATE_CONSTRUCTOR_COMPONENT_ORDERING = [
    'year', 'monthIndex', 'day', 'hours', 'minutes', 'seconds'
];

interface DateConstructorArguments {
    year?: number;
    monthIndex?: number;    // 0-BASED
    day?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}

// This API expects 1-based dates, not the 'monthIndex' zero-based value
// specified by the JavaScript Date constructor.
class PartialDate {
    components: DateConstructorArguments;

    constructor(components: DateConstructorArguments) {
        const seenUndefined = false;
        
        for (let x of DATE_CONSTRUCTOR_COMPONENT_ORDERING) {
            const value = components[x];
            if (seenUndefined && value === undefined) {
                throw new Error("invalid date value, cannot determine resolution");
            }
            
            if (value === undefined) {
                seenUndefined = true;
            }
            
        }
        
        
        // TODO check that no pattern like [12, undefined, 13] happens
        this.components = components;
    }

    toString(): string {
        return "";
    }
    
    toLatestDate(): Date {
        const dateConstructorArguments: number[] = [];
        
        for (let x of DATE_CONSTRUCTOR_COMPONENT_ORDERING) {
            dateConstructorArguments.push(
        }
        
        return new Date(...dateConstructorArguments);
    }
}

export {PartialDate};
