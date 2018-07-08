import * as ActionTypes from './actionTypes';

export function createLead(dealerId, data) {
  return {
    types: [
      ActionTypes.CREATE_LEAD_LOAD, ActionTypes.CREATE_LEAD_SUCCESS, ActionTypes.CREATE_LEAD_FAIL
    ],
    promise: ({ client }) =>
      client.post(`/Dealers/${dealerId}/lead/create`, data)
  };
}

export function updateLead(leadId, data) {
  return {
    types: [
      ActionTypes.UPDATE_LEAD_LOAD, ActionTypes.UPDATE_LEAD_SUCCESS, ActionTypes.UPDATE_LEAD_FAIL
    ],
    promise: ({ client }) =>
      client.patch(`/Leads/${leadId}`, data)
  };
}

export function clearLead() {
  return {
    type: ActionTypes.CLEAR_LEAD_DETAIL
  };
}
