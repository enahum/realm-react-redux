'use strict';

exports.__esModule = true;
exports.wrapMapToPropsConstant = wrapMapToPropsConstant;
exports.getDependsOnOwnProps = getDependsOnOwnProps;
exports.wrapMapToPropsFunc = wrapMapToPropsFunc;

var _verify = require('../utils/verify');

function wrapMapToPropsConstant(getConstant) {
    return function initConstantSelector(dispatch, options) {
        var constant = getConstant(dispatch, options);

        function constantSelector() {
            return constant;
        }
        constantSelector.dependsOnOwnProps = false;
        return constantSelector;
    };
}

// dependsOnOwnProps is used by createMapToPropsProxy to determine whether to pass props as args
// to the mapToProps function being wrapped. It is also used by makePurePropsSelector to determine
// whether mapToProps needs to be invoked when props have changed.
//
// A length of one signals that mapToProps does not depend on props from the parent component.
// A length of zero is assumed to mean mapToProps is getting args via arguments or ...args and
// therefore not reporting its length accurately..
function getDependsOnOwnProps(mapToProps) {
    return mapToProps.dependsOnOwnProps !== null && mapToProps.dependsOnOwnProps !== undefined ? Boolean(mapToProps.dependsOnOwnProps) : mapToProps.length !== 1;
}

// Used by whenMapStateToPropsIsFunction and whenMapDispatchToPropsIsFunction,
// this function wraps mapToProps in a proxy function which does several things:
//
//  * Detects whether the mapToProps function being called depends on props, which
//    is used by selectorFactory to decide if it should reinvoke on props changes.
//
//  * On first call, handles mapToProps if returns another function, and treats that
//    new function as the true mapToProps for subsequent calls.
//
//  * On first call, verifies the first result is a plain object, in order to warn
//    the developer that their mapToProps function is not returning a valid result.
//
function wrapMapToPropsFunc(mapToProps, methodName) {
    return function initProxySelector(dispatch, _ref) {
        var displayName = _ref.displayName;

        var proxy = function mapToPropsProxy(realmOrDispatch, ownProps) {
            return proxy.dependsOnOwnProps ? proxy.mapToProps(realmOrDispatch, ownProps) : proxy.mapToProps(realmOrDispatch);
        };

        // allow detectFactoryAndVerify to get ownProps
        proxy.dependsOnOwnProps = true;

        proxy.mapToProps = function detectFactoryAndVerify(realmOrDispatch, ownProps) {
            proxy.mapToProps = mapToProps;
            proxy.dependsOnOwnProps = getDependsOnOwnProps(mapToProps);
            var props = proxy(realmOrDispatch, ownProps);

            if (typeof props === 'function') {
                proxy.mapToProps = props;
                proxy.dependsOnOwnProps = getDependsOnOwnProps(props);
                props = proxy(realmOrDispatch, ownProps);
            }

            if (process.env.NODE_ENV !== 'production') {
                if (methodName === 'mapPropsToQueries') {
                    (0, _verify.verifyArray)(props, displayName, methodName);
                } else {
                    (0, _verify.verifyPlainObject)(props, displayName, methodName);
                }
            }

            return props;
        };

        return proxy;
    };
}