import React from 'react';
import plusIcon from './plus.svg';

function GroupingIcon() {
    return (
        <img src={plusIcon} className="grouping-icon" alt=""/>  
    )
}

export function EventGrouping() {
    const events = [
        {description: 'Bartholomew I of Constantinople issues a formal decree granting independence to the Orthodox Church of Ukraine from the Russian Orthodox Church.', date: '2019-01-05'},
        {description: 'Venezuelan presidential crisis: President Maduro severs diplomatic ties with Colombia as humanitarian aid attempts to enter the country across the border.', date: '2019-02-23'},
        {description: "Europe's antitrust regulators fine Google 1.49 billion euros ($1.7 billion) for freezing out rivals in the online advertising business. The ruling brings to nearly $10 billion the fines imposed against Google by the European Union.", date: '2019-03-20'},
        {description: 'A series of bomb attacks occur at eight locations in Sri Lanka, including three churches, four hotels and one housing complex in Colombo, on Easter Sunday, leaving 259 people dead and over 500 injured. It is the first major terrorist attack in the country since the Sri Lankan Civil War ended in 2009.', date: '2019-04-21'}
    ];


    return (
        <div>
          <h1>Event grouping</h1>
          <div className="event-sequence">

            {events.map((e, i) => {
                return (
            <div key={i} className="event-summary">
              <div className="event-description">
                {e.description}
              </div>
              <div className="event-date">{e.date}</div>
            </div>
                );
            })}

            <GroupingIcon />
            <div>Current state: Linked</div>
            <button>Unlink</button>
          </div>
        </div>
    );
}
