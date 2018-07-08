import React, { Component } from 'react';
import { FlatList, View, TouchableOpacity, Text, Image } from 'react-native';
import styles from './productScreenStyles';
import ProductListCard from '../../components/ProductListCard/ProductListCard';
import close from '../../assets/images/close.png';
import closeBlue from '../../assets/images/close_blue.png';
import { ButtonWithPlainText } from '../../components/button/Button';
// import cardStyles from '../../components/card/cardStyles';
import Dropdown from '../../components/dropdown/Dropdown';

const VEHICLE_DATA = [
  {
    imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_1-min.png',
    description: 'Internal state is not preserved when content scrolls out of the render window.' +
    ' Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.',
    cc: '125',
    kmpl: '32',
    weight: '150',
    rate: '1,14,000',
    id: '0'
  },
  {
    imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_2-min.png',
    description: 'Internal state is not preserved when content scrolls out of the render window.' +
    ' Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.',
    cc: '125',
    kmpl: '32',
    weight: '150',
    rate: '1,14,000',
    id: '1'
  },
  {
    imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_3-min.png',
    description: 'Internal state is not preserved when content scrolls out of the render window.' +
    ' Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.',
    cc: '125',
    kmpl: '32',
    weight: '150',
    rate: '1,14,000',
    id: '2'
  },
  {
    imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_4-min.png',
    description: 'Internal state is not preserved when content scrolls out of the render window.' +
    ' Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.',
    cc: '125',
    kmpl: '32',
    weight: '150',
    rate: '1,14,000',
    id: '3'
  },
  {
    imageUrl: 'https://d1xq83t889f8oi.cloudfront.net/gixxersfsp/new-360-images/suzuki_gixxer_360_5-min.png',
    description: 'Internal state is not preserved when content scrolls out of the render window.' +
    ' Make sure all your data is captured in the item data or external stores like Flux, Redux, or Relay.',
    cc: '125',
    kmpl: '32',
    weight: '150',
    rate: '1,14,000',
    id: '4'
  },
];
const FILTER_DATA = [
  {
    id: '0',
    name: 'bike',
    type: 'Type'
  },
  {
    id: '1',
    name: 'Rs 70,000 - Rs 1Lakh',
    type: 'Budget'
  },
  {
    id: '2',
    name: '',
    type: 'remove all'
  },
];

class ProductScreen extends Component {
  bookTestRideAction = item => {
    console.log(`selectedItem${item.id}`);
  }
  addToCompareAction= item => {
    console.log(`selectedItem${item.id}`);
  }
  removeAllFilterAction=() => {
  }
  removeSelectedFilter = currentItem => {
    console.log(currentItem);
  }
  KeyExtractor = item => item.id;
  filterKeyExtractor = item => item.id;

  filterRenderItem = ({ item }) => {
    if (item.type === 'remove all') {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <ButtonWithPlainText
            title="Remove All Filters"
            style={{
              height: 40, width: 140, borderRadius: 25, alignItems: 'center', justifyContent: 'center'
            }}
            handleSubmit={this.removeAllFilterAction}
            textStyle={{ color: 'white' }}
          />
        </View>
      );
    }
    return (
      <View style={{
        flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 2, margin: 10
      }}
      >
        <Text style={{ marginLeft: 5, marginRight: 5 }}>{item.type} : {item.name}</Text>
        <TouchableOpacity
          style={{ backgroundColor: 'white', marginLeft: 5, marginRight: 5 }}
          onPress={() => this.removeSelectedFilter(item)}
        >
          <Image
            source={closeBlue}
          />
        </TouchableOpacity>
      </View>
    );
  }

  renderItem = ({ item }) => (
    <ProductListCard
      item={item}
      bookTestRideAction={() => this.bookTestRideAction(item)}
      addToCompareAction={() => this.addToCompareAction(item)}
    />
  );

  render() {
    return (
      <View>
        <View style={{ height: 50, backgroundColor: 'gray' }}>
          <View style={{ backgroundColor: '#F8FAFF', flexDirection: 'row', height: 50 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TouchableOpacity style={{ backgroundColor: '#4E92DF', width: 50 }} >
                <Image
                  source={close}
                />
              </TouchableOpacity>
              <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#000', justifyContent: 'center' }}>Anand . </Text>
                  <Text style={{ color: '#000', justifyContent: 'center' }}> 9898989898 </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#000', justifyContent: 'center' }}>Male </Text>
                </View>
              </View>
            </View>
            <View style={{
              flex: 1, flexDirection: 'row', justifyContent: 'flex-end',
            }}
            >
              <View style={{
                flexDirection: 'row',
                backgroundColor: '#EAEEF9',
                borderRadius: 5,
                margin: 10,
                width: 60,
                alignItems: 'center',
              }}
              >
                <View style={{
                  width: 10, height: 10, backgroundColor: '#D0E1FE', margin: 5
                }}
                />
                <Text>
                  Filter
                </Text>
              </View>
              <View style={{
                flexDirection: 'row',
                backgroundColor: '#EAEEF9',
                borderRadius: 5,
                margin: 10,
                width: 60,
                alignItems: 'center',
              }}
              >
                <View style={{
                  width: 10, height: 10, backgroundColor: '#D0E1FE', margin: 5
                }}
                />
                <Text>
                  Save
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{
          height: 50, flexDirection: 'row', marginRight: 140, alignItems: 'center'
        }}
        >
          <FlatList
            style={styles.FilterFlatListStyles}
            horizontal
            keyExtractor={this.filterKeyExtractor}
            data={FILTER_DATA}
            renderItem={this.filterRenderItem}
            extraData={this.state}
          />
        </View>
        <Dropdown
          data={[{ id: 1, key: '50' }, { id: 2, key: '70' }]}
          label="Sort by"
          defaultValue="Mileage"
          absoluteRightValue={10}
          absoluteTopValue={50}
          width={120}
          scrollViewWidth={120}
        />
        <FlatList
          style={styles.FlatListStyles}
          horizontal
          keyExtractor={this.KeyExtractor}
          data={VEHICLE_DATA}
          renderItem={this.renderItem}
          extraData={this.state}
        />
      </View>
    );
  }
}
export default ProductScreen;
