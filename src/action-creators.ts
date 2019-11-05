import { IncrementAction, INCREMENT, MyThunkDispatch } from './interfaces';
import singletons from './singletons';

function increment(): IncrementAction {
    return {
        type: INCREMENT
    };
}

function demoQuery() {
    return (dispatch: MyThunkDispatch) => {
        singletons.gateway.basicDemo().then(r => {
            console.log(r.records[0].get('x'));
            dispatch(increment());
        });
    };
}

export default { increment, demoQuery };
