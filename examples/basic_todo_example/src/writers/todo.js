import uuid from 'uuid/v4';
import { CREATE_TODO, TOGGLE_TODO, BATCH_CREATE } from '../actions/todo';

export default function todoWriter(realm, action) {
    switch (action.type) {
        case CREATE_TODO:
            const { name } = action;
            realm.create('ToDo', {
                id: uuid(),
                name,
                // completed: false,
                // createdAt: Date.now(),
            });
            break;

        case TOGGLE_TODO:
            const { id } = action;
            const todos = realm.objects('ToDo').filtered(`id = "${id}"`);
            if (todos.length === 1) {
                const todo = todos[0];
                todo.completed = !todo.completed;
            }
            break;

        case BATCH_CREATE: {
            const {todos} = action;
            for (let i = 0; i < todos.length; i++) {
                const name = todos[i];
                realm.create('ToDo', {
                    id: uuid(),
                    name,
                    // completed: false,
                    // createdAt: Date.now(),
                });
            }
        }
            break;
        default:
            break;
    }
}
