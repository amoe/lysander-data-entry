import React, {useReducer} from 'react';

interface AppState {
    count: number;
}

enum Action {
    INCREMENT = 'increment',
    DECREMENT = 'decrement'
};

function reducer(state: AppState, action: Action): AppState {
    switch (action) {
        case Action.INCREMENT:
            return {...state, count: state.count + 1}
        default:
            throw new Error("no");
    }
}

export function ReducerDemo() {
    const [state, dispatch] = useReducer(reducer, {count: 0});

    return (
        <div>
          <h1>Reducer demo</h1>

          <p>Count: {state.count}</p>

          <button onClick={(e) => dispatch(Action.INCREMENT)}>Increment</button>
        </div>
    );
}

