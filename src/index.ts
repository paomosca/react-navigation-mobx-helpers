import { observable, action } from 'mobx';
import {
  NavigationActions,
  NavigationContainer,
  NavigationState,
  NavigationAction,
  NavigationBackActionPayload,
  NavigationInitActionPayload,
  NavigationNavigateActionPayload,
  NavigationResetActionPayload,
  NavigationSetParamsActionPayload,
  NavigationUriAction,
  NavigationUriActionPayload,
} from 'react-navigation';

class Navigation {
  Navigator: NavigationContainer = this.constructor.arguments[0];

  @observable.ref state: NavigationState = this.Navigator.router.getStateForAction(NavigationActions.init(), null);

  subscribers = new Set();

  @action.bound dispatch(action: NavigationAction & any) {
    const lastState = this.state;
    const state = this.Navigator.router.getStateForAction(action, lastState);
    this.subscribers.forEach((subscriber) => {
      subscriber({
        type: 'action',
        action,
        state,
        lastState,
      });
    });
    this.state = state;
  }

  addListener = (eventName: string, handler: () => {}) => {
    if (eventName !== 'action') {
      return { remove() {} };
    }
    this.subscribers.add(handler);
    return {
      remove: () => {
        this.subscribers.delete(handler);
      },
    };
  }

  /**
   * original actions
   */

  back = (payload: NavigationBackActionPayload) => {
    const action: NavigationAction = NavigationActions.back(payload);
    this.dispatch(action);
  }

  init = (payload: NavigationInitActionPayload) => {
    const action: NavigationAction = NavigationActions.init(payload);
    this.dispatch(action);
  }

  navigate = (payload: NavigationNavigateActionPayload) => {
    const action: NavigationAction = NavigationActions.navigate(payload);
    this.dispatch(action);
  }

  pop = (payload: any) => {
    const action = {
      type: 'Navigation/POP',
      n: payload && payload.n,
      immediate: payload && payload.immediate,
    };
    this.dispatch(action);
  }

  popToTop = (payload: any) => {
    const action = {
      type: 'Navigation/POP_TO_TOP',
      immediate: payload && payload.immediate,
    };
    this.dispatch(action);
  }

  push = (payload: any) => {
    const action: any = {
      type: 'Navigation/PUSH',
      routeName: payload.routeName,
    };
    if (payload.params) {
      action.params = payload.params;
    }
    if (payload.action) {
      action.action = payload.action;
    }
    this.dispatch(action);
  }

  reset = (payload: NavigationResetActionPayload) => {
    const action: NavigationAction = NavigationActions.reset(payload);
    this.dispatch(action);
  }

  replace = (payload: any) => {
    const action = {
      type: 'Navigation/REPLACE',
      key: payload.key,
      newKey: payload.newKey,
      params: payload.params,
      action: payload.action,
      routeName: payload.routeName,
      immediate: payload.immediate,
    };
    this.dispatch(action);
  }

  setParams = (payload: NavigationSetParamsActionPayload) => {
    const action: NavigationAction = NavigationActions.setParams(payload);
    this.dispatch(action);
  }

  uri = (payload: NavigationUriActionPayload) => {
    const action: NavigationUriAction = {
      type: 'Navigation/URI',
      uri: payload.uri,
    };
    this.dispatch(action);
  }

  completeTransition = (payload: any) => {
    const action = {
      type: 'Navigation/COMPLETE_TRANSITION',
      key: payload && payload.key,
    };
    this.dispatch(action);
  }

  /**
   * additional actions
   */

  resetTo = (payload: NavigationNavigateActionPayload) => {
    const action: NavigationAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate(payload),
      ],
    });
    this.dispatch(action);
  }
}

export default Navigation;
