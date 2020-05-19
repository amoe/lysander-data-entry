import React from 'react';
import { EventSequence, FlightEvent, SequenceMember, EventGroup } from './event-sequence';
import { ViewMode, MoveHandler } from './interfaces2';

function FlightEventView() {
    return <div><h2>Simple flightevent</h2></div>;
}

function EventGroupView() {
    return <div><h2>An event group</h2></div>;
}

export function SequenceMemberView(
    props: {value: SequenceMember, viewMode: ViewMode, onMove: MoveHandler}
) {
    const val = props.value;

    if (val instanceof FlightEvent) {
        return <FlightEventView />
    } else if (val instanceof EventGroup) {
        return <EventGroupView />
    } else {
        throw new Error("unexpected sequence member type");
    }
}
