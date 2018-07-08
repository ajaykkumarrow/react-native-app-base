import * as ActionTypes from './actionTypes';

export function getInventoryList(dealerId) {
  return {
    types: [
      ActionTypes.INVENTORY_INFO_LOAD, ActionTypes.INVENTORY_INFO_SUCCESS, ActionTypes.INVENTORY_INFO_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Dealers/${dealerId}/inventoryDetails`)
  };
}

export function getVarientList(vehicleId) {
  return {
    types: [
      ActionTypes.VARIANT_INFO_LOAD, ActionTypes.VARIANT_INFO_SUCCESS, ActionTypes.VARIANT_INFO_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Vehicles/${vehicleId}/variants`)
  };
}
export function getInventoryPriceDetails(vehicleId, variantId, dealerId) {
  return {
    types: [
      ActionTypes.VARIANTPRICE_INFO_LOAD, ActionTypes.VARIANTPRICE_INFO_SUCCESS, ActionTypes.VARIANTPRICE_INFO_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Vehicles/${vehicleId}/variants/${variantId}/dealer/${dealerId}/price`)
  };
}

export function updateInventoryPriceDetails(data) {
  return {
    types: [
      ActionTypes.UPDATEVARIANTPRICE_INFO_LOAD,
      ActionTypes.UPDATEVARIANTPRICE_INFO_SUCCESS,
      ActionTypes.UPDATEVARIANTPRICE_INFO_FAIL
    ],
    promise: ({ client }) =>
      client.patch('/VehiclePrices', data)
  };
}

export function getStockDetails(dealerId, variantId) {
  return {
    types: [
      ActionTypes.VARIANTSTOCK_INFO_LOAD,
      ActionTypes.VARIANTSTOCK_INFO_SUCCESS,
      ActionTypes.VARIANTSTOCK_INFO_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/DealerInventories/variants/${variantId}/dealer/${dealerId}/getStocks`)
  };
}
export function updateStockDetails(data) {
  return {
    types: [
      ActionTypes.UPDATEVARIANTSTOCK_INFO_LOAD,
      ActionTypes.UPDATEVARIANTSTOCK_INFO_SUCCESS,
      ActionTypes.UPDATEVARIANTSTOCK_INFO_FAIL
    ],
    promise: ({ client }) =>
      client.post('/DealerInventories/updateStocks', data)
  };
}
export function getIncentiveOfferDetails(dealerId, vehicleId) {
  return {
    types: [
      ActionTypes.INCENTIVEOFFER_INFO_LOAD,
      ActionTypes.INCENTIVEOFFER_INFO_SUCCESS,
      ActionTypes.INCENTIVEOFFER_INFO_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/DealerInventories/dealer/${dealerId}/vehicle/${vehicleId}/vehicleInventoryDetails`)
  };
}
export function updateIncentiveOfferDetails(data) {
  return {
    types: [
      ActionTypes.UPDATE_INCENTIVEOFFER_INFO_LOAD,
      ActionTypes.UPDATE_INCENTIVEOFFER_INFO_SUCCESS,
      ActionTypes.UDPATE_INCENTIVEOFFER_INFO_FAIL
    ],
    promise: ({ client }) =>
      client.patch('/DealerVehicles', data)
  };
}
export function getCurrentVariantDetails(dealerId, vehicleId, variantId) {
  return {
    types: [
      ActionTypes.VARIANTDETAILS_INFO_LOAD,
      ActionTypes.VARIANTDETAILS_INFO_SUCCESS,
      ActionTypes.VARIANTDETAILS_INFO_FAIL
    ],
    promise: ({ client }) =>
      client.get(`/Dealers/${dealerId}/vehicle/${vehicleId}/variant/${variantId}/variantInventoryDetail`)

  };
}
