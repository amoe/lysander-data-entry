import {compareAsc, endOfMonth, endOfYear, endOfDay} from 'date-fns';

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
        this.components = components;
    }

    toString(): string {
        return "";
    }
    
    toLatestDate(): string {
        return Date(0);
    }

}

export {PartialDate};
