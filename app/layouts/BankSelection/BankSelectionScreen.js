import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Stepper from '../../components/Stepper/StepperScreen';
import { styles } from './bankSelectionStyles';
import ContinueBtnComponent from '../../components/ContinueSection/ContinueSectionScreen';

const DATA = [
  {
    id: 1,
    Financier: 'HDFC',
    Loan: 'Rs. 100,000',
    InteresrRate: '10%-12%',
    Tenure: '1.5 years',
    EMI: 'Rs.2000/-',
    Downpayment: 'Rs. 30,000'
  },
  {
    id: 2,
    Financier: 'HDFC',
    Loan: 'Rs. 100,000',
    InteresrRate: '10%-12%',
    Tenure: '1.5 years',
    EMI: 'Rs.2000/-',
    Downpayment: 'Rs. 30,000'
  },
  {
    id: 3,
    Financier: 'HDFC',
    Loan: 'Rs. 100,000',
    InteresrRate: '10%-12%',
    Tenure: '1.5 years',
    EMI: 'Rs.2000/-',
    Downpayment: 'Rs. 30,000'
  },
  {
    id: 4,
    Financier: 'HDFC',
    Loan: 'Rs. 100,000',
    InteresrRate: '10%-12%',
    Tenure: '1.5 years',
    EMI: 'Rs.2000/-',
    Downpayment: 'Rs. 30,000'
  },
  {
    id: 5,
    Financier: 'HDFC',
    Loan: 'Rs. 100,000',
    InteresrRate: '10%-12%',
    Tenure: '1.5 years',
    EMI: 'Rs.2000/-',
    Downpayment: 'Rs. 30,000'
  },
  {
    id: 6,
    Financier: 'HDFC',
    Loan: 'Rs. 100,000',
    InteresrRate: '10%-12%',
    Tenure: '1.5 years',
    EMI: 'Rs.2000/-',
    Downpayment: 'Rs. 30,000'
  },
];

class BankSelectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: DATA,
      selectedId: 0,
    };
  }
    // On radio Btn tap
    OntRadioBtntap = rowItem => {
      this.setState({
        selectedId: rowItem.id
      });
    }

    _keyExtractor = item => item.id

    // Render list item
    renderItem = data => {
      const { item, index } = data;
      return (
        <View style={(this.state.selectedId === item.id) ? styles.selectedItemBlock : styles.unSelectedItemBlock}>
          <View
            style={(this.state.selectedId === item.id) ? styles.selectedRadioBtnView : styles.unSelectedRadioBtnView}
          >
            <TouchableOpacity
              style={
                (this.state.selectedId - 1 === index) ? [styles.selectedrRadioBtnStyle] : styles.unSelectedRadioBtnStyle
              }
              title={item.id.toString()}
              onPress={() => this.OntRadioBtntap(item)}
            />
          </View>
          <View style={(this.state.selectedId === index) ? styles.selectedItemMeta : styles.itemMeta}>
            <View style={styles.itemNameView}>
              <Text style={styles.itemName}>{item.Financier}</Text>
            </View>
            <View style={styles.itemNameView}>
              <Text style={styles.itemName}>{item.Loan}</Text>
            </View>
            <View style={styles.itemNameView}>
              <Text style={styles.itemName}>{item.InteresrRate}</Text>
            </View>
            <View style={styles.itemNameView}>
              <Text style={styles.itemName}>{item.Tenure}</Text>
            </View>
            <View style={styles.itemNameView}>
              <Text style={styles.itemName}>{item.EMI}</Text>
            </View>
            <View style={styles.itemNameView}>
              <Text style={styles.itemName}>{item.Downpayment}</Text>
            </View>
          </View>
        </View>
      );
    }

    renderHeader = () => (
      <View style={styles.headerView}>
        <View style={styles.itemMeta}>
          <View style={[styles.itemNameView, { flexDirection: 'row' }]}>
            <Text style={styles.headertext} />
          </View>
          <View style={styles.itemNameView}>
            <Text style={styles.headertext}>Financier</Text>
          </View>
          <View style={styles.itemNameView}>
            <Text style={styles.headertext}>Loan</Text>
          </View>
          <View style={styles.itemNameView}>
            <Text style={styles.headertext}>InteresrRate</Text>
          </View>
          <View style={styles.itemNameView}>
            <Text style={styles.headertext}>Tenure</Text>
          </View>
          <View style={styles.itemNameView}>
            <Text style={styles.headertext}>EMI</Text>
          </View>
          <View style={styles.itemNameView}>
            <Text style={styles.headertext}>Downpayment</Text>
          </View>
        </View>
      </View>
    )

    render() {
      return (
        <View style={styles.container}>
          <View style={{ backgroundColor: '#F8FAFF', flexDirection: 'row', height: 50 }}>
            <TouchableOpacity style={{ backgroundColor: 'yellow', width: 50 }} >
              <Text style={{
                color: 'red', alignItems: 'center', fontWeight: 'bold', fontSize: 20, padding: 10
              }}
              >{'<--'}
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ padding: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#000', justifyContent: 'center' }}>Anand . </Text>
                  <Text style={{ color: '#000', justifyContent: 'center' }}> 9898989898 </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#000', justifyContent: 'center' }}>Male </Text>
                </View>
              </View>
              <View style={{ width: 1, backgroundColor: '#EDF1F9', margin: 2 }} />
              <View style={{ margin: 5, flexDirection: 'row' }}>
                <View style={{
                  backgroundColor: '#EAEEF9',
                  width: 30,
                  height: 30,
                  alignItems: 'center',
                  paddingBottom: 5,
                  borderRadius: 15
                }}
                />
                <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                  <Text style={{ color: '#000', justifyContent: 'center' }}>Suzuki Intruder 150 </Text>
                  <Text style={{ color: '#000', justifyContent: 'center' }}>Rs.1,50,000 </Text>
                </View>
              </View>
              <View style={{ flex: 1 }} />
            </View>
            <TouchableOpacity
              style={styles.bookARideBtnStyle}
              underlayColor="#fff"
            >
              <Text style={{ color: 'white', alignSelf: 'center', paddingTop: 5 }}>Book Test Ride</Text>
            </TouchableOpacity>
            <View style={{
              flexDirection: 'row', backgroundColor: '#EAEEF9', borderRadius: 5, margin: 10, width: 60
            }}
            >
              <View style={{
                width: 10, height: 10, backgroundColor: '#D0E1FE', margin: 5, alignSelf: 'center'
              }}
              />
              <Text style={{ alignSelf: 'center' }}>
                  Save
              </Text>
            </View>
          </View>
          <View style={{ flex: 9, backgroundColor: 'yellow', margin: 20 }}>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#F8FAFF' }}>
              <View style={{ flex: 1, backgroundColor: '#F6F8FF' }} />
              <View style={{ flex: 10, flexDirection: 'column' }}>
                <View style={{ flex: 2 }}>
                  <Stepper
                    style={{ backgroundColor: 'red' }}
                    firstImage={this.state.firstImage}
                    secondImage={this.state.secondImage}
                    thirdImage={this.state.thirdImage}
                  />
                </View>
                <View style={{ flex: 4 }}>
                  <FlatList
                    keyExtractor={this._keyExtractor}
                    data={this.state.data}
                    renderItem={this.renderItem}
                    extraData={this.state}
                    ListHeaderComponent={this.renderHeader}
                  />
                </View>
                <View style={{ flex: 2 }}>
                  <ContinueBtnComponent />
                </View>
              </View>
              <View style={{ flex: 1, backgroundColor: '#F6F8FF' }} />
            </View>
          </View>
        </View>
      );
    }
}
export default BankSelectionScreen;
