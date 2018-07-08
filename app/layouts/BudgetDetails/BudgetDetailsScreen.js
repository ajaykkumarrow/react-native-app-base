import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import ContinueSectionScreen from '../../components/ContinueSection/ContinueSectionScreen';
import styles from './budgetDetailsStyles';
import { updateLead } from '../../redux/actions/CreateNewLead/actionCreators';
import { resetScreens } from '../../actions/stackActions';

const ranges = [{
  id: 0,
  name: 'All',
  values: [0, 1000000]
},
{
  id: 1,
  name: '< ₹ 70,000',
  values: [0, 70000]
},
{
  id: 2,
  name: '₹ 70,000 - ₹ 1,00,000',
  values: [70000, 100000]
},
{
  id: 3,
  name: '> ₹ 1,00,000',
  values: [100000, 1000000]
},
];

@connect(null, {
  updateLead
})
class BudgetDetailsScreen extends Component {
  static propTypes = {
    // handleOnContinue: PropTypes.func.isRequired,
    handleOnBack: PropTypes.func.isRequired,
    dealerId: PropTypes.string.isRequired,
    updateLead: PropTypes.func.isRequired,
    lead: PropTypes.object,
    navigation: PropTypes.object.isRequired
  }

  static defaultProps = {
    lead: {},
  }

  constructor(props) {
    super(props);
    const { lead } = this.props;
    this.state = {
      values: lead && Object.keys(lead).length !== 0 && lead.search_criteria_budget ?
        this.getBudgetValues(lead.search_criteria_budget) : [0, 1000000],
      lead: {
        ...this.props.lead
      }
    };
  }

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.lead) {
      return {
        lead: nextProps.lead
      };
    }
    return null;
  }

  getBudgetValues = value => {
    const budgetRanges = value.split('-');
    budgetRanges.forEach((range, index) => {
      budgetRanges[index] = parseInt(range, 10);
    });
    return budgetRanges;
  }

  multiSliderValuesChange = values => {
    this.setState({
      values,
      lead: {
        ...this.state.lead,
        search_criteria_budget: `${values[0]}-${values[1]}`
      }
    });
  }

  gotoViewProducts = () => {
    const { lead } = this.state;
    const { navigate } = this.props.navigation;
    this.props.updateLead(lead.id, lead).then(() => {
      if (lead.search_criteria_budget === undefined) {
        lead.search_criteria_budget = '0-1000000';
      }
      const filterData = {
        type: lead.search_criteria_type,
        typeName: lead.search_criteria_type === '0' ? 'bike' : 'scooter',
        budget: lead.search_criteria_budget
      };
      /**
       * Resting screens so that while clicking back buttton redirects to dashboard screen
       */
      const resetAction = resetScreens({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
      });
      this.props.navigation.dispatch(resetAction);
      navigate('FilteredProducts', { lead, filterData });
    }, error => {
      console.log(error);
    });
  }

  CustomMarker = () => <View style={styles.customMarker} />;

  render() {
    const { width } = Dimensions.get('window');
    const { values, lead } = this.state;
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <View style={styles.dataContainer}>
            <Text style={styles.sliderValue}>₹ {this.state.values[0]} - ₹ {this.state.values[1]}</Text>
            <View style={styles.sliderViewStyle}>
              <MultiSlider
                style={[styles.sliderStyle, { flex: 1 }]}
                values={[values[0], values[1]]}
                onValuesChange={this.multiSliderValuesChange}
                min={0}
                max={1000000}
                step={500}
                sliderLength={(width / 10) * 8}
                selectedStyle={styles.selectedStyle}
                unselectedStyle={styles.unselectedStyle}
                trackStyle={styles.trackStyle}
                customMarker={this.CustomMarker}
                allowOverlap
                snapped
              />
            </View>
            <View style={styles.amountRangeViewStyle}>
              {
                ranges && ranges.map((range, index) => (
                  index !== 0 ?
                    <TouchableOpacity
                      style={range.values[0] <= values[0] && range.values[1] >= values[1]
                        ? [styles.selectedCard, styles.buttonStyle] : styles.buttonStyle}
                      onPress={() => {
                        this.setState({
                          values: range.values,
                          lead: {
                            ...lead,
                            search_criteria_budget: `${range.values[0]}-${range.values[1]}`
                          }
                        });
                      }}
                      activeOpacity={0.5}
                      key={range.id}
                    >
                      <Text>{range.name}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                      style={range.values[0] === values[0] && range.values[1] === values[1]
                        ? [styles.selectedCard, styles.buttonStyle] : styles.buttonStyle}
                      onPress={() => {
                        this.setState({
                          values: range.values,
                          lead: {
                            ...lead,
                            search_criteria_budget: `${range.values[0]}-${range.values[1]}`
                          }
                        });
                      }}
                      activeOpacity={0.5}
                      key={range.id}
                    >
                      <Text>{range.name}</Text>
                    </TouchableOpacity>

                ))
              }
            </View>

          </View>
          <View style={{ flex: 4, justifyContent: 'flex-start' }}>
            <ContinueSectionScreen
              title="VIEW PRODUCTS"
              continueBtnAction={this.gotoViewProducts}
              backBtnAction={this.props.handleOnBack}
            />
          </View>
        </View>
      </View>

    );
  }
}
export default BudgetDetailsScreen;
