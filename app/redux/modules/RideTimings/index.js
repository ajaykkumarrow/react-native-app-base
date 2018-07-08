import {
  TIMINGS_LOAD,
  TIMINGS_SUCCESS,
  TIMINGS_FAIL
} from '../../actions/TestRideTimings/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TIMINGS_LOAD:
      return {
        ...state,
        loading: true
      };
    case TIMINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.response
      };
    case TIMINGS_FAIL:
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

