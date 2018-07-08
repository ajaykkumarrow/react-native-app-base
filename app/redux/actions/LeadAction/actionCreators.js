import * as ActionTypes from './actionTypes';

export function getLostReasons() {
  return {
    types: [
      ActionTypes.LOST_REASON_LOAD,
      ActionTypes.LOST_REASON_SUCCESS,
      ActionTypes.LOST_REASON_FAILURE
    ],
    promise: ({ client }) => client.get('/LostReasons/list')
  };
}

export function postLeadFollowUp(leadId, data) {
  return {
    types: [
      ActionTypes.LEAD_FOLLOW_UP_LOAD,
      ActionTypes.LEAD_FOLLOW_UP_SUCCESS,
      ActionTypes.LEAD_FOLLOW_UP_FAILURE
    ],
    promise: ({ client }) => client.post(`/Leads/${leadId}/followup`, data)
  };
}

export function updateLeadFollowUp(leadId, followUpId, data) {
  return {
    types: [
      ActionTypes.UPDATE_LEAD_FOLLOW_LOAD,
      ActionTypes.UPDATE_LEAD_FOLLOW_SUCCESS,
      ActionTypes.UPDATE_LEAD_FOLLOW_FAILURE
    ],
    promise: ({ client }) => client.put(`/Leads/${leadId}/followup/${followUpId}`, data)
  };
}

export function updateLead(leadId, data) {
  return {
    types: [
      ActionTypes.UPDATE_LEAD_LOAD,
      ActionTypes.UPDATE_LEAD_SUCCESS,
      ActionTypes.UPDATE_LEAD_FAILURE
    ],
    promise: ({ client }) => client.patch(`/Leads/${leadId}`, data)
  };
}

export function getLead(leadId) {
  return {
    types: [
      ActionTypes.GET_LEAD_LOAD,
      ActionTypes.GET_LEAD_SUCCESS,
      ActionTypes.GET_LEAD_FAILURE
    ],
    promise: ({ client }) => client.get(`/Leads/${leadId}`)
  };
}

export function postComment(leadId, data) {
  return {
    types: [
      ActionTypes.ACTION_COMMENT_LOAD,
      ActionTypes.ACTION_COMMENT_SUCCESS,
      ActionTypes.ACTION_COMMENT_FAILURE
    ],
    promise: ({ client }) => client.post(`/Leads/${leadId}/comment`, data)
  };
}

export function getLeadActivities(leadId) {
  return {
    types: [
      ActionTypes.LEAD_ACTIVITIES_LOAD,
      ActionTypes.LEAD_ACTIVITIES_SUCCESS,
      ActionTypes.LEAD_ACTIVITIES_FAILURE
    ],
    promise: ({ client }) => client.get(`/Leads/${leadId}/activities`)
  };
}
