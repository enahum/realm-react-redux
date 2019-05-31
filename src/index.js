import createRealmStore from './store';
import combineWriters from './writer';
import { bindActionCreators, applyMiddleware, compose } from 'redux';
import warning from './utils/warning';
import { realmConnect, createRealmConnect, realmConnectAdvanced } from './connect';
import RealmProvider from './provider';

/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (
    process.env.NODE_ENV !== 'production' &&
    typeof isCrushed.name === 'string' &&
    isCrushed.name !== 'isCrushed'
) {
    warning(
        'You are currently using minified code outside of NODE_ENV === \'production\'. ' +
        'This means that you are running a slower development build of Redux. ' +
        'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' +
        'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' +
        'to ensure you have the correct code for your production build.'
    );
}

export {
    createRealmStore,
    combineWriters,
    bindActionCreators,
    applyMiddleware,
    compose,
    RealmProvider,
    realmConnect,
    createRealmConnect,
    realmConnectAdvanced
};
