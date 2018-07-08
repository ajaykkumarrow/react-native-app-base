import {
  GET_TEAM_MEMBERS_LOAD,
  GET_TEAM_MEMBERS_SUCCESS,
  GET_TEAM_MEMBERS_FAILURE,
  CREATE_TEAM_MEMBER_LOAD,
  CREATE_TEAM_MEMBER_SUCCESS,
  CREATE_TEAM_MEMBER_FAILURE,
  CREATE_TEAM_HEAD_LOAD,
  CREATE_TEAM_HEAD_SUCCESS,
  CREATE_TEAM_HEAD_FAILURE,
  EDIT_TEAM_MEMBER_LOAD,
  EDIT_TEAM_MEMBER_SUCCESS,
  EDIT_TEAM_MEMBER_FAILURE,
  SEND_CRENDENTIAL_LOAD,
  SEND_CRENDENTIAL_SUCCESS,
  SEND_CRENDENTIAL_FAILURE,
  RESEND_CRENDENTIAL_LOAD,
  RESEND_CRENDENTIAL_SUCCESS,
  RESEND_CRENDENTIAL_FAILURE,
  DIRECT_REPORTING_LOAD,
  DIRECT_REPORTING_SUCCESS,
  DIRECT_REPORTING_FAILURE,
  DELETE_TEAM_MEMBER_LOAD,
  DELETE_TEAM_MEMBER_SUCCESS,
  DELETE_TEAM_MEMBER_FAILURE
} from '../../actions/TeamMembers/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
        users: action.response
      };
    case GET_TEAM_MEMBERS_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case CREATE_TEAM_MEMBER_LOAD:
      return {
        ...state,
        loading: true
      };
    case CREATE_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        salesMember: action.response
      };
    case CREATE_TEAM_MEMBER_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case CREATE_TEAM_HEAD_LOAD:
      return {
        ...state,
        loading: true
      };
    case CREATE_TEAM_HEAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        salesLead: action.response
      };
    case CREATE_TEAM_HEAD_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case EDIT_TEAM_MEMBER_LOAD:
      return {
        ...state,
        loading: true
      };
    case EDIT_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        editTeamMemberResponse: action.response
      };
    case EDIT_TEAM_MEMBER_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case SEND_CRENDENTIAL_LOAD:
      return {
        ...state,
        loading: true
      };
    case SEND_CRENDENTIAL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        sendCredentialResponse: action.response
      };
    case SEND_CRENDENTIAL_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case RESEND_CRENDENTIAL_LOAD:
      return {
        ...state,
        loading: true
      };
    case RESEND_CRENDENTIAL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        resendCredentialResponse: action.response
      };
    case RESEND_CRENDENTIAL_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case DIRECT_REPORTING_LOAD:
      return {
        ...state,
        loading: true
      };
    case DIRECT_REPORTING_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        directReportingMembers: action.response
      };
    case DIRECT_REPORTING_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case DELETE_TEAM_MEMBER_LOAD:
      return {
        ...state,
        loading: true
      };
    case DELETE_TEAM_MEMBER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        deleteTeamMember: action.response
      };
    case DELETE_TEAM_MEMBER_FAILURE:
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
