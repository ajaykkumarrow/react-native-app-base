import {
  LEADOVERVIEW_LOAD,
  LEADOVERVIEW_SUCCESS,
  LEADOVERVIEW_FAIL,
  LEADASSIGN_LOAD,
  LEADASSIGN_SUCCESS,
  LEADASSIGN_FAIL,
  UPDATE_LEAD_LOAD,
  UPDATE_LEAD_SUCCESS,
  UPDATE_LEAD_FAIL,
  GET_LEADCOUNT_LOAD,
  GET_LEADCOUNT_SUCCESS,
  GET_LEADCOUNT_FAIL
} from '../../actions/NewLeadOverView/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LEADOVERVIEW_LOAD:
      return {
        ...state,
        loading: true
      };
    case LEADOVERVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadCreatedList: action.response
      };
    case LEADOVERVIEW_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case LEADASSIGN_LOAD:
      return {
        ...state,
        loading: true
      };
    case LEADASSIGN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        assignedToList: action.response
      };
    case LEADASSIGN_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
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
      };
    case UPDATE_LEAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case GET_LEADCOUNT_LOAD:
      return {
        ...state,
        loading: true
      };
    case GET_LEADCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadCountDetails: action.response,
      };
    case GET_LEADCOUNT_FAIL:
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
