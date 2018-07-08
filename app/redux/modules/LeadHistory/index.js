import {
  GETLEAD_LOAD,
  GETLEAD_SUCCESS,
  GETLEAD_FAIL,
  GET_TEAM_MEMBERS_LOAD,
  GET_TEAM_MEMBERS_SUCCESS,
  GET_TEAM_MEMBERS_FAIL,
  UPDATE_LEAD_LOAD,
  UPDATE_LEAD_SUCCESS,
  UPDATE_LEAD_FAIL,
  GET_ALLVEHICLES_LOAD,
  GET_ALLVEHICLES_SUCCESS,
  GET_ALLVEHICLES_FAIL,
  UPDATE_LEADDETAIL_LOAD,
  UPDATE_LEADDETAIL_SUCCESS,
  UPDATE_LEADDETAIL_FAIL,
  CREATE_LEADDETAIL_LOAD,
  CREATE_LEADDETAIL_SUCCESS,
  CREATE_LEADDETAIL_FAIL,
  UPDATE_LEADDETAIL_STATUS_LOAD,
  UPDATE_LEADDETAIL_STATUS_SUCCESS,
  UPDATE_LEADDETAIL_STATUS_FAIL,
  DELETE_LEADDETAIL_LOAD,
  DELETE_LEADDETAIL_SUCCESS,
  DELETE_LEADDETAIL_FAIL
} from '../../actions/LeadHistory/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
        lead: action.response
      };
    case GETLEAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case GET_TEAM_MEMBERS_LOAD:
      return {
        ...state,
        loading: true
      };
    case GET_TEAM_MEMBERS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        teamMembers: action.response
      };
    case GET_TEAM_MEMBERS_FAIL:
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
        lead: action.response
      };
    case UPDATE_LEAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case UPDATE_LEADDETAIL_LOAD:
      return {
        ...state,
        loading: true
      };
    case UPDATE_LEADDETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadDetail: action.response
      };
    case UPDATE_LEADDETAIL_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case CREATE_LEADDETAIL_LOAD:
      return {
        ...state,
        loading: true
      };
    case CREATE_LEADDETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadDetail: action.response
      };
    case CREATE_LEADDETAIL_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case DELETE_LEADDETAIL_LOAD:
      return {
        ...state,
        loading: true
      };
    case DELETE_LEADDETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true
      };
    case DELETE_LEADDETAIL_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case GET_ALLVEHICLES_LOAD:
      return {
        ...state,
        loading: true
      };
    case GET_ALLVEHICLES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        vehicleList: action.response
      };
    case GET_ALLVEHICLES_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case UPDATE_LEADDETAIL_STATUS_LOAD:
      return {
        ...state,
        loading: true
      };
    case UPDATE_LEADDETAIL_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    case UPDATE_LEADDETAIL_STATUS_FAIL:
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
