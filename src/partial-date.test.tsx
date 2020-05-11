import {PartialDate} from './partial-date';

it('constructs a year', () => {
    const d = new PartialDate(1940);
    expect(d.year).toEqual(1940);
});
