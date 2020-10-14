import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import * as serviceWorker from './serviceWorker';

import {EventForm} from './event-form';

ReactDOM.render(
    (<div>
      <EventForm/>
    </div>),
    document.getElementById('root')
);

serviceWorker.unregister();
