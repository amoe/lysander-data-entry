import {
    PartialDate,
    comparePartialDates
} from './partial-date';

it('constructs a year', () => {
    const d = new PartialDate({year: 1940});
});

it('constructs a year-and-month', () => {
    const d = new PartialDate({year: 1940, monthIndex: 5});
});

it('constructs a year-and-month-and-day', () => {
    const d = new PartialDate({year: 1940, monthIndex: 5, day: 9});
});

it('constructs a year-and-month-and-day-and-minute', () => {
    const d = new PartialDate({year: 1940, monthIndex: 6, day: 9, minute: 23});
});

it('fails when constructing a null date', () => {
    expect(() => new PartialDate({year: 1940, day: 30})).toThrow();
});

it('allows ordering partial dates', () => {
    const d1 = new PartialDate({year: 1940});
    const d2 = new PartialDate({year: 1940, monthIndex: 5});
    const d3 = new PartialDate({year: 1940, monthIndex: 5, day: 9});
    const d4 = new PartialDate({year: 1940, monthIndex: 5, day: 8, hours: 23, minutes: 59, seconds: 59});
    
    const allDates = [d4, d3, d2, d1];
    
    allDates.sort(comparePartialDates);
    
    // Unknown points should be filled with zeros, and compared
    // based on the start-point of their respective date-ranges.
    expect(allDates).toEqual([d1, d2, d4, d3]);
});


// Special case where we only provide a year
it('derives a most accurate date properly', () => {
    const d1 = new PartialDate({year: 1939});
    const ld = d1.toMostAccurateDate();
    
    expect(ld.getFullYear()).toBe(1939);
    expect(ld.getMonth()).toBe(0);
});

it('derives a most accurate date properly for a year', () => {
    const d1 = new PartialDate({year: 1939, monthIndex: 1});
    const ld = d1.toMostAccurateDate();
    
    expect(ld.getFullYear()).toBe(1939);
    expect(ld.getMonth()).toBe(1);
    expect(ld.getDate()).toBe(1);
    expect(ld.getMinutes()).toBe(0);
    expect(ld.getSeconds()).toBe(0);
});

it('derives a most accurate date properly for a year & month combination', () => {
    const d1 = new PartialDate({year: 1939, monthIndex: 1});
    const ld = d1.toMostAccurateDate();
    
    expect(ld.getFullYear()).toBe(1939);
    expect(ld.getMonth()).toBe(1);
    expect(ld.getDate()).toBe(1);
    expect(ld.getMinutes()).toBe(0);
    expect(ld.getSeconds()).toBe(0);
});


it('derives a latest date properly for a year', () => {
    const d1 = new PartialDate({year: 1939});
    const ld = d1.toLatestDate();
    
    expect(ld.getFullYear()).toBe(1939);
    expect(ld.getMonth()).toBe(11);
    expect(ld.getDate()).toBe(31);
    expect(ld.getHours()).toBe(23);
    expect(ld.getMinutes()).toBe(59);
    expect(ld.getSeconds()).toBe(59);
});


it('derives an earliest date properly for a year', () => {
    const d1 = new PartialDate({year: 1939});
    const ld = d1.toEarliestDate();
    
    expect(ld.getFullYear()).toBe(1939);
    expect(ld.getMonth()).toBe(0);
    expect(ld.getDate()).toBe(1);
    expect(ld.getHours()).toBe(0);
    expect(ld.getMinutes()).toBe(0);
    expect(ld.getSeconds()).toBe(0);
});

it('derives an earliest date properly for a fully-specified partialdate', () => {
    const d1 = new PartialDate({year: 1939, monthIndex: 5, day: 15, hours: 12, minutes: 23, seconds: 47});
    const ld = d1.toEarliestDate();
    
    expect(ld.getFullYear()).toBe(1939);
    expect(ld.getMonth()).toBe(5);
    expect(ld.getDate()).toBe(15);
    expect(ld.getHours()).toBe(12);
    expect(ld.getMinutes()).toBe(23);
    expect(ld.getSeconds()).toBe(47);
    expect(ld.getMilliseconds()).toBe(0);
});

it('derives a latest date properly for a fully-specified partialdate', () => {
    const d1 = new PartialDate({year: 1939, monthIndex: 5, day: 15, hours: 12, minutes: 23, seconds: 47});
    const ld = d1.toEarliestDate();
    
    expect(ld.getFullYear()).toBe(1939);
    expect(ld.getMonth()).toBe(5);
    expect(ld.getDate()).toBe(15);
    expect(ld.getHours()).toBe(12);
    expect(ld.getMinutes()).toBe(23);
    expect(ld.getSeconds()).toBe(47);
    expect(ld.getMilliseconds()).toBe(0);
});


it('formats a single year date properly', () => {
    const d1 = new PartialDate({year: 1940});
    const formatted = d1.toString();

    expect(formatted).toBe("1940");
});
