import {compareAsc, endOfMonth, endOfYear, endOfDay} from 'date-fns';

type DateConstructorArguments = 
    [number, number, number, number, number, number, number];

// This API expects 1-based dates, not the 'monthIndex' zero-based value
// specified by the JavaScript Date constructor.
class PartialDate {
    year: number;
    month: number | undefined;
    day: number | undefined;


    constructor(year: number, month?: number, day?: number) {
        this.year = year;

        if (month !== undefined) {
            if (month === 0 || month > 12) {
                throw new Error('invalid value for month: ' + month);
            }
        }

        this.month = month;
        this.day = day;
    }

    toString(): string {
        var result = this.year.toString();
        if (this.month !== undefined) {
            result += " ";
            result += this.month.toString().padStart(2, '0');
        }

        if (this.day !== undefined) {
            result += " ";
            result += this.day.toString().padStart(2, '0');
        }

        return result;
    }

    toEarliestDate(): Date {
        const dateConstructorArguments: DateConstructorArguments = [
            this.getEarliestYear(),
            this.getEarliestMonth(),
            this.getEarliestDay(),
            0,  // HH
            0,  // MM
            0,  // SS
            0   // MS
        ];

        return new Date(...dateConstructorArguments);
    }

    // Just for symmetry
    getEarliestYear(): number {
        return this.year;
    }

    getEarliestMonth(): number {
        return (this.month === undefined ? 1 : this.month) - 1;
    }

    getEarliestDay(): number {
        return this.day === undefined ? 1 : this.day;
    }


    toLatestDate(): Date {
        if (this.month === undefined && this.day === undefined) {
            return endOfYear(new Date(this.year, 1, 1));
        } else if (this.day === undefined) {
            return endOfMonth(new Date(this.year, this.month! + 1, 1));
        } else {
            return endOfDay(new Date(this.year, this.month! + 1, this.day));
        }
    }
}


function comparePartialDates(a: PartialDate, b: PartialDate): number {
    return compareAsc(a.toEarliestDate(), b.toEarliestDate());
}


export {PartialDate, comparePartialDates};
