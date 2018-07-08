import {
  VEHICLEOVERVIEW_LOAD,
  VEHICLEOVERVIEW_SUCCESS,
  VEHICLEOVERVIEW_FAIL,
  IMAGE360_LOAD,
  IMAGE360_SUCCESS,
  IMAGE360_FAIL,
  LEADDETAILUPDATE_LOAD,
  LEADDETAILUPDATE_SUCCESS,
  LEADDETAILUPDATE_FAIL,
  GETLEAD_LOAD,
  GETLEAD_SUCCESS,
  GETLEAD_FAIL,
  CREATELEADDETAIL_LOAD,
  CREATELEADDETAIL_SUCCESS,
  CREATELEADDETAIL_FAIL,
  UPDATE_LEAD_LOAD,
  UPDATE_LEAD_SUCCESS,
  UPDATE_LEAD_FAIL
} from '../../actions/ProductDetail/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case VEHICLEOVERVIEW_LOAD:
      return {
        ...state,
        loading: true
      };
    case VEHICLEOVERVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        productDetail: action.response
      };
    case VEHICLEOVERVIEW_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case IMAGE360_LOAD:
      return {
        ...state,
        loading: true
      };
    case IMAGE360_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        images360Array: action.response
      };
    case IMAGE360_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case GETLEAD_LOAD:
      return {
        ...state,
        loading: true
      };
    case GETLEAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadObj: action.response
      };
    case GETLEAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case UPDATE_LEAD_LOAD:
      return {
        ...state,
        loading: true
      };
    case UPDATE_LEAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadObj: action.response
      };
    case UPDATE_LEAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case CREATELEADDETAIL_LOAD:
      return {
        ...state,
        loading: true
      };
    case CREATELEADDETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadDetailObj: action.response
      };
    case CREATELEADDETAIL_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case LEADDETAILUPDATE_LOAD:
      return {
        ...state,
        loading: true
      };
    case LEADDETAILUPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadDetailObj: action.response
      };
    case LEADDETAILUPDATE_FAIL:
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
