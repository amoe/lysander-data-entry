import React, {MouseEvent, useState} from 'react';
import plusIcon from './plus.svg';

enum ViewMode {
    VIEW = 'view',
    MOVE = 'move'
};


// This could just be a fixed width div with a border
function MovePlace() {
    return (
        <div>
          <p>Move placeholder</p>
        </div>
    );
}

function GroupingIcon() {
    return (
        <img src={plusIcon} className="grouping-icon" alt=""/>  
    )
}


interface SingleEvent {
    id: string;
    date: string;
    description: string;
}

type EventGroup = SingleEvent[];

type SequenceMember = SingleEvent | EventGroup;

type EventSequence = SequenceMember[]


function isEventGroup(x: any): x is EventGroup {
    return Array.isArray(x);
}

function SequenceMember(props: {value: SequenceMember, viewMode: ViewMode}) {
    if (isEventGroup(props.value)) {
        return <h2>A group</h2>;
    } else {
        return (
            <div>
              {props.viewMode === ViewMode.MOVE && "YES"}
              
              <div key={props.value.id} className="event-summary">
                <div className="event-description">
                  {props.value.description}
                </div>
                <div className="event-date">{props.value.date}</div>
                <button onClick={(e) => doMove(e, props.value.id)}>Move</button>
              </div>
            </div>
        );
    }
}


export function EventGrouping() {
    const [viewMode, setViewMode] = useState(ViewMode.VIEW);

    const events: EventSequence = [
        {id: 'e1', description: 'Bartholomew I of Constantinople issues a formal decree granting independence to the Orthodox Church of Ukraine from the Russian Orthodox Church.', date: '2019-01-05'},
        {id: 'e2', description: 'Venezuelan presidential crisis: President Maduro severs diplomatic ties with Colombia as humanitarian aid attempts to enter the country across the border.', date: '2019-02-23'},
        {id: 'e3', description: "Europe's antitrust regulators fine Google 1.49 billion euros ($1.7 billion) for freezing out rivals in the online advertising business. The ruling brings to nearly $10 billion the fines imposed against Google by the European Union.", date: '2019-03-20'},
        {id: 'e4', description: 'A series of bomb attacks occur at eight locations in Sri Lanka, including three churches, four hotels and one housing complex in Colombo, on Easter Sunday, leaving 259 people dead and over 500 injured. It is the first major terrorist attack in the country since the Sri Lankan Civil War ended in 2009.', date: '2019-04-21'}
    ];

    const doMove = (e: MouseEvent<HTMLButtonElement>, eventId: string) => {
        setViewMode(ViewMode.MOVE);
    };

    // Note that it's clear that if we use index as the key, reordering is not
    // going to work.


    return (
        <div>
          <h1>Event grouping</h1>
          
          <p>View mode: {viewMode}</p>

          <div className="event-sequence">
            {events.map((event, i) => <SequenceMember value={event} viewMode={viewMode} />)}

            <GroupingIcon />
            <div>Current state: Linked</div>
            <button>Unlink</button>

                     </div>
          </div>

        
    );
}
