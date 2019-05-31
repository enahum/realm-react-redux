import React, { PureComponent } from 'react';
import {Provider as ReduxProvider} from 'react-redux';
import { RealmProvider } from 'realm-react-redux';
import { configureRealmStore, configureReduxStore } from './configureStore';
import ToDoListContainer from './containers/ToDoListContainer';
import ToDoReduxListContainer from './containers/ToDoReduxListContainer';
import EventEmitter from './utils/event_emitter';

import {createBatch} from './actions/todo';

const RENDER_REALM = true;

export class ToDoApp extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            store: RENDER_REALM ? configureRealmStore() : configureReduxStore(),
            name: 'default.realm'
        };
    }

    componentDidMount() {
        EventEmitter.on('switch_store', this.switchStore);
        if (!RENDER_REALM) {
            this.unsubscribeFromStore = this.state.store.subscribe(this.listenForHydration);
        }
    }

    componentWillUnmount() {
        EventEmitter.off('switch_store', this.switchStore);
    }

    listenForHydration = () => {
        const state = this.state.store.getState();

        if (state.hydrated) {
            this.unsubscribeFromStore();
            this.setState({hydrated: true});
        }
    }

    populate = (total = 500) => {
        const postNames = [
            'TSB boss to step down after IT fiasco (bbc.com)',
            'Show HN: Select Star SQL, an interactive SQL book (selectstarsql.com)',
            'Want to Be More Creative? Take a Walk (2014) (well.blogs.nytimes.com)',
            'Stellarium Web: Online Planetarium (stellarium-web.org)',
            'How LLVM Optimizes a Function (regehr.org)',
            'A military technique for falling asleep in two minutes (independent.co.uk)',
            'A Fighter Pilot’s Guide to Surviving on the Roads (portsmouthctc.org.uk)',
            'Tencent loses $20B in value after China attacks myopia with gaming curbs (channelnewsasia.com)',
            'Amazon Sets Its Sights on the $88B Online Ad Market (nytimes.com)',
            'Notes on “A Philosophy of Software Design” (lethain.com)',
            'Why I never finish my Haskell programs (plover.com)',
            'OpsGenie is joining Atlassian (opsgenie.com)',
            'Scientists pioneer a new way to turn sunlight into fuel (cam.ac.uk)',
            'A Containerized Polyglot Microservices on Kubernetes and Service Mesh (github.com)',
            'Reading with a pencil (austinkleon.com)',
            'Treasures from the Color Archive (newyorker.com)',
            'How to Get Kids to Do Chores: Does the Maya Method Work? (npr.org)',
            'Princess Alice disaster: The Thames 650 forgotten dead (bbc.co.uk)',
            'Space station leak caused by drill, not meteorite (upi.com)',
            'Wasabi: A Framework for Dynamically Analyzing WebAssembly (software-lab.org)'
        ];

        const todos = [];
        for (let i = 0; i < Math.round(total / postNames.length); i++) {
            for (let j = 0; j < postNames.length; j++) {
                todos.push(postNames[j]);
            }
        }
        this.state.store.dispatch(createBatch(todos));
    };

    switchStore = (name, populate = 0) => {
        if (RENDER_REALM) {
            const store = configureRealmStore(name);
            if (populate) {
                this.populate(populate);
            }

            this.setState({store, name});
        }
    };

    render() {
        if (RENDER_REALM) {
            return (
                <RealmProvider
                    key={this.state.name}
                    store={this.state.store}
                >
                    <ToDoListContainer />
                </RealmProvider>
            );
        } else if (this.state.hydrated) {
            return (
                <ReduxProvider store={this.state.store}>
                    <ToDoReduxListContainer />
                </ReduxProvider>
            );
        }

        return null;
    }
}
