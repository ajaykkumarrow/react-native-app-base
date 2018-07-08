import {
  TARGET_DETAILS_LOAD,
  TARGET_DETAILS_SUCCESS,
  TARGET_DETAILS_FAIL,
  UPDATE_TARGET_DETAILS_LOAD,
  UPDATE_TARGET_DETAILS_SUCCESS,
  UPDATE_TARGET_DETAILS_FAIL } from '../../actions/Target/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false,
  targetList: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TARGET_DETAILS_LOAD:
      return {
        ...state,
        loading: true
      };
    case TARGET_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        targetList: action.response
      };
    case TARGET_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case UPDATE_TARGET_DETAILS_LOAD:
      return {
        ...state,
        loading: true
      };
    case UPDATE_TARGET_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        variantPriceDetails: action.response
      };
    case UPDATE_TARGET_DETAILS_FAIL:
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
