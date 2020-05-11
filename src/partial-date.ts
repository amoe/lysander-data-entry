//    If compareFunction(a, b) returns less than 0, sort a to an index lower than b (i.e. a comes first).
//    If compareFunction(a, b) returns 0, leave a and b unchanged with respect to each other, but sorted with respect to all different elements. Note: the ECMAscript standard does not guarantee this behavior, thus, not all browsers (e.g. Mozilla versions dating back to at least 2003) respect this.
//    If compareFunction(a, b) returns greater than 0, sort b to an index lower than a (i.e. b comes first).
//    compareFunction(a, b) must always return the same value when given a specific pair of elements a and b as its two arguments. If inconsistent results are returned, then the sort order is undefined.


class PartialDate {
    year: number;
    month: number | undefined;
    day: number | undefined;

    constructor(year: number, month?: number, day?: number) {
        this.year = year;
        this.month = month;
        this.day = day;
    }
}


function comparePartialDates(a: PartialDate, b: PartialDate) {
    
}


export {PartialDate, comparePartialDates};
