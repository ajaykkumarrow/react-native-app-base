import {
  LEAD_MONTHLY_SUMMARY_LOAD,
  LEAD_MONTHLY_SUMMARY_SUCCESS,
  LEAD_MONTHLY_SUMMARY_FAIL
} from '../../actions/HomeDashBoard/actionTypes.js';

const initialState = {
  leadsSummaryCount: {
    followup: 0,
    followupDone: 0,
    newLeads: 0,
    invoicedLeads: 0
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LEAD_MONTHLY_SUMMARY_LOAD:
      return {
        ...state
      };
    case LEAD_MONTHLY_SUMMARY_SUCCESS:
      return {
        ...state,

        leadsSummaryCount: action.response
      };
    case LEAD_MONTHLY_SUMMARY_FAIL:
      return {
        ...state,
        leadsSummaryCount: initialState.leadsSummaryCount
      };
    default:
      return state;
  }
}
