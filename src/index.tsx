import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import {EventSequenceView} from './event-sequence-view';
import * as serviceWorker from './serviceWorker';
import {RbdSample} from './rbd-sample';
import {DndDemo} from './dnd-demo';
import {GroupedDndDemo} from './grouped-dnd-demo';
import {PartialDate} from './partial-date';
import {GeneratedDates} from './generated-dates'
import {DateAuthoringDemo} from './date-authoring-demo';
import {SwitchDemo} from './switch-demo';
import {LocationAuthoringDemo} from './location-authoring-demo';
import {EventGrouping} from './event-grouping';
import {ReducerDemo} from './reducer-demo';

ReactDOM.render(
    (<div>
      <ReducerDemo/>
    </div>),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
