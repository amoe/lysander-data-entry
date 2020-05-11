import React from 'react';

export function EventSequenceView() {
    const  myValues = [
        'foo', 'bar', 'baz'
    ];

    return (
        <div>
          <h1>Hello React</h1>

          <ul>
            {myValues.map(x => <li>{x}</li>)}
          </ul>
        </div>
    );
}

