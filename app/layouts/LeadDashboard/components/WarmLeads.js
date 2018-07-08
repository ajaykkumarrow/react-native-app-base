import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '../../../components/card/Card';
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

export default class WarmLeads extends Component {
  static navigationOptions = props => ({
    title: props.navigation.getParam(
      'Warm ',
      `Warm (${props.screenProps.count && props.screenProps.count.length > 0 ?
        props.screenProps.count[0].warm_leads : 0})`
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
    getCount: PropTypes.func.isRequired,
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
      data: [],
      widthOfLayout: 0,
      executiveData: [],
      refreshList: false,
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
        return this.props.getLeads('warm');
      }).then(() => {
        if (this.props.leads.length > 0) {
          return this.props.getExecutives(dealer).then(() => {
            const filterObj = {
              manufacturer_id: this.props.leads[0].manufacturer_id
            };
            return this.props.getCount(filterObj);
          }).then(() => {
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
      tab="warm"
      onViewClicked={() => { this.onViewLeadClicked(item); }} />
  )

  render() {
    return (
      <View
        style={{
          flex: 1,
          paddingVertical: 10,
          backgroundColor: '#F2F2F2'
        }}
        onLayout={event => this.getWidth(event.nativeEvent.layout)}>
        {
          this.state.data.length > 0 ?
            <FlatList
              data={this.state.data}
              renderItem={({ item }) => this.showCard(item)}
              keyExtractor={item => item.id}
              horizontal={false}
              numColumns={3}
              extraData={this.state.refreshList}
            />
            :
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{
                alignSelf: 'center',
                fontSize: 18,
                fontFamily: 'SourceSansPro-Bold',
                color: '#4a4a4a'
              }}> {
              this.props.loading ?
                '' :
                'No Warm Leads Found... :('
              }
              </Text>
            </View>
        }
      </View>
    );
  }
}
