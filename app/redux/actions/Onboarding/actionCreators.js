import * as ActionTypes from './actionTypes';

export default function getDealerById(dealerId) {
  return {
    types: [
      ActionTypes.DEALER_LOAD, ActionTypes.DEALER_SUCCESS, ActionTypes.DEALER_FAIL
    ],
    promise: ({ client }) => client.get(`/Dealers/${dealerId}`)
  };
}
