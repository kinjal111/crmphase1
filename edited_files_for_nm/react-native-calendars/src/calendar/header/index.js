import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import { weekDayNames } from '../../dateutils';
import { CHANGE_MONTH_LEFT_ARROW, CHANGE_MONTH_RIGHT_ARROW, CHANGE_YEAR_LEFT_ARROW, CHANGE_YEAR_RIGHT_ARROW } from '../../testIDs';


class CalendarHeader extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    year: PropTypes.instanceOf(XDate),
    addYear: PropTypes.func,
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func
  };

  static defaultProps = {
    monthFormat: 'MMMM',
    yearFormat: 'YYYY'
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.addYear = this.addYear.bind(this);
    this.substractYear = this.substractYear.bind(this);
    this.onMonthPressLeft = this.onMonthPressLeft.bind(this);
    this.onMonthPressRight = this.onMonthPressRight.bind(this);
    this.onYearPressLeft = this.onYearPressLeft.bind(this);
    this.onYearPressRight = this.onYearPressRight.bind(this);
    this.state = {
      Current: this.props.month.getFullYear()
    }

  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  addYear() {

    this.setState({ Current: this.state.Current + 1 })
    this.props.addYear(1);

  }

  substractYear() {

    this.setState({ Current: this.state.Current - 1 })

    this.props.addYear(-1);
  }

  shouldComponentUpdate(nextProps) {

    if (nextProps.month.toString('yyyy MM') !== this.props.month.toString('yyyy MM')) {
      return true;
    }

    if (nextProps.month.getFullYear() !== this.props.month.toString()) {
      return true;
    }

    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    if (nextProps.firstDay !== this.props.firstDay) {
      return true;
    }
    if (nextProps.weekNumbers !== this.props.weekNumbers) {
      return true;
    }
    if (nextProps.monthFormat !== this.props.monthFormat) {
      return true;
    }
    if (nextProps.yearFormat !== this.props.yearFormat) {
      return true;
    }
    return false;
  }

  onMonthPressLeft() {
    const { onPressArrowLeft } = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth, this.props.month);
    }
    return this.substractMonth();
  }

  onMonthPressRight() {
    const { onPressArrowRight } = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth, this.props.month);
    }
    return this.addMonth();
  }

  onYearPressLeft() {
    const { onPressArrowLeft } = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractYear, this.props.year);
      //return this.substractYear();
    }
    // return this.substractYear();
  }

  onYearPressRight() {
    const { onPressArrowRight } = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addYear, this.props.year);
      // return this.addYear();

    }
    // return this.addYear();
  }

  render() {
    let leftMonthArrow = <View />;
    let rightMonthArrow = <View />;
    let leftYearArrow = <View />;
    let rightYearArrow = <View />;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    const { testID } = this.props;

    if (!this.props.hideArrows) {
      leftMonthArrow = (
        <TouchableOpacity
          onPress={this.onMonthPressLeft}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={testID ? `${CHANGE_MONTH_LEFT_ARROW}-${testID}` : CHANGE_MONTH_LEFT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('left')
            : <Image
              source={require('../img/previous.png')}
              style={this.style.arrowImage}
            />}
        </TouchableOpacity>
      );
      rightMonthArrow = (
        <TouchableOpacity
          onPress={this.onMonthPressRight}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={testID ? `${CHANGE_MONTH_RIGHT_ARROW}-${testID}` : CHANGE_MONTH_RIGHT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('right')
            : <Image
              source={require('../img/next.png')}
              style={this.style.arrowImage}
            />}
        </TouchableOpacity>
      );
      leftYearArrow = (
        <TouchableOpacity
          onPress={this.onYearPressLeft}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={testID ? `${CHANGE_YEAR_LEFT_ARROW}-${testID}` : CHANGE_YEAR_LEFT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('left')
            : <Image
              source={require('../img/previous.png')}
              style={this.style.arrowImage}
            />}
        </TouchableOpacity>
      );
      rightYearArrow = (
        <TouchableOpacity
          onPress={this.onYearPressRight}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={testID ? `${CHANGE_YEAR_RIGHT_ARROW}-${testID}` : CHANGE_YEAR_RIGHT_ARROW}
        >
          {this.props.renderArrow
            ? this.props.renderArrow('right')
            : <Image
              source={require('../img/next.png')}
              style={this.style.arrowImage}
            />}
        </TouchableOpacity>
      );
    }

    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator color={this.props.theme && this.props.theme.indicatorColor} />;
    }

    return (
      <View style={this.props.style}>
        <View style={this.style.header}>
          {leftMonthArrow}
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={this.style.monthText} accessibilityTraits='header'>
              {this.props.month.toString(this.props.monthFormat)}
            </Text>
            {indicator}
          </View>
          {rightMonthArrow}
          {leftYearArrow}
          <View style={{ flexDirection: 'row' }}>
            <Text allowFontScaling={false} style={this.style.monthText} accessibilityTraits='header'>
              {this.state.Current}
              {/* {this.props.year.getFullYear()} */}

            </Text>
            {indicator}
          </View>
          {rightYearArrow}
        </View>
        {
          !this.props.hideDayNames &&
          <View style={this.style.week}>
            {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={idx}
                accessible={false}
                style={this.style.dayHeader}
                numberOfLines={1}
                importantForAccessibility='no'
              >
                {day}
              </Text>
            ))}
          </View>
        }
      </View>
    );
  }
}

export default CalendarHeader;
