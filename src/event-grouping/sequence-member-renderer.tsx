import React from 'react';
import { EventSequence, FlightEvent, SequenceMember, EventGroup } from '../event-sequence';
import { ViewMode, MoveHandler } from '../interfaces2';

function FlightEventView(props: {value: FlightEvent, onMove: MoveHandler}) {
    return <div>
      <div className="event-summary">
        <div className="event-description">
          {props.value.getDescription()}
        </div>
        <div className="event-date">{props.value.getDateString()}</div>
        <button onClick={(e) => props.onMove(props.value.getId())}>Move</button>
      </div>
    </div>
}

function EventGroupView(props: {value: EventGroup}) {
    return <div>
      {props.value.map(x => <h1>Event</h1>)}
    </div>;
}

export function SequenceMemberView(
    props: {value: SequenceMember, viewMode: ViewMode, onMove: MoveHandler}
) {
    const val = props.value;

    if (val instanceof FlightEvent) {
        return <FlightEventView value={val} onMove={props.onMove}/>
    } else if (val instanceof EventGroup) {
        return <EventGroupView value={val} />
    } else {
        throw new Error("unexpected sequence member type");
    }
}
