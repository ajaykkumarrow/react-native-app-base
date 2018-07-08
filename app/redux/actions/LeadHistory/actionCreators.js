import * as ActionTypes from './actionTypes';

export function getLeadDetails(leadId) {
  return {
    types: [
      ActionTypes.GETLEAD_LOAD, ActionTypes.GETLEAD_SUCCESS, ActionTypes.GETLEAD_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Leads/${leadId}`)
  };
}

export function getTeamMembers(dealerId) {
  return {
    types: [
      ActionTypes.GET_TEAM_MEMBERS_LOAD,
      ActionTypes.GET_TEAM_MEMBERS_SUCCESS,
      ActionTypes.GET_TEAM_MEMBERS_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Dealers/${dealerId}/users/keyvalue`)
  };
}

export function updateLead(leadId, data) {
  return {
    types: [
      ActionTypes.UPDATE_LEAD_LOAD,
      ActionTypes.UPDATE_LEAD_SUCCESS,
      ActionTypes.UPDATE_LEAD_FAIL
    ],
    promise: ({ client }) =>
      client.patch(`/Leads/${leadId}`, data)
  };
}

export function getAllVehicles(dealerId) {
  return {
    types: [
      ActionTypes.GET_ALLVEHICLES_LOAD,
      ActionTypes.GET_ALLVEHICLES_SUCCESS,
      ActionTypes.GET_ALLVEHICLES_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Dealers/${dealerId}/vehicles/keyvalue`)
  };
}

export function updateLeadDetail(leadDetailId, data) {
  return {
    types: [
      ActionTypes.UPDATE_LEADDETAIL_LOAD,
      ActionTypes.UPDATE_LEADDETAIL_SUCCESS,
      ActionTypes.UPDATE_LEADDETAIL_FAIL
    ],
    promise: ({ client }) =>
      client.patch(`/LeadDetails/${leadDetailId}`, data)
  };
}

export function deleteLeadDetail(leadDetailId) {
  return {
    types: [
      ActionTypes.DELETE_LEADDETAIL_LOAD,
      ActionTypes.DELETE_LEADDETAIL_SUCCESS,
      ActionTypes.DELETE_LEADDETAIL_FAIL
    ],
    promise: ({ client }) =>
      client.delete(`/LeadDetails/${leadDetailId}`)
  };
}

export function createLeadDetail(leadId, data) {
  return {
    types: [
      ActionTypes.CREATE_LEADDETAIL_LOAD,
      ActionTypes.CREATE_LEADDETAIL_SUCCESS,
      ActionTypes.CREATE_LEADDETAIL_FAIL
    ],
    promise: ({ client }) =>
      client.post(`/Leads/${leadId}/leadDetail`, data)
  };
}

export function updateLeadDetailStatus(leadId, leadDetailId) {
  return {
    types: [
      ActionTypes.UPDATE_LEADDETAIL_STATUS_LOAD,
      ActionTypes.UPDATE_LEADDETAIL_STATUS_SUCCESS,
      ActionTypes.UPDATE_LEADDETAIL_STATUS_FAIL
    ],
    promise: ({ client }) =>
      client.put(`/Leads/${leadId}/leadDetailId/${leadDetailId}/invoiced`)
  };
}
