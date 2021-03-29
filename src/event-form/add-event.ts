import {EventInputDetails} from './interfaces';
import {convertUserFacingToMinuteOffset} from '../core/time-offset';

export function variablesFromEventDetails(
    eventDetails: EventInputDetails,
    nightOf: Date,
    eventSequenceId: string
): any {
    const timeOffset = eventDetails.timeOffset;
    var offset;
    if (timeOffset === undefined) {
        offset = null;
    } else {
        offset = convertUserFacingToMinuteOffset(
            nightOf, timeOffset
        );
    }
    
    
    const payload = {
        description: eventDetails.description,
        reference: eventDetails.reference,
        quotation: eventDetails.quotation,
        notes: eventDetails.notes,
        offset,
        locationId: eventDetails.locationId,
        relativeDistance: eventDetails.relativeDistance,
        relativeCardinal: eventDetails.relativeCardinal,
        relativeHeight: eventDetails.relativeHeight
    };

    const variables = {
        esId: eventSequenceId,
        event: payload
    };

    console.log("variables = %o", variables);
    
    return variables;
}
