import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Text,
  Image,
  ImageBackground,
  TextInput,
  Platform,
  Modal,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,

} from 'react-native'
import { isEqual } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
// import Icon from 'react-native-vector-icons/MaterialIcons'
import { RowItem } from './components'
import { callIfFunction } from './helpers'
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

let Icon

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity

const defaultStyles = {
  container: {},
  modalWrapper: {},
  selectToggle: {
    paddingHorizontal: 10,
    // paddingVertical: 10,
    borderRadius: 4,
  },
  selectToggleText: {},
  item: {},
  subItem: {},
  itemText: {
    marginVertical: 8,
    fontSize: 16,
    fontFamily: "Helvetica Neue",
  },
  selectedItemText: {
    fontFamily: "Helvetica Neue",
  },
  selectedSubItemText: {fontFamily: "Helvetica Neue",},
  subItemText: {
    fontSize: 15,
    paddingLeft: 8,
    fontFamily: "Helvetica Neue",
  },
  searchBar: {
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {},
  subSeparator: {
    height: 0.3,
  },
  chipsWrapper: {},
  chipContainer: {},
  chipText: {},
  chipIcon: {},
  searchTextInput: {},
  scrollView: {},
  button: {},
  cancelButton: {},
  confirmText: {},
  toggleIcon: {},
  selectedItem: {},
  selectedSubItem: {},
}

const defaultColors = {
  primary: '#3f51b5',
  success: '#4caf50',
  cancel: '#1A1A1A',
  text: '#222222',
  subText: '#848787',
  selectToggleTextColor: '#222222',
  searchPlaceholderTextColor: '#222222',
  searchSelectionColor: 'rgba(0,0,0,0.2)',
  chipColor: '#848787',
  itemBackground: '#fff',
  subItemBackground: '#ffffff',
  disabled: '#d7d7d7',
}

 const ComponentContainer = ({ children }) => (
   <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>{children}</View>
 )

const noResults = (
  <ComponentContainer>
    <Text>Sorry, no results</Text>
  </ComponentContainer>
)

const noItems = (
  <ComponentContainer>
    <Text>Sorry, no items</Text>
  </ComponentContainer>
)

const loadingComp = (
  <ComponentContainer>
    <ActivityIndicator />
  </ComponentContainer>
)

// let date = new Date()
class SectionedMultiSelect extends PureComponent {
  static propTypes = {
    single: PropTypes.bool,
    selectedItems: PropTypes.array,
    items: PropTypes.array,
    displayKey: PropTypes.string,
    uniqueKey: PropTypes.string.isRequired,
    subKey: PropTypes.string,
    onSelectedItemsChange: PropTypes.func.isRequired,
    showDropDowns: PropTypes.bool,
    showChips: PropTypes.bool,
    readOnlyHeadings: PropTypes.bool,
    selectText: PropTypes.string,
    selectedText: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    renderSelectText: PropTypes.func,
    confirmText: PropTypes.string,
    hideConfirm: PropTypes.bool,
    styles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    colors: PropTypes.objectOf(PropTypes.string),
    searchPlaceholderText: PropTypes.string,
    noResultsComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    loadingComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    loading: PropTypes.bool,
    subItemFontFamily: PropTypes.object,
    itemFontFamily: PropTypes.object,
    searchTextFontFamily: PropTypes.object,
    confirmFontFamily: PropTypes.object,
    showRemoveAll: PropTypes.bool,
    removeAllText: PropTypes.string,
    modalSupportedOrientations: PropTypes.arrayOf(PropTypes.string),
    modalAnimationType: PropTypes.string,
    modalWithSafeAreaView: PropTypes.bool,
    modalWithTouchable: PropTypes.bool,
    hideSearch: PropTypes.bool,
    footerComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    stickyFooterComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    selectToggleIconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    cancelIconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    searchIconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    selectedIconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    unselectedIconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    dropDownToggleIconUpComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    dropDownToggleIconDownComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    chipRemoveIconComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    selectChildren: PropTypes.bool,
    highlightChildren: PropTypes.bool,
    onSelectedItemObjectsChange: PropTypes.func,
    itemNumberOfLines: PropTypes.number,
    selectLabelNumberOfLines: PropTypes.number,
    showCancelButton: PropTypes.bool,
    hideSelect: PropTypes.bool,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    headerComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    alwaysShowSelectText: PropTypes.bool,
    searchAdornment: PropTypes.func,
    expandDropDowns: PropTypes.bool,
    animateDropDowns: PropTypes.bool,
    customLayoutAnimation: PropTypes.object,
    filterItems: PropTypes.func,
    onToggleSelector: PropTypes.func,
    noItemsComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    customChipsRenderer: PropTypes.func,
    chipsPosition: PropTypes.oneOf(['top', 'bottom']),
    hideChipRemove: PropTypes.bool,
    autoFocus: PropTypes.bool,
    iconKey: PropTypes.string,
    disabled: PropTypes.bool,
    selectedIconOnLeft: PropTypes.bool,
    parentChipsRemoveChildren: PropTypes.bool,
    iconRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    itemsFlatListProps: PropTypes.object,
    subItemsFlatListProps: PropTypes.object,
  }

  static defaultProps = {
    single: false,
    selectedItems: [],
    displayKey: 'name',
    showDropDowns: true,
    showChips: true,
    readOnlyHeadings: false,
    selectText: 'Select',
    selectedText: 'selected',
    confirmText: 'Confirm',
    hideConfirm: false,
    searchPlaceholderText: 'Search categories...',
    noResultsComponent: noResults,
    loadingComponent: loadingComp,
    loading: false,
    styles: {},
    colors: {},
    itemFontFamily: {
      fontFamily: Platform.OS === 'android' ? 'Helvetica Neue' : 'Helvetica Neue',
      fontWeight: '400',
    },
    subItemFontFamily: {
      fontFamily: Platform.OS === 'android' ? 'Helvetica Neue' : 'Helvetica Neue',
      fontWeight: '400',
    },
    searchTextFontFamily: {
      fontFamily: Platform.OS === 'android' ? 'Helvetica Neue' : 'Helvetica Neue',
      fontWeight: '400',
    },
    confirmFontFamily: {
      fontFamily: Platform.OS === 'android' ? 'Helvetica Neue' : 'Helvetica Neue',
      fontWeight: '400',
    },
    removeAllText: 'Remove all',
    showRemoveAll: false,
    modalSupportedOrientations: ['portrait', 'landscape'],
    modalAnimationType: 'fade',
    modalWithSafeAreaView: false,
    modalWithTouchable: false,
    hideSearch: false,
    selectChildren: false,
    highlightChildren: false,
    itemNumberOfLines: null,
    selectLabelNumberOfLines: 1,
    showCancelButton: false,
    hideSelect: false,
    alwaysShowSelectText: false,
    expandDropDowns: false,
    animateDropDowns: true,
    filterItems: null,
    noItemsComponent: noItems,
    chipsPosition: 'bottom',
    hideChipRemove: false,
    autoFocus: true,
    disabled: false,
    selectedIconOnLeft: false,
    parentChipsRemoveChildren: false,
    itemsFlatListProps: {},
    subItemsFlatListProps: {}
  }

  constructor(props) {
    super(props)
    this.iconLoaded = false
    if (props.iconRenderer) {
      Icon = props.iconRenderer
      this.iconLoaded = true
    } else {
      Icon = require('react-native-vector-icons/MaterialIcons').default
      this.iconLoaded = true

    }

    this.state = {
      selector: false,
      searchTerm: '',
      highlightedChildren: [],
      styles: StyleSheet.flatten([defaultStyles, props.styles]),
      colors: StyleSheet.flatten([defaultColors, props.colors]),
    }
  }

  componentDidUpdate(prevProps) {
    // if (!isEqual(prevProps.styles, this.props.styles)) {
    //   this.setState({ styles: StyleSheet.flatten([defaultStyles, this.props.styles]) })
    // }
    // if (!isEqual(prevProps.colors, this.props.colors)) {
    //   this.setState({ colors: StyleSheet.flatten([defaultColors, this.props.colors]) })
    // }
  }

  getProp = (object, key) => object && object[key]

  rejectProp = (items, fn) => items.filter(fn)

  find = (id, items) => {
    if (!items) {
      return {}
    }
    const { uniqueKey, subKey } = this.props
    let i = 0
    let found
    for (; i < items.length; i += 1) {
      if (items[i][uniqueKey] === id) {
        return items[i]
      } else if (Array.isArray(items[i][subKey])) {
        found = this.find(id, items[i][subKey])
        if (found) {
          return found
        }
      }
    }
  }

  reduceSelected = (array, toSplice) => {
    const { uniqueKey } = this.props
    array.reduce((prev, curr) => {
      toSplice.includes(curr[uniqueKey]) &&
        toSplice.splice(toSplice.findIndex(el => el === curr[uniqueKey]), 1)
    }, {})
    return toSplice
  }

  _getSelectLabel = () => {
    const {
      selectText,
      selectedText,
      single,
      selectedItems,
      displayKey,
      alwaysShowSelectText,
      renderSelectText,
      selectLabelNumberOfLines,
    } = this.props
    const { colors, styles } = this.state
    let customSelect = null

    if (renderSelectText) {
      customSelect = renderSelectText(this.props)
      if (typeof customSelect !== 'string') {
        return customSelect
      }
    }

    let label = ''

    if (!single && alwaysShowSelectText) {
      label = selectText
    }

    if (!selectedItems || selectedItems.length === 0) {
      label = selectText
    } else if (single) {
      const item = selectedItems[0]
      const foundItem = this._findItem(item)
      label = this.getProp(foundItem, displayKey) || selectText
    }
    if (renderSelectText && customSelect && typeof customSelect === 'string') {
      label = customSelect
    }

    return (
      <Text
        numberOfLines={selectLabelNumberOfLines}
        style={[
          {
            flex: 1,
            height: 42,
            fontSize: 16,
            paddingTop: 11,
            marginLeft: 10,
            marginTop:3,
            fontFamily:'Helvetica Neue',
            color: '#222222',
          },
          styles.selectToggleText,
        ]}
      >
        {label}
      </Text>
    )
  }

  _filterItems = (searchTerm) => {
    const {
      items, subKey, uniqueKey, displayKey, filterItems,
    } = this.props

    if (filterItems) {
      return filterItems(searchTerm, items, this.props)
    }
    let filteredItems = []
    let newFilteredItems = []

    items &&
      items.forEach((item) => {
        const parts = searchTerm
          .replace(/[\^$\\.*+?()[\]{}|]/g, '\\$&')
          .trim()
          .split(' ')
        const regex = new RegExp(`(${parts.join('|')})`, 'i')

        if (regex.test(this.getProp(item, displayKey))) {
          filteredItems.push(item)
        }
        if (item[subKey]) {
          const newItem = Object.assign({}, item)
          newItem[subKey] = []
          item[subKey].forEach((sub) => {
            if (regex.test(this.getProp(sub, displayKey))) {
              newItem[subKey] = [...newItem[subKey], sub]
              newFilteredItems = this.rejectProp(
                filteredItems,
                singleItem => item[uniqueKey] !== singleItem[uniqueKey],
              )
              newFilteredItems.push(newItem)
              filteredItems = newFilteredItems
            }
          })
        }
      })

    return filteredItems
  }

  _removeItem = (item) => {
    const {
      uniqueKey,
      selectedItems,
      onSelectedItemsChange,
      highlightChildren,
      onSelectedItemObjectsChange,
    } = this.props

    const newItems = this.rejectProp(selectedItems, singleItem => item[uniqueKey] !== singleItem)

    highlightChildren && this._unHighlightChildren(item[uniqueKey])
    onSelectedItemObjectsChange && this._broadcastItemObjects(newItems)

    // broadcast new selected items state to parent component
    onSelectedItemsChange(newItems)
  }

  _removeAllItems = () => {
    const { onSelectedItemsChange, onSelectedItemObjectsChange } = this.props
    // broadcast new selected items state to parent component
    onSelectedItemsChange([])
    this.setState({ highlightedChildren: [] })
    onSelectedItemObjectsChange && this._broadcastItemObjects([])
  }

  _selectAllItems = () => {
    const {
      items,
      uniqueKey,
      subKey,
      onSelectedItemsChange,
      onSelectedItemObjectsChange,
      readOnlyHeadings,
    } = this.props

    let newItems = []
    items &&
      items.forEach((item) => {
        if (!readOnlyHeadings) {
          newItems = [...newItems, item[uniqueKey]]
        }
        Array.isArray(item[subKey]) &&
          item[subKey].forEach((sub) => {
            newItems = [...newItems, sub[uniqueKey]]
          })
      })

    onSelectedItemsChange(newItems)
    onSelectedItemObjectsChange && onSelectedItemObjectsChange(items)
  }


  _toggleSelector = () => {
    const { onToggleSelector } = this.props
    const newState = !this.state.selector
    this.setState({
      selector: newState,
    })
    onToggleSelector && onToggleSelector(newState)
  }

  _closeSelector = () => {
    const { onToggleSelector } = this.props
    this.setState({
      selector: false,
      searchTerm: '',
    })
    onToggleSelector && onToggleSelector(false)
  }
  _submitSelection = () => {
    const { onConfirm } = this.props
    this._toggleSelector()
    // reset searchTerm
    this.setState({ searchTerm: '' })
    onConfirm && onConfirm()
  }

  _cancelSelection = () => {
    const { onCancel } = this.props
    // this._removeAllItems()
    this._toggleSelector()
    this.setState({ searchTerm: '' })
    onCancel && onCancel()
  }

  _itemSelected = (item) => {
    const { uniqueKey, selectedItems } = this.props
    return selectedItems.includes(item[uniqueKey])
  }

  _toggleItem = (item, hasChildren) => {
    const {
      single,
      uniqueKey,
      selectedItems,
      onSelectedItemsChange,
      selectChildren,
      highlightChildren,
      onSelectedItemObjectsChange,
    } = this.props

    if (single) {
      this._submitSelection()
      onSelectedItemsChange([item[uniqueKey]])
      onSelectedItemObjectsChange && this._broadcastItemObjects([item[uniqueKey]])
    } else {
      const selected = this._itemSelected(item)
      let newItems = []
      if (selected) {
        if (hasChildren) {
          if (selectChildren) {
            newItems = [...this._rejectChildren(item[uniqueKey])]

            newItems = this.rejectProp(newItems, singleItem => item[uniqueKey] !== singleItem)
          } else if (highlightChildren) {
            this._unHighlightChildren(item[uniqueKey])
            newItems = this.rejectProp(selectedItems, singleItem => item[uniqueKey] !== singleItem)
          } else {
            newItems = this.rejectProp(selectedItems, singleItem => item[uniqueKey] !== singleItem)
          }
        } else {
          newItems = this.rejectProp(selectedItems, singleItem => item[uniqueKey] !== singleItem)
        }
      } else {
        newItems = [...selectedItems, item[uniqueKey]]

        if (hasChildren) {
          if (selectChildren) {
            newItems = [...newItems, ...this._selectChildren(item[uniqueKey])]
          } else if (highlightChildren) {
            this._highlightChildren(item[uniqueKey])
          }
        }
      }
      // broadcast new selected items state to parent component
      onSelectedItemsChange(newItems)
      onSelectedItemObjectsChange && this._broadcastItemObjects(newItems)
    }
  }

  _findItem = (id) => {
    const { items } = this.props
    return this.find(id, items)
  }

  _highlightChildren = (id) => {
    const { items, uniqueKey, subKey } = this.props
    const { highlightedChildren } = this.state
    const highlighted = [...highlightedChildren]
    if (!items) return
    let i = 0
    for (; i < items.length; i += 1) {
      if (items[i][uniqueKey] === id && Array.isArray(items[i][subKey])) {
        items[i][subKey].forEach((sub) => {
          !highlighted.includes(sub[uniqueKey]) && highlighted.push(sub[uniqueKey])
        })
      }
    }
    this.setState({ highlightedChildren: highlighted })
  }

  _unHighlightChildren = (id) => {
    const { items, uniqueKey, subKey } = this.props
    const { highlightedChildren } = this.state
    const highlighted = [...highlightedChildren]

    const array = items.filter(item => item[uniqueKey] === id)

    if (!array['0']) {
      return
    }
    if (array['0'] && !array['0'][subKey]) {
      return
    }

    const newHighlighted = this.reduceSelected(array['0'][subKey], highlighted)

    this.setState({ highlightedChildren: newHighlighted })
  }

  _selectChildren = (id) => {
    const {
      items, selectedItems, uniqueKey, subKey,
    } = this.props
    if (!items) return
    let i = 0
    const selected = []
    for (; i < items.length; i += 1) {
      if (items[i][uniqueKey] === id && Array.isArray(items[i][subKey])) {
        items[i][subKey].forEach((sub) => {
          !selectedItems.includes(sub[uniqueKey]) && selected.push(sub[uniqueKey])
        })
      }
    }

    // so we have them in state for SubRowItem should update checks
    this._highlightChildren(id)
    return selected
  }

  _rejectChildren = (id) => {
    const {
      items, selectedItems, uniqueKey, subKey,
    } = this.props
    const arrayOfChildren = items.filter(item => item[uniqueKey] === id)
    const selected = [...selectedItems]
    if (!arrayOfChildren['0']) {
      return
    }
    if (arrayOfChildren['0'] && !arrayOfChildren['0'][subKey]) {
      return
    }

    const newSelected = this.reduceSelected(arrayOfChildren['0'][subKey], selected)

    // update state for SubRowItem component should update checks
    this._unHighlightChildren(id)
    return newSelected
  }

  _toggleChildren = (item) => {
    const { uniqueKey, onSelectedItemsChange, onSelectedItemObjectsChange } = this.props

    const selected = this._itemSelected(item)
    let newItems = []
    if (selected) {
      newItems = [...this._rejectChildren(item[uniqueKey])]
      newItems = this.rejectProp(newItems, singleItem => item[uniqueKey] !== singleItem)
    } else {
      newItems = [...newItems, ...this._selectChildren(item[uniqueKey])]
    }

    onSelectedItemsChange(newItems)
    onSelectedItemObjectsChange && this._broadcastItemObjects(newItems)
  }

  _getSearchTerm = () => this.state.searchTerm

  // get the items back as their full objects instead of an array of ids.
  _broadcastItemObjects = (newItems) => {
    const { onSelectedItemObjectsChange } = this.props

    const fullItems = []
    newItems.forEach((singleSelectedItem) => {
      const item = this._findItem(singleSelectedItem)
      fullItems.push(item)
    })
    onSelectedItemObjectsChange(fullItems)
  }

  _customChipsRenderer = () => {
    const { styles, colors } = this.state
    const {
      displayKey, items, selectedItems, subKey, uniqueKey, customChipsRenderer,
    } = this.props

    return (
      customChipsRenderer &&
      customChipsRenderer({
        colors,
        displayKey,
        items,
        selectedItems,
        styles,
        subKey,
        uniqueKey,
      })
    )
  }

  _renderChips = () => {
    const { styles, colors } = this.state
    const {
      selectedItems,
      single,
      customChipsRenderer,
      showRemoveAll,
      removeAllText,
      showChips,
    } = this.props
    return selectedItems.length > 0 && !single && showChips && !customChipsRenderer ? (
      <TouchableWithoutFeedback
        onPress={this._toggleSelector}
        //disabled={this.state.selector}
      >
        <View
          style={[
            {
              marginHorizontal: 8,
              marginVertical:10,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',

            },
            styles.chipsWrapper,
          ]}
        >

          {selectedItems.length > 1 && showRemoveAll ? (
            <LinearGradient
              style={[
                {
                  overflow: 'hidden',
                  justifyContent: 'center',
                  height: 34,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 10,
                  margin: 3,
                  paddingRight: 10,
                  borderRadius: 20,

                },
                styles.chipContainer,]}
              colors={['#5eb6ed', '#6dc3f1', '#71c7f2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <View
                style={[
                  {
                    height: 34,
                  },

                ]}
              >

                <TouchableOpacity
                  onPress={() => {
                    this._removeAllItems()
                  }}
                  style={{
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                  }}
                >

                  <Text
                    style={[
                      {
                        color: '#ffffff',
                        fontSize: 13,
                        marginRight: 5,
                        fontFamily: "Helvetica Neue",
                      },
                      styles.chipText,
                    ]}
                  >
                    {removeAllText}
                  </Text>
                </TouchableOpacity>

              </View>
            </LinearGradient>

          ) : null}
          {this._displaySelectedItems()}

        </View>
      </TouchableWithoutFeedback>
    ) : null
  }
  _displaySelectedItems = () => {
    const {
      uniqueKey,
      subKey,
      selectedItems,
      displayKey,
      chipRemoveIconComponent,
      parentChipsRemoveChildren,
      hideChipRemove,
    } = this.props
    const { styles, colors } = this.state
    return selectedItems.map((singleSelectedItem) => {
      const item = this._findItem(singleSelectedItem)
      // const isParent = item[subKey] && item[subKey].length
      const isParent = subKey && item[subKey] && item[subKey].length

      if (!item || !item[displayKey]) return null

      return (
        <LinearGradient
          style={[
            {
              overflow: 'hidden',
              justifyContent: 'center',
              height: 34,
              borderColor: '#00b1f7',
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 10,
              margin: 3,
              paddingTop: 15,
              paddingRight: hideChipRemove ? 10 : 0,
              paddingBottom: 0,
              shadowColor: 'rgba(255, 255, 255, 0.54)',
              shadowOffset: {
                width: 4,
                height: 12,
              },
              shadowOpacity: 0.58,
              shadowRadius: 16.00,

              // elevation: 24,
              backgroundColor: '#68bff0',

            },
            styles.chipContainer,
            isParent && styles.parentChipContainer,
          ]}
          colors={['#5eb6ed', '#71c7f2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}>
          
          <View
            style={[
              {
                flexDirection: 'row',
                height: 34,
                borderColor: '#00b1f7',

              },
              styles.chipContainer,
              isParent && styles.parentChipContainer,
            ]}
            key={item[uniqueKey]}
          >

            <Text
              numberOfLines={1}
              style={[
                {
                  fontSize: 13,
                  marginRight: 0,
                  color: '#fffefe',
                  fontFamily: 'Helvetica Neue',
                  fontWeight: '400',
                  lineHeight: 17.68,
                },
                styles.chipText,
                isParent && styles.parentChipText,
              ]}
            >
              {item[displayKey]}
            </Text>
            {!hideChipRemove &&

              <TouchableOpacity
                onPress={() => {
                  isParent && parentChipsRemoveChildren
                    ? this._toggleChildren(item)
                    : this._toggleItem(item, isParent)
                }}
                style={{
                  borderTopRightRadius: 20,
                  borderBottomRightRadius: 20,
                }}
              >

                {callIfFunction(chipRemoveIconComponent) || (
                  <Image source={require('../lib/image/close.png')}
                    style={{ width: 20, height: 20, borderRadius: 20, marginHorizontal: 5 }} resizeMode="contain" />

                )}

              </TouchableOpacity>
            }
          </View>
        </LinearGradient>
      )
    })
  }

  _renderSeparator = () => (
    <View
      style={[
        {
          flex: Platform.OS === 'android' ? 1 : 0,
          height: StyleSheet.hairlineWidth,
          alignSelf: 'stretch',
          backgroundColor: '#dadada',
        },
        this.state.styles.separator,
      ]}
    />
  )

  _renderFooter = () => {
    const { footerComponent } = this.props
    return <View>{footerComponent && callIfFunction(footerComponent)}</View>
  }

  _renderItemFlatList = ({ item }) => {
    const { styles, colors } = this.state

    const { searchTerm } = this.state
    return (
      <View>
        <RowItem
          iconRenderer={Icon}
          item={item}
          mergedStyles={styles}
          mergedColors={colors}
          _itemSelected={this._itemSelected}
          searchTerm={searchTerm}
          _toggleItem={this._toggleItem}
          highlightedChildren={this.state.highlightedChildren}
          {...this.props}
        />
      </View>
    )
  }
  ModalContentWrapper = ({ children }) => {
    const { modalWithSafeAreaView } = this.props
    const { styles } = this.state
   // const Component = modalWithSafeAreaView ? SafeAreaView : TouchableOpacity
    return <TouchableOpacity onPress={this._toggleSelector.bind(this)} style={[{ flex: 1, height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }, styles.modalWrapper]} >{children}</TouchableOpacity>
  }
  BackdropView = ({ children, ...props }) => {
    const { modalWithTouchable } = this.props
    const Wrapper = modalWithTouchable ? TouchableWithoutFeedback : null

    return Wrapper ? <Wrapper ><View {...props} /></Wrapper>
      : <View {...props} />
  }


  render() {
    const {
      items,
      selectedItems,
      uniqueKey,
      confirmText,
      searchPlaceholderText,
      noResultsComponent,
      loadingComponent,
      loading,
      searchTextFontFamily,
      confirmFontFamily,
      modalAnimationType,
      modalSupportedOrientations,
      hideSearch,
      hideConfirm,
      selectToggleIconComponent,
      cancelIconComponent,
      searchIconComponent,
      showCancelButton,
      hideSelect,
      headerComponent,
      searchAdornment,
      selectLabelNumberOfLines,
      noItemsComponent,
      stickyFooterComponent,
      chipsPosition,
      autoFocus,
      disabled,
      itemsFlatListProps,
    } = this.props
    const { searchTerm, selector, styles, colors } = this.state
    const renderItems = searchTerm ? this._filterItems(searchTerm.trim()) : items
    const confirmFont = confirmFontFamily.fontFamily && confirmFontFamily
    const searchTextFont = searchTextFontFamily.fontFamily && searchTextFontFamily
    return (

      <View>
      
        <ScrollView keyboardShouldPersistTaps='handled'>

        <Modal
          supportedOrientations={modalSupportedOrientations}
          animationType={modalAnimationType}
          transparent
          visible={selector}
          onRequestClose={this._closeSelector}
        >

            <this.ModalContentWrapper>
              <this.BackdropView
                style={[
                  {
                    position: 'absolute',
                    zIndex: 0,
                    flex: 1,
                  },
                  styles.backdrop,
                ]}
              />

              <View
                style={[
                  {
                    overflow: 'hidden',
                    marginHorizontal: 25,
                    marginTop: heightPercentageToDP(10),
                    marginBottom: heightPercentageToDP(45),
                    borderRadius: 6,
                    height: heightPercentageToDP(45),
                    alignSelf: 'stretch',
                    flex: Platform.OS === 'android' ? 1 : 0,
                    backgroundColor: 'white',
                  },
                  styles.container,
                ]}
              >
              

                {headerComponent && callIfFunction(headerComponent)}
                {!hideSearch && (
                  <View style={[{ flexDirection: 'row', paddingVertical: 5,width:'100%' }, styles.searchBar]}>
                    <View style={styles.center}>
                      {callIfFunction(searchIconComponent) || (
                        <Icon name="search" size={18} style={{ marginHorizontal: 10 }} />
                      )}
                    </View>
                    <TextInput
                      value={this.state.searchTerm}
                      selectionColor={colors.searchSelectionColor}
                      onChangeText={searchTerm => this.setState({ searchTerm })}
                      placeholder={searchPlaceholderText}
                      autoFocus={autoFocus}
                      selectTextOnFocus
                      placeholderTextColor={colors.searchPlaceholderTextColor}
                      underlineColorAndroid="transparent"
                      style={[
                        {
                          width:'100%',
                          flex: Platform.OS === 'android' ? 1 : 0,
                          fontSize: 16,
                          fontFamily:'Helvetica Neue',
                          fontWeight:'400',
                          paddingVertical: 8,
                        },
                        // searchTextFont,
                        styles.searchTextInput,
                      ]}
                    />
                    {searchAdornment && searchAdornment(searchTerm)}
                  </View>
                )}

                <View
                  style={[{ paddingHorizontal: 12, flex: 1 }, styles.scrollView]}
                >
                  <View>
                    {loading ? (
                      callIfFunction(loadingComponent)
                    ) : (
                        <View>
                          {!renderItems || (!renderItems.length && !searchTerm)
                            ? callIfFunction(noItemsComponent)
                            : null}
                          {items && renderItems && renderItems.length ? (
                            <View>
                              <FlatList
                                keyboardShouldPersistTaps='handled'
                                removeClippedSubviews
                                initialNumToRender={15}
                                data={renderItems}
                                extraData={selectedItems}
                                keyExtractor={item => `${item[uniqueKey]}`}
                                ItemSeparatorComponent={this._renderSeparator}
                                ListFooterComponent={this._renderFooter}
                                renderItem={this._renderItemFlatList}
                                {...itemsFlatListProps}
                              />
                            </View>
                          ) : searchTerm ? (
                            callIfFunction(noResultsComponent)
                          ) : null}
                        </View>
                      )}
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {showCancelButton && (
                    <Touchable accessibilityComponentType="button" onPress={this._cancelSelection}>
                      <View
                        style={[
                          {
                            width: 54,
                            flex: Platform.OS === 'android' ? 0 : 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderRadius: 0,
                            flexDirection: 'row',
                            backgroundColor: colors.cancel,
                          },
                          styles.cancelButton,
                        ]}
                      >
                        {callIfFunction(cancelIconComponent) || (
                          <Icon size={24} name="cancel" style={{ color: 'white' }} />
                        )}
                      </View>
                    </Touchable>
                  )}
                                 

                  {!hideConfirm && (
                    <Touchable
                      accessibilityComponentType="button"
                      onPress={this._submitSelection}
                      style={{ flex: 1 }}
                    >
                      <View
                        style={[
                          {
                            flex: Platform.OS === 'android' ? 1 : 0,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 8,
                            paddingHorizontal: 16,
                            borderRadius: 0,
                            height:46,
                            flexDirection: 'row',
                            backgroundColor: '#23b9f1',
                          },
                          styles.button,
                        ]}
                      >
                        <Text
                          style={[{ fontSize: 18, color: '#ffffff',fontFamily: "Helvetica Neue" }, confirmFont, styles.confirmText]}
                        >
                          {confirmText}
                        </Text>
                      </View>
                    </Touchable>
                  )}
                </View>
                {stickyFooterComponent && callIfFunction(stickyFooterComponent)}
              </View>
                        
            </this.ModalContentWrapper>
        </Modal>
        {chipsPosition === 'top' && this._renderChips()}
        {chipsPosition === 'top' && this._customChipsRenderer()}
        {!hideSelect && (
          <TouchableWithoutFeedback
            onPress={this._toggleSelector}
            disabled={this.state.selector || disabled}
          >
            <View
              style={[
                {
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  alignItems: 'center',
                },
                styles.selectToggle,

              ]}
            >
              {this._getSelectLabel()}
              {callIfFunction(selectToggleIconComponent) || (
                <Icon
                  size={24}
                  //  name="keyboard-arrow-down"
                  style={{ flexDirection: 'row', color: colors.selectToggleTextColor }}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        )}
        {chipsPosition === 'bottom' && this._customChipsRenderer()}
        {chipsPosition === 'bottom' && this._renderChips()}

        </ScrollView>
      
      </View>

    )
  }
}

export default SectionedMultiSelect
