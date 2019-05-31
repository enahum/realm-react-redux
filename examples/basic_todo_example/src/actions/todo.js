export const CREATE_TODO = 'CREATE_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const BATCH_CREATE = 'BATCH_CREATE';

export function createTodo(name) {
    return {
        type: CREATE_TODO,
        name
    };
}

export function toggleTodo(id) {
    return {
        type: TOGGLE_TODO,
        id
    };
}

export function createBatch(todos) {
    return {
        type: BATCH_CREATE,
        todos
    };
}

export function sample(id) {
    return (dispatch, getState) => {
        const state = getState();
        let result;

        if (state.todos) {
            result = state.todos.filter((t) => t.id === id);
        } else {
            result = getState().objects('ToDo').filtered(`id = "${id}"`);
        }

        if (result.length === 1) {
            console.warn('got a few', result[0].completed);
            dispatch(toggleTodo(id));
        }
    };
}
