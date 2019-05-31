import { bindActionCreators } from 'redux';
import { realmConnect } from 'realm-react-redux';
import { createTodo, toggleTodo, sample } from '../actions/todo';
import ToDoList from '../components/ToDoList';
import memoizeOne from 'memoize-one';

function mapPropsToQueries(realm) {
    const objs = realm.objects('ToDo');
    return [objs];
}

function getTodosArray(todos) {
    return todos.map(t => { return { id: t.id, name: t.name, completed: t.completed }; })
}

const memoizeTodos = memoizeOne(getTodosArray);

function mapQueriesToProps([todos]) {
    return {
        // Normally you would use a selector here to create simplified versions
        // of the model containing only what's needed by the UI for rendering.
        todos: memoizeTodos(todos)
    };
}

function mapRealmDispatchToProps(dispatch) {
    return bindActionCreators({
        createTodo,
        toggleTodo,
        sample,
    }, dispatch);
}

export default realmConnect(mapPropsToQueries, mapQueriesToProps, mapRealmDispatchToProps)(ToDoList);
