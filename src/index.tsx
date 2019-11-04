import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Redux crap
import { Provider } from 'react-redux';
import {
    createStore, applyMiddleware, combineReducers
} from 'redux';
import { MyState, IncrementAction, INCREMENT, FullStateTree } from './stuff';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Link, Switch, HashRouter, Route } from 'react-router-dom';


// KeplerGL crap
import { keplerGlReducer } from 'kepler.gl/reducers';
import { enhanceReduxMiddleware } from 'kepler.gl/middleware';


// Custom state to disable the add data modal dialog.
// See pattern from <https://github.com/keplergl/kepler.gl/blob/master/docs/api-reference/advanced-usages/custom-initial-state.md>
const customKeplerReducer = keplerGlReducer.initialState({
    uiState: {
        currentModal: null
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
        applyMiddleware(...enhanceReduxMiddleware([]))
    )
);


function Home() {
    return (
        <h1>HOME!</h1>
    );
}

function About() {
    return (
        <h1>About Ting</h1>
    );
}

function FooRouter() {
    return (
        <HashRouter>
            <div>
                <ul>
                    <li> <Link to="/">Home</Link> </li>
                    <li> <Link to="/about">About</Link> </li>
                    <li> <Link to="/kepler">Kepler</Link> </li>
                </ul>
                <hr />
                <Switch>
                    <Route exact path="/"> <Home /> </Route>
                    <Route path="/about"> <About /> </Route>
                    <Route path="/kepler"> <App /> </Route>
                </Switch>
            </div>
        </HashRouter>
    );
}

/*
<Provider store={store}>
  <App />
</Provider>,
*/

ReactDOM.render(
    <Provider store={store}>
        <FooRouter />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
