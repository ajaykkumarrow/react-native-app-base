import * as ActionTypes from './actionTypes';

export function getManufacturerId(id) {
  return {
    types: [
      ActionTypes.GETMANUFACTURERID_LOAD, ActionTypes.GETMANUFACTURERID_SUCCESS, ActionTypes.GETMANUFACTURERID_FAIL
    ],
    promise: ({ client }) => client.get(`/Dealers/${id}`)
  };
}

export function getVehicles(dealerId, manufacturerId, searchOption) {
  return {
    types: [
      ActionTypes.GETVEHICLES_LOAD, ActionTypes.GETVEHICLES_SUCCESS, ActionTypes.GETVEHICLES_FAIL
    ],
    promise: ({ client }) =>
      client.post(`/Vehicles/manufacturer/${manufacturerId}/dealer/${dealerId}/searchVehicle`, searchOption)
  };
}
