import { combineReducers } from 'redux';

import todos from './todo';

function hydrated(state = false, action) {
    if (action.type === 'REHYDRATE') {
        return true;
    }

    return state;
}

export default combineReducers({todos, hydrated});
