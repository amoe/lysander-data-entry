import {compareAsc} from 'date-fns';

//    If compareFunction(a, b) returns less than 0, sort a to an index lower than b (i.e. a comes first).
//    If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. Note: the ECMAscript standard does not guarantee this behavior, thus, not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
//    If compareFunction(a, b) returns greater than 0, sort b to an index lower than a (i.e. b comes first).
//    compareFunction(a, b) must always return the same value when given a specific pair of elements a and b as its two arguments. If inconsistent results are returned, then the sort order is undefined.

type DateConstructorArguments = 
    [number, number, number, number, number, number, number];


class PartialDate {
    year: number;
    month: number | undefined;
    day: number | undefined;

    constructor(year: number, month?: number, day?: number) {
        this.year = year;
        this.month = month;
        this.day = day;
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
        return this.year === undefined ? 1 : this.year;
    }

    getEarliestDay(): number {
        return this.day === undefined ? 1 : this.day;
    }

}


function comparePartialDates(a: PartialDate, b: PartialDate): number {
    return compareAsc(a.toEarliestDate(), b.toEarliestDate());
}


export {PartialDate, comparePartialDates};
