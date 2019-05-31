import uuid from 'uuid/v4';
import { CREATE_TODO, TOGGLE_TODO, BATCH_CREATE } from '../actions/todo';

export default function todos(state = [], action) {
    switch (action.type) {
        case CREATE_TODO:
            const { name } = action;
            return [...state, {
                id: uuid(),
                name,
                completed: false,
                createdAt: Date.now()
            }];

        case TOGGLE_TODO:
            const { id } = action;
            return state.map((todo) => {
                if (todo.id === id) {
                    return {
                        ...todo,
                        completed: !todo.completed
                    };
                }

                return todo;
            });
        case BATCH_CREATE:
            return action.todos.map((t) => ({
                id: uuid(),
                name: t,
                completed: false,
                createdAt: Date.now()
            }));
    }

    return state;
}
