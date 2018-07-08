import {
  DEALER_LOAD,
  DEALER_SUCCESS,
  DEALER_FAIL
} from '../../actions/Onboarding/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case DEALER_LOAD:
      return {
        ...state,
        loading: true
      };
    case DEALER_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        dealer: action.response
      };
    case DEALER_FAIL:
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
