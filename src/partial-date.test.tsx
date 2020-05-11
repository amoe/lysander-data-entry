import {PartialDate, comparePartialDates} from './partial-date';

it('constructs a year', () => {
    const d = new PartialDate(1940);
    expect(d.year).toEqual(1940);
});

it('constructs a year-and-month', () => {
    const d = new PartialDate(1940, 6);
    expect(d.year).toEqual(1940);
    expect(d.month).toEqual(6);
    expect(d.day).toBeUndefined();
});

it('constructs a year-and-month-and-day', () => {
    const d = new PartialDate(1940, 6, 9);
    expect(d.year).toEqual(1940);
    expect(d.month).toEqual(6);
    expect(d.day).toEqual(9);
});

it('allows ordering partial dates', () => {
    const d1 = new PartialDate(1940);
    const d2 = new PartialDate(1940, 6);
    const d3 = new PartialDate(1940, 6, 9);

    const allDates = [d3, d2, d1];
    
    allDates.sort(comparePartialDates);

    // Unknown points should be filled with zeros, and compared
    // based on the start-point of their respective date-ranges.
    expect(allDates).toEqual([d1, d2, d3]);
});


