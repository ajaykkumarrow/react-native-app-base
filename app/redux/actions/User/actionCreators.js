import * as ActionTypes from './actionTypes';

export function setUser(user) {
  return {
    type: ActionTypes.USER_LOAD,
    user
  };
}

export function clearUser() {
  return {
    type: ActionTypes.CLEAR_USER,
  };
}
