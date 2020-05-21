import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';

import {EventSequenceView} from './event-sequence-view';
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
import {FormsDemo} from './forms-demo';
import {BasicAntdFormDemo} from './basic-antd-form-demo';
import {ThemePanel} from './theme-panel';

import {EventAuthoringApp} from './event-authoring-app';


//<BasicAntdFormDemo />



ReactDOM.render(
    (<div>
      <EventAuthoringApp/>
    </div>),
    document.getElementById('root')
);

serviceWorker.unregister();
