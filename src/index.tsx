import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {EventSequenceView} from './event-sequence-view';
import * as serviceWorker from './serviceWorker';
import {RbdSample} from './rbd-sample';
import {DndDemo} from './dnd-demo';
import {GroupedDndDemo} from './grouped-dnd-demo';
import {PartialDate} from './partial-date';

/*
const d1 = new PartialDate(1940);
const d2 = new PartialDate(1940, 6);
const d3 = new PartialDate(1940, 6, 9);

const allDates = [d3, d2, d1];
*/




ReactDOM.render(
    (<div>
      <GroupedDndDemo/>
    </div>),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
