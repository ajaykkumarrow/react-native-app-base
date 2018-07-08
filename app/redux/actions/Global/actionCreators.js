import * as ActionTypes from './actionTypes';

export function toggleSideNav() {
  return {
    type: ActionTypes.ON_SIDENAV_TOGGLE
  };
}

export function handleSideNav(isSideNavOpen) {
  return {
    type: ActionTypes.HANDLE_SIDENAV,
    isSideNavOpen
  };
}
