import {convertUserFacingToMinuteOffset, convertMinuteOffsetToUserFacing} from './time-offset';

it('works for the base date', () => {
    const input = {
        dayOrdinal: 1,
        hour: 1,
        minute: 0
    };

    // 1940-01-15
    const baseDate = new Date(1940, 0, 15);
    
    const result = convertUserFacingToMinuteOffset(baseDate, input);
    expect(result).toEqual(60);
});



it('allows conversions back', () => {
    const expected = {
        dayOrdinal: 1,
        hour: 1,
        minute: 0
    };

    // 1940-01-15
    const baseDate = new Date(1940, 0, 15);
    
    const result = convertMinuteOffsetToUserFacing(baseDate, 60);
    expect(result).toEqual(expected);
});

