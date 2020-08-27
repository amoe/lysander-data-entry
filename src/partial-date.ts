import {
    compareAsc,
    startOfYear, endOfYear,
    startOfMonth, endOfMonth,
    startOfDay, endOfDay,
    startOfHour, endOfHour,
    startOfMinute, endOfMinute,
    startOfSecond, endOfSecond,
} from 'date-fns';

const MINIMUM_MONTH_INDEX = 0;

type DateConstructorTuple = [number, number, number, number, number, number, number];

type DateConstructorField =
    'year' | 'monthIndex' | 'day' | 'hours' | 'minutes' | 'seconds';


type DateComponentInfo = {
    [key in DateConstructorField]: {startFn: Function, endFn: Function}
}


const DATE_COMPONENT_INFO: DateComponentInfo = {
    year: {startFn: startOfYear, endFn: endOfYear},
    monthIndex: {startFn: startOfMonth, endFn: endOfMonth},
    day: {startFn: startOfDay, endFn: endOfDay},
    hours: {startFn: startOfHour, endFn: endOfHour},
    minutes: {startFn: startOfMinute, endFn: endOfMinute},
    seconds: {startFn: startOfSecond, endFn: endOfSecond},
}

const DATE_CONSTRUCTOR_COMPONENT_ORDERING: readonly DateConstructorField[] = [
    'year', 'monthIndex', 'day', 'hours', 'minutes', 'seconds'
] as const;

interface DateConstructorArguments {
    year: number;
    monthIndex?: number;    // 0-BASED
    day?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}

// This API expects 1-based dates, not the 'monthIndex' zero-based value
// specified by the JavaScript Date constructor.
// This API doesn't care about the case where there is no defined time at all.
class PartialDate {
    components: DateConstructorArguments;
    highestResolutionComponent: DateConstructorField;

    constructor(components: DateConstructorArguments) {
        var seenUndefined = false;
        var highestResSoFar: DateConstructorField | undefined = undefined;
        

        for (let x of DATE_CONSTRUCTOR_COMPONENT_ORDERING) {
            const value = components[x];
            if (seenUndefined && value !== undefined) {
                throw new Error("invalid date value, cannot determine resolution");
            }
            
            if (value === undefined) {
                seenUndefined = true;
            } else {
                highestResSoFar = x;
            }
        }

        if (highestResSoFar === undefined) {
            throw new Error("no defined values");
        }
        
        
        // TODO check that no pattern like [12, undefined, 13] happens
        this.components = components;
        this.highestResolutionComponent = highestResSoFar;
    }

    toString(): string {
        return "";
    }

    toLatestDate(): Date {
        const {endFn} = DATE_COMPONENT_INFO[this.highestResolutionComponent];
        return endFn(this.toMostAccurateDate());
    }

    toEarliestDate(): Date {
        const {startFn} = DATE_COMPONENT_INFO[this.highestResolutionComponent];
        return startFn(this.toMostAccurateDate());
    }

    toMostAccurateDate(): Date {
        const dateConstructorArguments: number[] = [];

        
        for (let x of DATE_CONSTRUCTOR_COMPONENT_ORDERING) {
            // We previously verified that nothing here is actually undefined.
            // In reality we know that this will be at 
            const value = this.components[x] as number;
            dateConstructorArguments.push(value);
                
            if (x === this.highestResolutionComponent) {
                break;
            }
        }


        // XXX: THE FIRST TWO ARGUMENTS TO THE DATE CONSTRUCTOR ARE NON
        // NULLABLE!  Including monthIndex, which is used to distinguish this
        // constructor from the one that works based on an epoch time.

        // That means we always need to provide them.  The maximum level of date
        // uncertainty that we handle here is a simple year.  A month may also
        // be undefined from PartialDate's perspective, so we need a special
        // case to initialize it to the lowest possible month.

        const definedLength = dateConstructorArguments.length;
        if (definedLength === 0) {
            throw new Error("can't happen");
        }

        if (definedLength === 1) {
            dateConstructorArguments.push(MINIMUM_MONTH_INDEX);
        }

        // Override type safety for this case
        return new Date(...(dateConstructorArguments as DateConstructorTuple));
    }
}


function comparePartialDates(a: PartialDate, b: PartialDate): number {
    return compareAsc(a.toEarliestDate(), b.toEarliestDate());
}


export {PartialDate, comparePartialDates};
