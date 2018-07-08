import {
  FINANCIER_INFO_LOAD,
  FINANCIER_INFO_SUCCESS,
  FINANCIER_INFO_FAIL,
  UPDATEFINANCIER_INFO_LOAD,
  UPDATEFINANCIER_INFO_SUCCESS,
  UPDATEFINANCIER_INFO_FAIL,
  UPDATEUSERINFO_INFO_LOAD,
  UPDATEUSERINFO_INFO_SUCCESS,
  UPDATEUSERINFO_INFO_FAIL
} from '../../actions/Financier/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FINANCIER_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case FINANCIER_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        addedFinancierList: action.response.dealerFinanciers,
        unaddedFinancierList: action.response.financiers
      };
    case FINANCIER_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case UPDATEFINANCIER_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case UPDATEFINANCIER_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        addedFinancierList: action.response.dealerFinanciers,
        unaddedFinancierList: action.response.financiers
      };
    case UPDATEFINANCIER_INFO_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case UPDATEUSERINFO_INFO_LOAD:
      return {
        ...state,
        loading: true
      };
    case UPDATEUSERINFO_INFO_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.response
      };
    case UPDATEUSERINFO_INFO_FAIL:
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
