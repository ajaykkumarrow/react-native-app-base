import * as ActionTypes from './actionTypes';

export function getVehicleAccessories(dealerId, filterData) {
  return {
    types: [
      ActionTypes.GETVEHICLEACCESORIES_LOAD,
      ActionTypes.GETVEHICLEACCESORIES_SUCCESS,
      ActionTypes.GETVEHICLEACCESORIES_FAIL
    ],
    promise: ({ client }) =>
      client.post(`/Dealers/${dealerId}/accessories/getAll`, filterData)
  };
}

export function saveVehicleAccessories(dealerId, data) {
  return {
    types: [
      ActionTypes.SAVEVEHICLEACCESORIES_LOAD,
      ActionTypes.SAVEVEHICLEACCESORIES_SUCCESS,
      ActionTypes.SAVEVEHICLEACCESORIES_FAIL
    ],
    promise: ({ client }) =>
      client.post(`/Dealers/${dealerId}/accessories/associate`, data)
  };
}
