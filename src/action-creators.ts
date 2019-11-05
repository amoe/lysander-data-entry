import { IncrementAction, INCREMENT } from './interfaces';

function increment(): IncrementAction {
    return {
        type: INCREMENT
    };
}

export default { increment };
