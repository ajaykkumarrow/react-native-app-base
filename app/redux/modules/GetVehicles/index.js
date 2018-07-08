import
{
  GETMANUFACTURERID_LOAD,
  GETMANUFACTURERID_SUCCESS,
  GETMANUFACTURERID_FAIL,
  GETVEHICLES_LOAD,
  GETVEHICLES_SUCCESS,
  GETVEHICLES_FAIL
}
  from '../../actions/GetVehicles/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GETMANUFACTURERID_LOAD:
      return {
        ...state,
        loading: true
      };
    case GETMANUFACTURERID_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        manufacturer_id: action.response.manufacturer_id
      };
    case GETMANUFACTURERID_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case GETVEHICLES_LOAD:
      return {
        ...state,
        loading: true
      };
    case GETVEHICLES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        vehicleData: action.response
      };
    case GETVEHICLES_FAIL:
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
