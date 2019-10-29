import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { MyState, IncrementAction, INCREMENT } from './stuff';


// This could be a sum type
type MyActionTypes = IncrementAction;

// Don't modify the state

// The type of the state should be T | undefined.
// In the case of the tutorial, they use a too-clever-by-half thing to infer
// the type correctly.
function myReducer(state: MyState | undefined, action: MyActionTypes): MyState {
    console.log("Reducer being called.");
    if (state === undefined) {
        return { counter: 0 };
    }

    switch (action.type) {
        case INCREMENT:
            return Object.assign({}, state, { counter: state.counter + 1 });
        default:
            return state;
    }
}




// the root reducer must be treated specially...
const store = createStore(myReducer);


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
