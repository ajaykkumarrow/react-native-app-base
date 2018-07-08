import {
  ON_SIDENAV_TOGGLE,
  HANDLE_SIDENAV
} from '../../actions/Global/actionTypes';

const initialState = {
  isSideNavOpen: true
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ON_SIDENAV_TOGGLE:
      return {
        ...state,
        isSideNavOpen: !state.isSideNavOpen
      };
    case HANDLE_SIDENAV:
      return {
        ...state,
        isSideNavOpen: action.isSideNavOpen
      };
    default:
      return state;
  }
}
