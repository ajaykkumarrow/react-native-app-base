import * as ActionTypes from './actionTypes';

export function getProductDetails(vehicleId) {
  return {
    types: [
      ActionTypes.VEHICLEOVERVIEW_LOAD, ActionTypes.VEHICLEOVERVIEW_SUCCESS, ActionTypes.VEHICLEOVERVIEW_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Vehicles/${vehicleId}/detail`)
  };
}

export function get360ImageDetails(vehicleId) {
  return {
    types: [
      ActionTypes.IMAGE360_LOAD, ActionTypes.IMAGE360_SUCCESS, ActionTypes.IMAGE360_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Vehicles/${vehicleId}/threeSixtyDegree`)
  };
}
export function getLeadInfo(leadId) {
  return {
    types: [
      ActionTypes.GETLEAD_LOAD, ActionTypes.GETLEAD_SUCCESS, ActionTypes.GETLEAD_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Leads/${leadId}`)
  };
}

export function updateLeadInfo(leadId, data) {
  return {
    types: [
      ActionTypes.UPDATE_LEAD_LOAD, ActionTypes.UPDATE_LEAD_SUCCESS, ActionTypes.UPDATE_LEAD_FAIL
    ],
    promise: ({ client }) =>
      client.patch(`/Leads/${leadId}`, data)
  };
}

export function updateLeadDetailsObject(leadDetailId, data) {
  return {
    types: [
      ActionTypes.LEADDETAILUPDATE_LOAD, ActionTypes.LEADDETAILUPDATE_SUCCESS, ActionTypes.LEADDETAILUPDATE_FAIL
    ],
    promise: ({ client }) =>
      client.patch(`/LeadDetails/${leadDetailId}`, data)
  };
}

export function createLeadDetailsObject(leadId, data) {
  return {
    types: [
      ActionTypes.CREATELEADDETAIL_LOAD, ActionTypes.CREATELEADDETAIL_SUCCESS, ActionTypes.CREATELEADDETAIL_FAIL
    ],
    promise: ({ client }) =>
      client.post(`/Leads/${leadId}/leadDetail`, data)
  };
}

