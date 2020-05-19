import React from 'react';
import { EventSequence, FlightEvent, SequenceMember, EventGroup } from './event-sequence';
import { ViewMode, MoveHandler } from './interfaces2';

export function SequenceMemberView(
    props: {value: SequenceMember, viewMode: ViewMode, onMove: MoveHandler}
) {
    const val = props.value;

    if (val instanceof FlightEvent) {
        return <div><h2>Simple flightevent</h2></div>;
    } else if (val instanceof EventGroup) {
        return <div><h2>An event group</h2></div>
    } else {
        throw new Error("unexpected sequence member type");
    }
}
