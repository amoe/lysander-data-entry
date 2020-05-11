import React from 'react';
import ReactDOM from 'react-dom';
import {SanityCheck} from './sanity-check';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<SanityCheck />, div);
    ReactDOM.unmountComponentAtNode(div);
});
