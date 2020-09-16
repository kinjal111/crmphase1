
import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Switch,
} from 'react-native';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-native-material-ui';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import _ from 'lodash';
import LabelError from '../LabelError';
import CustomInput from '../CustomInput';
import styles from './styles';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

export default class CheckboxGroup extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    options: PropTypes.array.isRequired,
    onCheckboxValueChanged: PropTypes.func,
    value: PropTypes.any,
    other: PropTypes.bool,
    toggle: PropTypes.bool,
    error: PropTypes.bool,
  };

  static defaultProps = {
    label: '',
    onCheckboxValueChanged: () => { },
    other: false,
    toggle: false,
    value: {
      regular: [],
    },
    error: false,
  };

  static contextTypes = {
    theme: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    // let res = this.props.value.regular;
    // res = [];
    
    // let options = this.props.options;
   
    // for(var i=0;i<options.length;i++){
    //   if(options[i].selected == true)
    //   {
    //     if(res.indexOf(options[i].value) == -1)
    //       res.push(options[i].value)
    //   } 

    // }
    
//this.props.value.regular = res;
    this.state = {
      selectedValues: this.props.value,
    };
    //console.warn('selected value ==== : ' , this.props)
  }

  onOtherTextChanged = (text) => {
    const { onCheckboxValueChanged } = this.props;
    const { selectedValues } = this.state;
    const clonedValues = _.cloneDeep(selectedValues);
    clonedValues.other.value = text;
    this.setState({
      selectedValues: clonedValues,
    }, () => {
      onCheckboxValueChanged(clonedValues);
    });
  };

  onCheckChanged = (value, checked) => {
   // console.warn('on checked changed : ', value, checked)
  const { onCheckboxValueChanged } = this.props;
    const { selectedValues } = this.state;
    const clonedValues = _.cloneDeep(selectedValues);
  if (checked) {
      if (value === 'other') {
        clonedValues.other = {
          value: '',
        };
      } else {
        clonedValues.regular.push(value);
      }
    } 
     else if (value === 'other') {
      // remove other field from state
      delete clonedValues.other;
    } 
    else {
      // remove selected item from regular
      const index = clonedValues.regular.indexOf(value);
      if (index !== -1) {
        clonedValues.regular.splice(index, 1);
      }
    }
    this.setState({
      selectedValues: clonedValues,
    }, () => {
     // console.warn('clone value : ' , this.state.selectedValues)
      onCheckboxValueChanged(clonedValues);
    });
  };

  renderOtherInput = () => {
    const { selectedValues } = this.state;
    if (selectedValues.other) {
      return (
        <CustomInput
          keyboardType="default"
          validation={v => v}
          onChangeText={this.onOtherTextChanged}
        />
      );
    }
    return null;
  };

  render() {
    const {
      label,
      options,
      other,
      toggle,
      error,
    } = this.props;
    const { theme } = this.context;
    const propsValue = this.props.value;
    const length = options.length;
    console.warn('optionsss : ', propsValue)
    return (
      <View >
        <LabelError
          label={label}
          error={error}
        />
        <View style={styles.checkboxContainer}>
          {/* {

            toggle
              ?
              <View
                style={[
                  styles.switchRow,
                  {
                    paddingTop: toggle ? 10 : 0,
                  },
                ]}
                key={`${_.get(options[0].value, 'value')}`}
              >

                <Switch
                  onValueChange={(checked) => {
                    this.onCheckChanged(_.get(options[0].value, 'value'), checked);
                  }}
                  thumbColor={'#ffffff'}
                  trackColor={{ true: '#00b1f7', false: '#ffffff' }}
                  value={propsValue.regular.indexOf(_.get(options[0].value, 'value')) !== -1}
                />
                <Text style={styles.toggleText}>
                  {_.get(options[0].value, 'label')}
                </Text>
              </View>
              :
              null

          } */}
          {
            _.map(options, value => (
              toggle
                ?

                (               
                 value.value == 'on'?
                  <View
                    style={[
                      styles.switchRow,
                      {
                        paddingTop: toggle ? 10 : 0,
                      },
                    ]}
                    key={`${_.get(value, 'value')}`}
                  >
                    <Switch
                      onValueChange={(checked) => {console.warn(value);
                        this.onCheckChanged(_.get(value, 'value'), checked);
                      
                      }}
                      thumbColor={'#ffffff'}
                      trackColor={{ true: '#00b1f7', false: '#ffffff' }}
                    value={
                      propsValue.regular.indexOf(_.get(value, 'value')) !== -1
                    
                    }
                   // value={(_.get(value, 'value'))}
                    />
                    {/* <Text style={styles.toggleText}>

                      {_.get(value, 'label')}
                    </Text> */}
                  </View>
                :
                 null
                )


                :

                <View key={`${_.get(value, 'value')}`} style={{ width: widthPercentageToDP(30), height: heightPercentageToDP(5) }} >
                  <Text>{value.label}</Text>
                 { 
                    //_.get(value, 'selected') == true?
                    //    this.onCheckChanged(_.get(value, 'value'), true):null
                 }
                  <Checkbox
                    label={_.get(value, 'label')}
                    value={_.get(value, 'value')}
                    checkedIcon={'check-circle'}
                    uncheckedIcon={'radio-button-unchecked'}
                    checked={
                    propsValue.regular.indexOf(_.get(value, 'value')) !== -1
                    //  this.getCheckValue(value,propsValue)
                    }
                    //  propsValue.regular.indexOf(_.get(value, 'selected')) !== -1
                 
                    onCheck={(checked) => {
                      this.onCheckChanged(_.get(value, 'value'), checked);
                    }}
                    
                  />
                </View>
            ))
          }
          {
            other
              ?
              <View style={[styles.otherRow,{borderWidth:4}]}>
                {
                  toggle
                    ?
                    <View style={styles.switchRow}>
                      <Switch
                        thumbTintColor={theme.toggle.knobColor}
                        onTintColor={theme.toggle.tintColor}
                        onValueChange={(checked) => {
                          this.onCheckChanged('other', checked);
                        }}
                        value={!!propsValue.other}
                      />
                      <Text style={styles.toggleText}>
                        Other
                      </Text>
                    </View>
                    :
                    <Checkbox
                      label="Other"
                      value="other"
                      checkedIcon={'check-circle'}
                      uncheckedIcon={'radio-button-unchecked'}
                      checked={!!propsValue.other}
                      onCheck={(checked) => {
                        this.onCheckChanged('other', checked);
                      }}
                    />
                }
                <View style={{ flex: 1 }}>
                  {this.renderOtherInput()}
                </View>
              </View>
              :
              null
          }
        </View>
      </View>
    );
  }
}


