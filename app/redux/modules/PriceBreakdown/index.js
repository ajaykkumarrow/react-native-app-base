import {
  CREATE_OFFER,
  CREATE_OFFER_SUCCESS,
  CREATE_OFFER_FAILURE,
  DELETE_OFFER,
  DELETE_OFFER_SUCCESS,
  DELETE_OFFER_FAILURE,
  PROFORMA_ACCESSORIES,
  PROFORMA_ACCESSORIES_SUCCESS,
  PROFORMA_ACCESSORIES_FAILURE,
  PROFORMA_COLOR,
  PROFORMA_COLOR_SUCCESS,
  PROFORMA_COLOR_FAILURE,
  GET_INVOICE,
  GET_INVOICE_SUCCESS,
  GET_INVOICE_FAILURE,
  GET_VEHICLE_DETAILS,
  GET_VEHICLE_DETAILS_SUCCESS,
  GET_VEHICLE_DETAILS_FAILURE
} from '../../actions/PriceBreakdown/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_OFFER:
      return {
        ...state,
        loading: true
      };
    case CREATE_OFFER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        createOfferResponse: action.response
      };
    case CREATE_OFFER_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case DELETE_OFFER:
      return {
        ...state,
        loading: true
      };
    case DELETE_OFFER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        deleteOfferResponse: action.response
      };
    case DELETE_OFFER_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case PROFORMA_ACCESSORIES:
      return {
        ...state,
        loading: true
      };
    case PROFORMA_ACCESSORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        accessoriesResponse: action.response
      };
    case PROFORMA_ACCESSORIES_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case PROFORMA_COLOR:
      return {
        ...state,
        loading: true
      };
    case PROFORMA_COLOR_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        updateResponse: action.response
      };
    case PROFORMA_COLOR_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case GET_INVOICE:
      return {
        ...state,
        loading: true
      };
    case GET_INVOICE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        proformaResponse: action.response
      };
    case GET_INVOICE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case GET_VEHICLE_DETAILS:
      return {
        ...state,
        loading: true
      };
    case GET_VEHICLE_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        vehicleResponse: action.response
      };
    case GET_VEHICLE_DETAILS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    default:
      return state;
  }
}
