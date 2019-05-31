import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    TextInput,
    FlatList,
    SafeAreaView,
    TouchableHighlight
} from 'react-native';
import EventEmitter from '../utils/event_emitter';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scroll: {
        width: '100%'
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    todo: {
        width: '80%',
        borderBottomWidth: 1,
        borderBottomColor: '#AAA'
    },
    todoText: {
        fontSize: 18,
        padding: 15
    },
    completedTodoText: {
        textDecorationLine: 'line-through'
    },
    addButton: {
        backgroundColor: 'blue',
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center'
    },
    buttonDisabled: {
        opacity: 0.4
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    input: {
        width: '80%',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#AAA'
    },
    switchButton: {
        backgroundColor: 'red',
        paddingVertical: 15,
        width: '100%',
        alignItems: 'center'
    }
});

export default class ToDoList extends Component {
    static propTypes = {
        todos: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })).isRequired,
        createTodo: PropTypes.func.isRequired,
        toggleTodo: PropTypes.func.isRequired,
        sample: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {text: ''};
        this.listRef = React.createRef();
    }

    updateText = (text) => {
        this.setState({text});
    };

    addTodo = () => {
        const { createTodo } = this.props;
        const { text } = this.state;
        this.setState({text: ''});
        createTodo(text);
        if (this.listRef && this.listRef.current) {
            this.listRef.current.scrollToEnd({animated: true});
        }
    };

    toggleTodo(todo) {
        const { sample } = this.props;
        sample(todo.id);
    }

    switchDb = () => {
        const { text } = this.state;
        this.setState({text: ''});
        EventEmitter.emit('switch_store', `${text.toLowerCase()}.realm`);
    };

    renderTodo = ({item: todo, index}) => {
        return (
            <TouchableHighlight key={todo.id} style={styles.todo} onPress={() => this.toggleTodo(todo)}>
                <Text style={[styles.todoText, todo.completed && styles.completedTodoText]}>
                    {`${index + 1} ${todo.name}`}
                </Text>
            </TouchableHighlight>
        );
    };

    keyExtractor = (item, index) => {
        // All keys are strings (either post IDs or special keys)
        return `${item}-${index}`;
    };

    render() {
        const { todos = [] } = this.props;
        const { text } = this.state;
        const buttonDisabled = !text;
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    ref={this.listRef}
                    data={todos}
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContainer}
                    renderItem={this.renderTodo}
                    keyExtractor={this.keyExtractor}
                />
                <TextInput
                    placeholder='Add your todo'
                    style={styles.input}
                    value={text}
                    onChangeText={this.updateText}
                />
                <TouchableHighlight
                    style={[styles.addButton, buttonDisabled && styles.buttonDisabled]}
                    onPress={this.addTodo}
                    disabled={buttonDisabled}
                >
                    <Text style={styles.addButtonText}>
                        {'Add Todo'}
                    </Text>
                </TouchableHighlight>
                <TouchableHighlight
                    style={[styles.switchButton, buttonDisabled && styles.buttonDisabled]}
                    onPress={this.switchDb}
                    disabled={buttonDisabled}
                >
                    <Text style={styles.addButtonText}>
                        {'Switch'}
                    </Text>
                </TouchableHighlight>
            </SafeAreaView>
        );
    }
}
