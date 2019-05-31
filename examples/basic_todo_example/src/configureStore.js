import { createRealmStore, applyMiddleware } from 'realm-react-redux';
import thunk from 'redux-thunk';
import writer from './writers';
import { ToDo } from './models';
import Realm from 'realm';

import AsyncStorage from '@react-native-community/async-storage';
import {compose, applyMiddleware as applyMiddlewareRedux, createStore} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';
import reducers from './reducers';

const schemas = [
    {schema: [ToDo], schemaVersion: 1},
];

export function configureRealmStore(path = 'default.realm') {
    // Here we handle migrations if there are any
    let nextSchemaIndex = Realm.schemaVersion(path);
    while (nextSchemaIndex > 0 && nextSchemaIndex < schemas.length) {
        const migratedRealm = new Realm(schemas[nextSchemaIndex++]);
        migratedRealm.close();
    }

    // This will create a Realm instance to use in the store, using the options
    // passed in the second argument. To pass an existing Realm instance instead
    // you can use createRealmStore(writer, { realm: yourRealmInstance })

    const current = nextSchemaIndex > 0 ? schemas[nextSchemaIndex - 1] : schemas[schemas.length - 1];

    return createRealmStore(
        writer,
        { path, schema: current.schema, schemaVersion: current.schemaVersion},
        applyMiddleware(thunk)
    );
}

export function configureReduxStore() {
    const store = createStore(
        reducers,
        undefined,
        compose(
            applyMiddlewareRedux(thunk),
            autoRehydrate()
        )
    );

    // begin periodically persisting the store
    persistStore(store, {storage: AsyncStorage, debounce: 500, blacklist: ['hydrated']}, () => {
        store.dispatch({
            type: 'REHYDRATE',
        })
    });

    return store;
}
