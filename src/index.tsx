import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

// Global CSS
import 'antd/dist/antd.css';

// Redux crap
import { Provider } from 'react-redux';
import {
    createStore, applyMiddleware, combineReducers
} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { IncrementAction, MyState, FullStateTree, INCREMENT } from './interfaces';

// KeplerGL crap
import { keplerGlReducer } from 'kepler.gl/reducers';
import { enhanceReduxMiddleware } from 'kepler.gl/middleware';


import { HashRouter } from 'react-router-dom';
import App from './views/App';

// Enable hot reload
if (module.hot) {
    module.hot.accept();
}

// Custom state to disable the add data modal dialog.
// See pattern from <https://github.com/keplergl/kepler.gl/blob/master/docs/api-reference/advanced-usages/custom-initial-state.md>
const customKeplerReducer = keplerGlReducer.initialState({
    uiState: {
        currentModal: null,
// Will hide the current side pane if true
        //
        readOnly: false
    }
});


// This could be a sum type
type MyActionTypes = IncrementAction;

// Don't modify the state

const INITIAL_STATE: FullStateTree = {
    app: {
        counter: 0
    }
};

function myReducer(state: MyState | undefined, action: MyActionTypes): MyState {
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


const reducers = combineReducers({
    app: myReducer,
    keplerGl: customKeplerReducer
});


// The spread is totally required here, for whatever reason. 
// We don't use any other middlewares.  Kepler's enhanceReduxMiddleware() is
// going to add the react-palm 'taskMiddleware' implicitly.

const store = createStore(
    reducers, INITIAL_STATE,
    composeWithDevTools(
        applyMiddleware(...enhanceReduxMiddleware([thunkMiddleware]))
    )
);



ReactDOM.render(
    <Provider store={store}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
