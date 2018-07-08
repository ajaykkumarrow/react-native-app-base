import {
  LOGIN_LOAD,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  RESET_PASSWORD_LOAD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL
} from '../../actions/Login/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_LOAD:
      return {
        ...state,
        loading: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        token: action.response.accessToken.id,
        user: action.response.user
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      };
    case RESET_PASSWORD_LOAD:
      return {
        ...state,
        loading: true
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        newAuthToken: action.response.accessToken.id,
        user: action.response.user
      };
    case RESET_PASSWORD_FAIL:
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
