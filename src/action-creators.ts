import { IncrementAction, INCREMENT, MyThunkDispatch } from './interfaces';

function increment(): IncrementAction {
    return {
        type: INCREMENT
    };
}

function demoQuery() {
    return (dispatch: MyThunkDispatch) => {
        setTimeout(() => dispatch(increment()), 500);
    };
}

export default { increment, demoQuery };
