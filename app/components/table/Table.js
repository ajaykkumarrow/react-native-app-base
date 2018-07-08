
import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import { View, TouchableOpacity,
  FlatList, Text } from 'react-native';
import tableStyle from './tableStyle';

const DEVICE_HEIGHT = Dimensions.get('screen').height;

export default class Table extends Component {
  static propTypes = {
    tableStyle: PropTypes.object,
    headerStyle: PropTypes.object,
    tableBodyStyle: PropTypes.object,
    itemSeparatorStyle: PropTypes.object,
    cols: PropTypes.array.isRequired,
    onSortClick: PropTypes.func,
    renderFooter: PropTypes.func,
    onDataChange: PropTypes.bool,
    totalRecords: PropTypes.number
  };

  static defaultProps = {
    tableStyle: {},
    headerStyle: {},
    tableBodyStyle: {},
    itemSeparatorStyle: {},
    onSortClick: null,
    onDataChange: false,
    renderFooter: null,
    totalRecords: null
  };

  constructor(props) {
    super(props);
    this.state = {
      cols: this.props.cols,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const { data, reRenderTable } = nextProps;
    if (data) {
      return { data, reRenderTable };
    }
  }

  onSortClick = (sortedColumn, sortedColumnIndex) => {
    const { onSortClick } = this.props;
    let { cols } = this.state;
    cols = cols.map(col => ({
      ...col,
      sortDirection: null
    }));
    cols[sortedColumnIndex].sortDirection = sortedColumn.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    this.setState({
      cols
    }, () => {
      if (onSortClick) {
        onSortClick(sortedColumn.label, cols[sortedColumnIndex].sortDirection);
      } else {
        this.onSort(sortedColumnIndex, sortedColumn.dataKey, cols[sortedColumnIndex].sortDirection);
      }
    });
  }

  onSort=(sortedColumnIndex, dataKey, sortDirection) => {
    const { cols, reRenderTable } = this.state;
    let { data } = this.state;
    if (cols[sortedColumnIndex].dataType === Number) {
      data = data.sort((a, b) =>
        sortDirection === 'ASC' ?
          parseFloat(a[dataKey]) - parseFloat(b[dataKey]) :
          parseFloat(b[dataKey]) - parseFloat(a[dataKey]));
    } else if (cols[sortedColumnIndex].dataType === String) {
      data = data.sort((a, b) =>
        sortDirection === 'ASC' ?
          a[dataKey].localeCompare(b[dataKey]) :
          b[dataKey].localeCompare(a[dataKey]));
    }
    this.setState({
      data,
      reRenderTable: !reRenderTable
    });
  }

  renderSeperator=() => {
    const { itemSeparatorStyle } = this.props;
    return (
      <View style={[{ backgroundColor: '#e3e3e3', height: 1 }, itemSeparatorStyle]} />
    );
  }

  renderHeader=() => {
    const { cols } = this.state;
    return (
      <View style={[tableStyle.headerContainer, this.props.headerStyle]} >
        {/* table header content */}
        <View style={tableStyle.headerContent} >
          {
            cols && cols.map((col, index) => (
              <View style={[tableStyle.headerColumnContent, {
                backgroundColor: !index ? '#f6f6f6' : 'white',
                borderTopLeftRadius: index ? 0 : 4,
                borderTopRightRadius: index === cols.length - 1 ? 4 : 0
              }]} >
                {/* table header cell-content */}
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}
                    onPress={() => { if (col.sortable) this.onSortClick(col, index); }}>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={1}
                      style={[col.headerCellStyle ? col.headerCellStyle : {}, {
                        color: '#454545',
                        fontSize: 13,
                        alignSelf: 'flex-start',
                        marginLeft: 10,
                        textAlign: 'center'
                      }]}>
                      {col.label}
                    </Text>
                    {/* table-header sort-click */}
                    {
                      col.sortable &&
                      <View style={{
                        alignSelf: 'flex-end',
                        justifyContent: 'center',
                        paddingRight: 10,
                        zIndex: 1
                      }}>
                        <Icon
                          name={`sort${!col.sortDirection ? '' : col.sortDirection === 'ASC' ? '-asc' : '-desc'}`}
                          size={12}
                          color={col.sortDirectionColor || '#f37e2e'} />
                      </View>
                    }
                  </TouchableOpacity>
                </View>
              </View>
            ))}
        </View>
        <View />
      </View>
    );
  }

  renderItem = data => {
    const { cols } = this.state;
    const { item } = data;
    return (
      <View style={[{ height: 50 }]}>
        <View style={[tableStyle.rowContainer]}>
          { cols.map((col, index) => (
            <View
              style={[tableStyle.rowContentStyle, {
                backgroundColor: !index ? '#f6f6f6' : 'white'
              }]}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[tableStyle.rowTextContentStyle]}>
                {col.textRenderer ? col.textRenderer(item, col.dataKey) :
                  item[col.dataKey] ? item[col.dataKey] : 'N/A'}
              </Text>
              {col.cellRenderer && col.cellRenderer(item)}
            </View>
          ))}
        </View>
      </View>
    );
  }

  render() {
    const {
      tableBodyStyle, onDataChange,
      renderFooter, totalRecords
    } = this.props;
    const { data, reRenderTable } = this.state;
    return (
      <Fragment>
        {/* table */}
        <View style={[tableStyle.tableContainer, this.props.tableStyle]} >
          {this.renderHeader()}
          {this.renderSeperator()}
          {/* table-body */}
          <FlatList
            style={[{
              backgroundColor: 'white',
              height: DEVICE_HEIGHT - 350,
            }, tableBodyStyle]}
            keyExtractor={item => item.id}
            data={data}
            renderItem={this.renderItem}
            extraData={reRenderTable || onDataChange}
            ItemSeparatorComponent={this.renderSeperator}
            scrollEnabled
              />
          <View style={[tableStyle.footerContainer]} >
            {renderFooter ? renderFooter() :
            <View style={{
              alignItems: 'flex-start',
            }}>
              <Text style={tableStyle.footerText}>Total Records:
                <Text sytle={{ paddingLeft: 15 }}>
                  {totalRecords || data.length}
                </Text>
              </Text>
            </View>
            }
          </View>
        </View>

      </Fragment>);
  }
}

