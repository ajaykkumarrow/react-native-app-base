import * as ActionTypes from './actionTypes';

export function getTargetList(dealerId) {
  return {
    types: [
      ActionTypes.TARGET_DETAILS_LOAD, ActionTypes.TARGET_DETAILS_SUCCESS, ActionTypes.TARGET_DETAILS_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/DealerTargets/dealers/${dealerId}/target`)
  };
}

export function updateTargetDetails(data) {
  return {
    types: [
      ActionTypes.UPDATE_TARGET_DETAILS_LOAD,
      ActionTypes.UPDATE_TARGET_DETAILS_SUCCESS,
      ActionTypes.UPDATE_TARGET_DETAILS_FAIL
    ],
    promise: ({ client }) =>
      client.patch('/DealerTargets/dealers/', data)
  };
}
