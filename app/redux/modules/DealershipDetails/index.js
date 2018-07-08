import {
  ZONES_LOAD,
  ZONES_SUCCESS,
  ZONES_FAIL,
  STATES_LOAD,
  STATES_SUCCESS,
  STATES_FAIL,
  CITIES_LOAD,
  CITIES_SUCCESS,
  CITIES_FAIL,
  SAVE_DEALERSHIP_LOAD,
  SAVE_DEALERSHIP_SUCCESS,
  SAVE_DEALERSHIP_FAIL
} from '../../actions/DealershipDetails/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ZONES_LOAD:
      return {
        ...state,
        loading: true
      };
    case ZONES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        zones: action.response
      };
    case ZONES_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case STATES_LOAD:
      return {
        ...state,
        loading: true
      };
    case STATES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        states: action.response
      };
    case STATES_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case CITIES_LOAD:
      return {
        ...state,
        loading: true
      };
    case CITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        cities: action.response
      };
    case CITIES_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case SAVE_DEALERSHIP_LOAD:
      return {
        ...state,
        loading: true
      };
    case SAVE_DEALERSHIP_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    case SAVE_DEALERSHIP_FAIL:
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
