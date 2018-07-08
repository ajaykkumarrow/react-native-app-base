import {
  USER_LOAD,
  CLEAR_USER
} from '../../actions/User/actionTypes';

const initialState = {
  currentUser: null,
  loading: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOAD:
      return {
        ...state,
        currentUser: action.user
      };
    case CLEAR_USER: {
      return {
        ...state,
        currentUser: null
      };
    }
    default:
      return state;
  }
}
