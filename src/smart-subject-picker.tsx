import React from 'react';
import singletons from './singletons';
import {FlightEventDates} from './statements/subject-filter';

export function SmartSubjectPicker() {
    singletons.gateway.search(new FlightEventDates()).then(
        ({records}) => {
            console.log("callback for %o", records.map(x => x.toObject()));
        }
    );


    return (
        <div>
          <h1>My Component</h1>

          
        </div>
    );
}

