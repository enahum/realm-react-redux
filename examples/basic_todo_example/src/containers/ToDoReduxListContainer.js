// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import { createTodo, toggleTodo, sample } from '../actions/todo';
import ToDoList from '../components/ToDoList';

function mapStateToProps(state) {
    return {
        todos: state.todos
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        createTodo,
        toggleTodo,
        sample
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ToDoList);
