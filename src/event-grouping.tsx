import React from 'react';
import plusIcon from './plus.svg';

function GroupingIcon() {
    return (
        <img src={plusIcon} className="grouping-icon" alt=""/>  
    )
}

export function EventGrouping() {
    const events = [
        {date: 'Bartholomew I of Constantinople issues a formal decree granting independence to the Orthodox Church of Ukraine from the Russian Orthodox Church.', description: '2019-01-05'}
        {date: '', description: ''}
        {date: '', description: ''}
        {date: '', description: ''}
    ];

    return (
        <div>
          <h1>Event grouping</h1>
          <div className="event-sequence">

            <div className="event-summary">
              <div className="event-description">
                
              </div>
              <div className="event-date"></div>
            </div>

            <GroupingIcon />
            <div>Current state: Linked</div>
            <button>Unlink</button>

            <div className="event-summary">
              <div className="event-description">
                Venezuelan presidential crisis: President Maduro severs diplomatic ties with
                Colombia as humanitarian aid attempts to enter the country across the
                border.
              </div>

              <div className="event-date">
                2019-02-23
              </div>
            </div>

            <GroupingIcon />
            <div>Current state: Not Linked</div>
            <button>Link</button>

            <div className="event-summary">
              <div className="event-description">
                Europe's antitrust regulators fine Google 1.49 billion euros ($1.7 billion) for
                freezing out rivals in the online advertising business. The ruling brings to
                nearly $10 billion the fines imposed against Google by the European Union.
              </div>

              <div className="event-date">
                2019-03-20
              </div>
            </div>


            <GroupingIcon />
            <div>Current state: Not Linked</div>
            <button>Link</button>

            <div className="event-summary">
              <div className="event-description">
                A series of bomb attacks occur at eight locations in Sri Lanka, including three
                churches, four hotels and one housing complex in Colombo, on Easter Sunday,
                leaving 259 people dead and over 500 injured. It is the first major terrorist
                attack in the country since the Sri Lankan Civil War ended in 2009.
              </div>

              <div className="event-date">
                2019-04-21
              </div>
            </div>

          </div>
        </div>
    );
}
