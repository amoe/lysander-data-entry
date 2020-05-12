import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {EventSequenceView} from './event-sequence-view';
import * as serviceWorker from './serviceWorker';
import {RbdSample} from './rbd-sample';
import {DndDemo} from './dnd-demo';


ReactDOM.render(
    (<div>
      <DndDemo />
    </div>),
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
