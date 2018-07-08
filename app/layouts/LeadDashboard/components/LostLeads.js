import React, { Component, Fragment } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '../../../components/card/Card';
import styles from '../../NewLeadsOverview/newLeadOverviewStyles';
import storage from '../../../helpers/AsyncStorage';
import { getLeads, getExecutives, getCount } from '../../../redux/actions/Leads/actionCreators';

@connect(
  state => ({
    leads: state.leads.leads,
    executives: state.leads.executives,
    count: state.leads.count,
    currentUser: state.user.currentUser
  }),
  {
    getLeads, getExecutives, getCount
  }
)

export default class LostLeads extends Component {
  static navigationOptions = props => ({
    title: props.navigation.getParam(
      'Lost ',
      `Lost (${props.screenProps.count && props.screenProps.count.length > 0 ?
        props.screenProps.count[0].lost_leads : 0})`
    ),
    tabBarOnPress: ({ defaultHandler }) => {
      props.navigation.state.params.onFocus();
      defaultHandler();
    },
    swipeEnabled: false
  })

  static propTypes = {
    getLeads: PropTypes.func.isRequired,
    getExecutives: PropTypes.func.isRequired,
    leads: PropTypes.array,
    executives: PropTypes.array,
    navigation: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    screenProps: PropTypes.object.isRequired
  }

  static defaultProps = {
    leads: [],
    executives: []
  }

  constructor(props) {
    super(props);
    this.state = {
      // data: [],
      widthOfLayout: 0,
      executiveData: [],
      refreshList: false,
      categoryList: [],
      priceCount: 0,
      productCount: 0,
      serviceCount: 0,
      data: {}
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onFocus: this.onDropDownChange.bind(this)
    });
  }

  onDropDownChange = () => {
    let dealer;
    storage.getItem('currentUser')
      .then(value => {
        const { dealerId } = value;
        dealer = dealerId;
        return this.props.getLeads('lost');
      }).then(() => {
        if (this.props.leads) {
          return this.props.getExecutives(dealer).then(() => {
            // to remove
            this.getCountsForEachCategory(this.props.leads);
            this.setState({
              data: this.props.leads,
              executiveData: this.props.executives,
              refreshList: !this.state.refreshList
            });
          });
        }
        this.setState({
          data: this.props.leads,
          refreshList: !this.state.refreshList
        });
      })
      .catch(error => {
        console.log('err', error);
      });
  }

  onViewLeadClicked = lead => {
    try {
      const { currentUser: { dealerId } } = this.props;
      this.props.screenProps.stackNavigation.navigate(
        'LeadHistory',
        { lead, currentDealerId: dealerId }
      );
    } catch (error) {
      console.log('Cannot View Lead Details', error);
    }
  }

  getCountsForEachCategory=overAllList => {
    let {
      priceCount, productCount, serviceCount
    } = this.state;
    const newArray = [];
    if (('Product' in overAllList) && overAllList.Product.length !== 0) {
      productCount = overAllList.Product.length;
      newArray.push('Product');
    }
    if (('Price' in overAllList) && overAllList.Price.length !== 0) {
      priceCount = overAllList.Price.length;
      newArray.push('Price');
    }
    if (('Service' in overAllList) && overAllList.Service.length !== 0) {
      serviceCount = overAllList.Service.length;
      newArray.push('Service');
    }
    this.setState({
      productCount,
      priceCount,
      serviceCount,
      categoryList: newArray
    });
  }

  getLeadOverViewList = () => (
    <View style={styles.leadOverviewStyle}>
      {
        this.state.categoryList.map((currentItem, index) => (
          <View
            style={styles.leadCardOverviewStyle}
            // eslint-disable-next-line
            key={index}>
            <View style={[styles.leadHeaderView]} >
              <Text style={[styles.pendingTextStyle, { flex: 1 }]}>
                {this.updateCategoryCount(currentItem)}
              </Text>
            </View>
            <FlatList
              style={styles.flatListViewStyles}
              keyExtractor={item => item.id}
              data={this.state.data[currentItem]}
              renderItem={({ item }) => this.showCard(item)}
              extraData={this.state}
              scrollEnabled
            />
          </View>
        ))
      }
    </View>
  )

  getWidth = layout => {
    const { width } = layout;
    this.setState({
      widthOfLayout: (width / 3) - 20
    });
  }
  // To be implemented
  getExecutiveForSelectedLead = () => {
    console.log('executive');
  }

  updateCategoryCount=category => {
    switch (category) {
      case 'Product':
        return `Due to Product(${this.state.productCount})`;
      case 'Price':
        return `Due to Price(${this.state.priceCount})`;
      case 'Service':
        return `Due to Service(${this.state.serviceCount})`;
      default:
        break;
    }
  }

  // To be implemented
  ViewBtnTapped = () => {
    console.log('tapped');
  }

  showCard = item => (
    <Card
      item={item}
      dropdownData={this.state.executiveData}
      widthOfCard={this.state.widthOfLayout}
      onDropDownChange={() => this.onDropDownChange()}
      tab="lost"
      onViewClicked={() => { this.onViewLeadClicked(item); }} />
  )

  render() {
    return (
      <Fragment>
        {
          this.state.categoryList.length === 0 && !this.props.loading &&
          <View style={{
            flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
          }}>
            <Text style={{
              fontSize: 18,
              fontFamily: 'SourceSansPro-Bold',
              color: '#4a4a4a'
            }}> No Lost Leads Found... :(
            </Text>
          </View>
        }
        {
          this.state.categoryList.length > 0 &&
          <ScrollView
            style={{
              flex: 1,
              flexDirection: 'row',
            }}
            scrollEnabled
            horizontal
            overScrollMode="always">
            {this.getLeadOverViewList()}
          </ScrollView>
         }
      </Fragment>
    );
  }
}
