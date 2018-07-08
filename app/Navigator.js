import { StackNavigator } from 'react-navigation';
import SplashScreen from './layouts/Splashscreen/SplashScreen';
import LoginScreen from './layouts/Login/LoginScreen';
import DashboardScreen from './layouts/Dashboard/DashboardScreen';
import LeadOnBoardScreen from './layouts/LeadOnBoard/LeadOnBoard';
import SlidingExample from './components/slider/Slider';
import ProductScreen from './layouts/ProductScreen/ProductScreen';
import ProductListingScreen from './layouts/ProductListing/ProductListingScreen';
import DealershipDetails from './layouts/DealershipDetails/DealershipDetails';
import TeamMemberScreen from './layouts/TeamMember/TeamMemberScreen';
import BikePriceScreen from './layouts/PriceDetails/BikePriceDetails';
import MyProductsScreen from './layouts/MyProducts/MyProductsScreen';
import UpdateInventoryScreen from './layouts/UpdateInventory/UpdateInventoryScreen';
import TestRideTimingsScreen from './layouts/TestRideTimings/TestRideTimingsScreen';
import OnboardingScreen from './layouts/Onboarding/OnboardingScreen';
import ChooseFinancierScreen from './layouts/ChooseFinancier/ChooseFinancierScreen';
import ProductDetailScreen from './layouts/ProductDetail/ProductDetailScreen';
import CreateNewLeadScreen from './layouts/CreateNewLead/CreateNewLead';
import FilteredProductsScreen from './layouts/FilteredProductsScreen/FilteredProductsScreen';
import EditTarget from './layouts/EditTarget/EditTarget';
import NewLeadsOverview from './layouts/NewLeadsOverview/NewLeadOverview';
import LeadFollowUpScreen from './layouts/LeadFollowUp/LeadFollowUp';
import SearchLead from './layouts/SearchLead/SearchLead';
import LeadHistoryScreen from './layouts/LeadHistory/LeadHistoryScreen';
import TransitionConfiguration from './helpers/TransistionConfig';
import LeadDashboard from './layouts/LeadDashboard/LeadDashboard';

const RootStack = StackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen
    },
    Login: {
      screen: LoginScreen,
    },
    /*     LeadDetailAction: {
      screen: LeadDetailAction
    }, */
    LeadFollowUpScreen: {
      screen: LeadFollowUpScreen
    },
    NewLeadsOverview: {
      screen: NewLeadsOverview
    },
    LeadHistory: {
      screen: LeadHistoryScreen
    },
    BikePriceScreen: {
      screen: BikePriceScreen
    },
    FilteredProducts: {
      screen: FilteredProductsScreen
    },
    LeadOnBoard: {
      screen: LeadOnBoardScreen,
    },
    CreateNewLead: {
      screen: CreateNewLeadScreen
    },
    ProductDetailScreen: {
      screen: ProductDetailScreen,
    },
    Dashboard: {
      screen: DashboardScreen,
    },
    MyProductsScreen: {
      screen: MyProductsScreen
    },
    OnboardingScreen: {
      screen: OnboardingScreen,
    },
    TestRideTimings: {
      screen: TestRideTimingsScreen,
    },
    ChooseFinancierScreen: {
      screen: ChooseFinancierScreen
    },
    DealershipDetails: {
      screen: DealershipDetails,
    },
    ProductListingScreen: {
      screen: ProductListingScreen
    },
    TeamMemberScreen: {
      screen: TeamMemberScreen,
    },
    Slider: {
      screen: SlidingExample
    },
    ProductScreen: {
      screen: ProductScreen,
    },
    UpdateInventoryScreen: {
      screen: UpdateInventoryScreen,
    },
    TargetScreen: {
      screen: EditTarget
    },
    SearchLead: {
      screen: SearchLead
    },
    LeadDashboard: {
      screen: LeadDashboard
    }
  },
  {
    headerMode: 'none',
    mode: 'modal',
    transitionConfig: TransitionConfiguration
  },
);

export default RootStack;
