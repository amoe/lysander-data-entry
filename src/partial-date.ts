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

export {PartialDate};
