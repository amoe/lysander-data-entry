import {
    PartialDate,
    comparePartialDates
} from './partial-date';

it('constructs a year', () => {
    const d = new PartialDate({year: 1940});
    // expect(d.year).toEqual(1940);
});

it('constructs a year-and-month', () => {
    const d = new PartialDate({year: 1940, monthIndex: 5});
    // expect(d.year).toEqual(1940);
    // expect(d.month).toEqual(6);
    // expect(d.day).toBeUndefined();
});

it('constructs a year-and-month-and-day', () => {
    const d = new PartialDate({year: 1940, monthIndex: 5, day: 9});
    // expect(d.year).toEqual(1940);
    // expect(d.month).toEqual(6);
    // expect(d.day).toEqual(9);
});

it('constructs a year-and-month-and-day-and-minute', () => {
    const d = new PartialDate({year: 1940, monthIndex: 6, day: 9, minute: 23});
    // expect(d.year).toEqual(1940);
    // expect(d.month).toEqual(6);
    // expect(d.day).toEqual(9);
    // expect(d.minute).toEqual(23);
});

it('allows ordering partial dates', () => {
    const d1 = new PartialDate({year: 1940});
    const d2 = new PartialDate({year: 1940, monthIndex: 5});
    const d3 = new PartialDate({year: 1940, monthIndex: 5, day: 9});
    
    const allDates = [d3, d2, d1];
    
    allDates.sort(comparePartialDates);
    
    // Unknown points should be filled with zeros, and compared
    // based on the start-point of their respective date-ranges.
    expect(allDates).toEqual([d1, d2, d3]);
});



it('derives a latest date properly', () => {
    const d1 = new PartialDate(1939, 11, 20);
    const ld = d1.toLatestDate();
    
    expect(ld.getFullYear()).toBe(1939);
    expect(ld.getMonth()).toBe(10);//   zero offset
    expect(ld.getDate()).toBe(20);
});


