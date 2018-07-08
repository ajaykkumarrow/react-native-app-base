import {
  CREATE_LEAD_LOAD,
  CREATE_LEAD_SUCCESS,
  CREATE_LEAD_FAIL,
  UPDATE_LEAD_LOAD,
  UPDATE_LEAD_SUCCESS,
  UPDATE_LEAD_FAIL,
  CLEAR_LEAD_DETAIL
} from '../../actions/CreateNewLead/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_LEAD_LOAD:
      return {
        ...state,
        loading: true
      };
    case CREATE_LEAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        lead: action.response
      };
    case CREATE_LEAD_FAIL:
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
        lead: action.response
      };
    case UPDATE_LEAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case CLEAR_LEAD_DETAIL:
      return {
        ...state,
        lead: null
      };
    default:
      return state;
  }
}
