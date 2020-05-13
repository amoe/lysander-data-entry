import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {EventSequenceView} from './event-sequence-view';
import * as serviceWorker from './serviceWorker';
import {RbdSample} from './rbd-sample';
import {DndDemo} from './dnd-demo';
import {GroupedDndDemo} from './grouped-dnd-demo';
import {PartialDate} from './partial-date';
import {GeneratedDates} from './generated-dates'

ReactDOM.render(
    (<div>
      <GeneratedDates/>
    </div>),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
