import
{
  GETLEADS_LOAD,
  GETLEADS_SUCCESS,
  GETLEADS_FAIL,
  GETEXECUTIVES_LOAD,
  GETEXECUTIVES_SUCCESS,
  GETEXECUTIVES_FAIL,
  GETCOUNT_LOAD,
  GETCOUNT_SUCCESS,
  GETCOUNT_FAIL,
  FILTERLEAD_LOAD,
  FILTERLEAD_SUCCESS,
  FILTERLEAD_FAIL,
  CLEAR_LEAD
}
  from '../../actions/Leads/actionTypes';

const initialState = {
  data: [],
  loading: false,
  loaded: false,
  error: false,
  searchedLeads: {},
  leads: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GETLEADS_LOAD:
      return {
        ...state,
        loading: true
      };
    case GETLEADS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        leads: action.response
      };
    case GETLEADS_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case GETEXECUTIVES_LOAD:
      return {
        ...state,
        loading: true
      };
    case GETEXECUTIVES_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        executives: action.response
      };
    case GETEXECUTIVES_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case GETCOUNT_LOAD:
      return {
        ...state,
        loading: true
      };
    case GETCOUNT_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        count: action.response
      };
    case GETCOUNT_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: true
      };
    case FILTERLEAD_LOAD:
      return {
        ...state,
        loading: true
      };
    case FILTERLEAD_SUCCESS:
      return {
        ...state,
        loading: false,
        searchedLeads: action.response.leads
      };
    case FILTERLEAD_FAIL:
      return {
        ...state,
        loading: false,
      };
    case CLEAR_LEAD: {
      return {
        ...state,
        searchedLeads: {}
      };
    }
    default:
      return state;
  }
}
