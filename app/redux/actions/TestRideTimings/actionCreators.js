import * as ActionTypes from './actionTypes';

export default function testRideTimings(data) {
  return {
    types: [
      ActionTypes.TIMINGS_LOAD, ActionTypes.TIMINGS_SUCCESS, ActionTypes.TIMINGS_FAIL
    ],
    promise: ({ client }) => client.patch('/Dealers', data)
  };
}
