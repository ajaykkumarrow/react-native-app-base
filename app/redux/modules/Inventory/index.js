import {
  INVENTORY_INFO_LOAD,
  INVENTORY_INFO_SUCCESS,
  INVENTORY_INFO_FAIL,
  VARIANT_INFO_LOAD,
  VARIANT_INFO_SUCCESS,
  VARIANT_INFO_FAIL,
  VARIANTPRICE_INFO_LOAD,
  VARIANTPRICE_INFO_SUCCESS,
  VARIANTPRICE_INFO_FAIL,
  UPDATEVARIANTPRICE_INFO_LOAD,
  UPDATEVARIANTPRICE_INFO_SUCCESS,
  UPDATEVARIANTPRICE_INFO_FAIL,
  VARIANTSTOCK_INFO_LOAD,
  VARIANTSTOCK_INFO_SUCCESS,
  VARIANTSTOCK_INFO_FAIL,
  INCENTIVEOFFER_INFO_LOAD,
  INCENTIVEOFFER_INFO_SUCCESS,
  INCENTIVEOFFER_INFO_FAIL,
  UPDATE_INCENTIVEOFFER_INFO_LOAD,
  UPDATE_INCENTIVEOFFER_INFO_SUCCESS,
  UDPATE_INCENTIVEOFFER_INFO_FAIL,
  VARIANTDETAILS_INFO_LOAD,
  VARIANTDETAILS_INFO_SUCCESS,
  VARIANTDETAILS_INFO_FAIL } from '../../actions/Inventory/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case INVENTORY_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case INVENTORY_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        inventoryList: action.response
      };
    case INVENTORY_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case VARIANT_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case VARIANT_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        variantList: action.response
      };
    case VARIANT_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case VARIANTPRICE_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case VARIANTPRICE_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        variantPriceDetails: action.response
      };
    case VARIANTPRICE_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case UPDATEVARIANTPRICE_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case UPDATEVARIANTPRICE_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        variantPriceDetails: action.response
      };
    case UPDATEVARIANTPRICE_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case VARIANTSTOCK_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case VARIANTSTOCK_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        variantStockList: action.response
      };
    case VARIANTSTOCK_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case INCENTIVEOFFER_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case INCENTIVEOFFER_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        incentiveOfferDetails: action.response[0].dealer_vehicles[0]
      };
    case INCENTIVEOFFER_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case UPDATE_INCENTIVEOFFER_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case UPDATE_INCENTIVEOFFER_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    case UDPATE_INCENTIVEOFFER_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case VARIANTDETAILS_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case VARIANTDETAILS_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        currentVariantVehicleDetails: action.response
      };
    case VARIANTDETAILS_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    default:
      return state;
  }
}
