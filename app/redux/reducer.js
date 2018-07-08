import { combineReducers } from 'redux';
import login from './modules/Login';
import getVehicles from './modules/GetVehicles';
import financier from './modules/Financier';
import inventory from './modules/Inventory';
import onboarding from './modules/Onboarding';
import rideTimings from './modules/RideTimings';
import teamMember from './modules/TeamMember';
import dealerInfo from './modules/DealershipDetails';
import vehicleAccessories from './modules/VehicleAccessories';
import ProductDetail from './modules/ProductDetail';
import createLead from './modules/CreateNewLead';
import filteredVehicles from './modules/filteredVehicles';
import priceBreakdown from './modules/PriceBreakdown';
import target from './modules/Target';
import user from './modules/User';
import global from './modules/Global';
import followUpLeads from './modules/FollowUpLeads';
import newLeadOverView from './modules/NewLeadOverview';
import leads from './modules/Leads';
import leadHistory from './modules/LeadHistory';
import homeDashboard from './modules/HomeDashboard';
import leadAction from './modules/LeadAction';

const rootReducer = combineReducers({
  login,
  getVehicles,
  financier,
  inventory,
  onboarding,
  rideTimings,
  teamMember,
  dealerInfo,
  vehicleAccessories,
  ProductDetail,
  createLead,
  filteredVehicles,
  priceBreakdown,
  target,
  user,
  global,
  followUpLeads,
  newLeadOverView,
  leads,
  leadHistory,
  homeDashboard,
  leadAction
});

export default rootReducer;
