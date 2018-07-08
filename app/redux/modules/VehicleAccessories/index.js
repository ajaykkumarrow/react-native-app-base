import {
  GETVEHICLEACCESORIES_LOAD,
  GETVEHICLEACCESORIES_SUCCESS,
  GETVEHICLEACCESORIES_FAIL,
  SAVEVEHICLEACCESORIES_LOAD,
  SAVEVEHICLEACCESORIES_SUCCESS,
  SAVEVEHICLEACCESORIES_FAIL
} from '../../actions/VehicleAccessories/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GETVEHICLEACCESORIES_LOAD:
      return {
        ...state,
        loading: true,
      };
    case GETVEHICLEACCESORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        accessories: action.response
      };
    case GETVEHICLEACCESORIES_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case SAVEVEHICLEACCESORIES_LOAD:
      return {
        ...state,
        loading: true,
      };
    case SAVEVEHICLEACCESORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        savedAccessories: action.response
      };
    case SAVEVEHICLEACCESORIES_FAIL:
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
