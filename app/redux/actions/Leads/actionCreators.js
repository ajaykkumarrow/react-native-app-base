import * as ActionTypes from './actionTypes';

export function getLeads(leadStatus) {
  return {
    types: [
      ActionTypes.GETLEADS_LOAD,
      ActionTypes.GETLEADS_SUCCESS,
      ActionTypes.GETLEADS_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Leads/status/${leadStatus}`)
  };
}

export function getExecutives(dealerId) {
  return {
    types: [
      ActionTypes.GETEXECUTIVES_LOAD,
      ActionTypes.GETEXECUTIVES_SUCCESS,
      ActionTypes.GETEXECUTIVES_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Dealers/${dealerId}/Users/keyvalue`)
  };
}

export function getCount(filterData) {
  return {
    types: [
      ActionTypes.GETCOUNT_LOAD,
      ActionTypes.GETCOUNT_SUCCESS,
      ActionTypes.GETCOUNT_FAIL
    ],
    promise: ({ client }) =>
      client.post('/Leads/statusCount', filterData)
  };
}

export function searchLead(filterObject) {
  return {
    types: [
      ActionTypes.FILTERLEAD_LOAD,
      ActionTypes.FILTERLEAD_SUCCESS,
      ActionTypes.FILTERLEAD_FAIL
    ],
    promise: ({ client }) =>
      client.post('/Leads/filter', filterObject)
  };
}

export function clearLeads() {
  return {
    type: ActionTypes.CLEAR_LEAD
  };
}

