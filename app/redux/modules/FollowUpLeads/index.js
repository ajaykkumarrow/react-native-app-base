import {
  FOLLOW_UP_DONE_LOAD,
  FOLLOW_UP_DONE_SUCCESS,
  FOLLOW_UP_DONE_FAILURE,
  FOLLOW_UP_TODAY_LOAD,
  FOLLOW_UP_TODAY_SUCCESS,
  FOLLOW_UP_TODAY_FAILURE,
  FOLLOW_UP_ASSIGNEE_LOAD,
  FOLLOW_UP_ASSIGNEE_SUCCESS,
  FOLLOW_UP_ASSIGNEE_FAILURE,
  UPDATE_LEAD_LOAD,
  UPDATE_LEAD_SUCCESS,
  UPDATE_LEAD_FAIL,
  FOLLOW_COUNT_LOAD,
  FOLLOW_COUNT_SUCCESS,
  FOLLOW_COUNT_FAILURE
} from '../../actions/FollowUpLeads/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FOLLOW_UP_DONE_LOAD:
      return {
        ...state,
        loading: true
      };
    case FOLLOW_UP_DONE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        followUpDoneResponse: action.response,
      };
    case FOLLOW_UP_DONE_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case FOLLOW_UP_TODAY_LOAD:
      return {
        ...state,
        loading: true
      };
    case FOLLOW_UP_TODAY_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        followUpTodayResponse: action.response,
      };
    case FOLLOW_UP_TODAY_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case FOLLOW_UP_ASSIGNEE_LOAD:
      return {
        ...state,
        loading: true
      };
    case FOLLOW_UP_ASSIGNEE_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        assignees: action.response,
      };
    case FOLLOW_UP_ASSIGNEE_FAILURE:
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
        updateResponse: action.response,
      };
    case UPDATE_LEAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case FOLLOW_COUNT_LOAD:
      return {
        ...state,
        loading: true
      };
    case FOLLOW_COUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        followCount: action.response,
      };
    case FOLLOW_COUNT_FAILURE:
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
