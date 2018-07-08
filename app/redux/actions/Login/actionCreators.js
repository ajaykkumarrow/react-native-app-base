import * as ActionTypes from './actionTypes';

export function authUser(data) {
  return {
    types: [
      ActionTypes.LOGIN_LOAD, ActionTypes.LOGIN_SUCCESS, ActionTypes.LOGIN_FAIL
    ],
    promise: ({ client }) => client.post('/Dealers/login', data)
  };
}

export function resetPassword(userId, data, token) {
  return {
    types: [
      ActionTypes.RESET_PASSWORD_LOAD, ActionTypes.RESET_PASSWORD_SUCCESS, ActionTypes.RESET_PASSWORD_FAIL
    ],
    promise: ({ client }) => client.post(`/Users/${userId}/resetPassword?access_token=${token}`, data)
  };
}
