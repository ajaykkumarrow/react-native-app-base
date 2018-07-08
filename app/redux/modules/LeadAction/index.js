import
{
  LOST_REASON_LOAD,
  LOST_REASON_SUCCESS,
  LOST_REASON_FAILURE,
  LEAD_FOLLOW_UP_LOAD,
  LEAD_FOLLOW_UP_SUCCESS,
  LEAD_FOLLOW_UP_FAILURE,
  UPDATE_LEAD_LOAD,
  UPDATE_LEAD_SUCCESS,
  UPDATE_LEAD_FAILURE,
  GET_LEAD_LOAD,
  GET_LEAD_SUCCESS,
  GET_LEAD_FAILURE,
  UPDATE_LEAD_FOLLOW_LOAD,
  UPDATE_LEAD_FOLLOW_SUCCESS,
  UPDATE_LEAD_FOLLOW_FAILURE,
  ACTION_COMMENT_LOAD,
  ACTION_COMMENT_SUCCESS,
  ACTION_COMMENT_FAILURE,
  LEAD_ACTIVITIES_LOAD,
  LEAD_ACTIVITIES_SUCCESS,
  LEAD_ACTIVITIES_FAILURE
}
  from '../../actions/LeadAction/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOST_REASON_LOAD:
      return {
        ...state,
        loading: true
      };
    case LOST_REASON_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        lostReasonResponse: action.response
      };
    case LOST_REASON_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case LEAD_FOLLOW_UP_LOAD:
      return {
        ...state,
        loading: true
      };
    case LEAD_FOLLOW_UP_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        followUpResponse: action.response
      };
    case LEAD_FOLLOW_UP_FAILURE:
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
        updateLeadResponse: action.response
      };
    case UPDATE_LEAD_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case GET_LEAD_LOAD:
      return {
        ...state,
        loading: true
      };
    case GET_LEAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadResponse: action.response
      };
    case GET_LEAD_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case UPDATE_LEAD_FOLLOW_LOAD:
      return {
        ...state,
        loading: true
      };
    case UPDATE_LEAD_FOLLOW_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        updateLeadFollowResponse: action.response
      };
    case UPDATE_LEAD_FOLLOW_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case ACTION_COMMENT_LOAD:
      return {
        ...state,
        loading: true
      };
    case ACTION_COMMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        actionCommentResponse: action.response
      };
    case ACTION_COMMENT_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case LEAD_ACTIVITIES_LOAD:
      return {
        ...state,
        loading: true
      };
    case LEAD_ACTIVITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leadActivitiesResponse: action.response
      };
    case LEAD_ACTIVITIES_FAILURE:
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
