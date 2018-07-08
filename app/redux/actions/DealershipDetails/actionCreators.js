import * as ActionTypes from './actionTypes';

export function getZones() {
  return {
    types: [
      ActionTypes.ZONES_LOAD, ActionTypes.ZONES_SUCCESS, ActionTypes.ZONES_FAIL
    ],
    promise: ({ client }) =>
      client.get('/Zones')
  };
}

export function getStates(zoneId) {
  return {
    types: [
      ActionTypes.STATES_LOAD, ActionTypes.STATES_SUCCESS, ActionTypes.STATES_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Zones/${zoneId}/states`)
  };
}

export function getCities(cityId) {
  return {
    types: [
      ActionTypes.CITIES_LOAD, ActionTypes.CITIES_SUCCESS, ActionTypes.CITIES_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/States/${cityId}/cities`)
  };
}

export function saveDealership(data) {
  return {
    types: [
      ActionTypes.SAVE_DEALERSHIP_LOAD, ActionTypes.SAVE_DEALERSHIP_SUCCESS, ActionTypes.SAVE_DEALERSHIP_FAIL
    ],
    promise: ({ client }) =>
      client.put(`/Dealers/${data.dealer.id}/user/${data.user.id}/updateDealerWithManager`, data)
  };
}
