import React, {MouseEvent, useState} from 'react';
import plusIcon from './plus.svg';
import { PartialDate } from './partial-date';
import { EventSequence, FlightEvent, SequenceMember, EventGroup } from './event-sequence';

enum ViewMode {
    VIEW = 'view',
    MOVE = 'move'
};

// This could just be a fixed width div with a border
function MovePlace() {
    return (
        <div className="drop-location"></div>
    );
}

function GroupingIcon() {
    return (
        <img src={plusIcon} className="grouping-icon" alt=""/>  
    )
}

type MoveHandler = (eventId: string) => void;

function SequenceMemberView(
    props: {value: SequenceMember, viewMode: ViewMode, onMove: MoveHandler}
) {
    return <div><h2>Sequence member</h2></div>;
}


export function EventGrouping() {
    const [viewMode, setViewMode] = useState(ViewMode.VIEW);

    const events = new EventSequence();

    const e1 = new FlightEvent('Bartholomew I of Constantinople issues a formal decree granting independence to the Orthodox Church of Ukraine from the Russian Orthodox Church.', new PartialDate(2019, 1, 5));

    const e2 = new FlightEvent('Venezuelan presidential crisis: President Maduro severs diplomatic ties with Colombia as humanitarian aid attempts to enter the country across the border.', new PartialDate(2019, 2, 23));

    const e3 = new FlightEvent("Europe's antitrust regulators fine Google 1.49 billion euros ($1.7 billion) for freezing out rivals in the online advertising business. The ruling brings to nearly $10 billion the fines imposed against Google by the European Union.", new PartialDate(2019, 3, 20));

    const e4 = new FlightEvent('A series of bomb attacks occur at eight locations in Sri Lanka, including three churches, four hotels and one housing complex in Colombo, on Easter Sunday, leaving 259 people dead and over 500 injured. It is the first major terrorist attack in the country since the Sri Lankan Civil War ended in 2009.', new PartialDate(2019, 4, 21));

    events.addEvent(e1);
    events.addEvent(e2);
    events.addEvent(e3);
    events.addEvent(e4);

    const doMove = (eventId: string) => {
        setViewMode(ViewMode.MOVE);
    };

    // Note that it's clear that if we use index as the key, reordering is not
    // going to work.
    return (
        <div>
          <h1>Event grouping</h1>

          <MovePlace />
          
          <p>View mode: {viewMode}</p>

          <div className="event-sequence">
            {events.map((event) => <SequenceMemberView value={event}
                                                       viewMode={viewMode}
                                                       onMove={doMove} />)}

            <GroupingIcon />
            <div>Current state: Linked</div>
            <button>Unlink</button>

                     </div>
          </div>

        
    );
}
