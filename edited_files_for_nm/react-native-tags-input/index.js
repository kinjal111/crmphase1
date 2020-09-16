
import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ViewPropTypes
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

class Tags extends React.Component {

  focus() {
    this.input.focus();
  }

  blur() {
    this.input.blur();
  }

  clear() {
    this.input.clear();
  }

  isFocused() {
    return this.input.isFocused();
  }

  setNativeProps(nativeProps) {
    this.input.setNativeProps(nativeProps);
  }

  renderLabel = (text, style) => {
    return (
      <Text style={style}>
      {text}
      </Text>
  )
  };

  renderLeftElement = (element, style) => {
    return (
      <View style={StyleSheet.flatten([styles.leftElement, style])}>
      {element}
      </View>
  )
  };

  renderRightElement = (element, style) => {
    return (
      <View style={StyleSheet.flatten([styles.rightElement, style])}>
      {element}
      </View>
  )
  };

  onChangeText = (text, tags, updateState, keysForTags) => {

    let keysStr;
    if (typeof keysForTags === 'string') {
      keysStr = keysForTags;
    } else {
      keysStr = ' ';
    }

    if (text.includes(keysStr)) {
      if (text === keysStr) {
        return
      }
      let tempTag = text.replace(keysStr, '');
      let tempArray = tags.tagsArray;
      console.log(tempTag);
      tempArray.push(tempTag);
      let tempObject = {
        tag: '',
        tagsArray: tempArray
      };
      updateState(tempObject);
      return this.input.clear();
    }
    let tempObject = {
      tag: text,
      tagsArray: tags.tagsArray
    };
    return updateState(tempObject)
  };

  deleteTag = (tagToDelete, tags, updateState) => {

    let tempArray = tags.tagsArray;
    tempArray.splice(tagToDelete, 1);

    let tempObject = {
      tag: tags.tag,
      tagsArray: tempArray
    };
    updateState(tempObject)
  };

  render() {
    const {
      containerStyle,
      disabled,
      disabledInputStyle,
      inputContainerStyle,
      leftElement,
      leftElementContainerStyle,
      rightElement,
      rightElementContainerStyle,
      inputStyle,
      label,
      labelStyle,
      tags,
      tagStyle,
      tagTextStyle,
      tagsViewStyle,
      updateState,
      keysForTag,
      deleteElement,
      deleteIconStyles,
      customElement,
    } = this.props;
    const props = this.props;

    return (
      <View style={StyleSheet.flatten([styles.container, containerStyle])}>
      {this.renderLabel(label, StyleSheet.flatten([styles.labelStyle, labelStyle]))}
      <View  style={{
                            width: '104%', color: '#222222',fontSize: 14,marginTop:-25, fontWeight: '400',
                            paddingStart : 16,
                            marginLeft:-7,
                            borderRadius: 23,
                            backgroundColor: '#eaf0f3',
                            fontFamily: 'Helvetica-Light',
                          }}>

<View style={StyleSheet.flatten([styles.tagsView, tagsViewStyle])}>
        {tags.tagsArray.map((item, count) => {
            return (
              <LinearGradient
              style={[
              {
                flexDirection: 'row',
                height: 34,
                borderRadius: 23,
                minWidth : 40,
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 5,
                margin: 5,
                shadowColor: 'rgba(255, 255, 255, 0.54)',
                shadowOffset: {
                  width: 4,
                  height: 12,
                },
                shadowOpacity: 0.90,
                shadowRadius: 30.00,
                backgroundColor: '#68bff0',
              }
              ]}
    
    
              colors={['#5eb6ed',  '#71c7f2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}>
              <View
                style = {{flexDirection: 'row', 
                height: 26,
                alignItems: 'center',             
                minWidth : 40,
                maxWidth: 200,}}
                key={count}
              >
              <Text style={StyleSheet.flatten([styles.tagText, tagTextStyle])}>{item}</Text>
              <TouchableOpacity onPress={() => this.deleteTag(count, tags, updateState) }>
                 
                    <Image
                      source={require('./assets/close.png')}
                      style = {{width:20,height:20}}
                    />
                  
            </TouchableOpacity>
            </View>
            </LinearGradient>
          )
          })}
        </View>
        <View style={{
                            width: '100%', color: '#222222',minHeight:46, fontSize: 14, fontWeight: '400',
                            paddingStart : 16,
                            marginLeft:-7,
                            borderRadius: 23,
                            backgroundColor: '#eaf0f3',
                            fontFamily: 'Helvetica-Light',
                          }}>

          {leftElement ? this.renderLeftElement(leftElement, leftElementContainerStyle) : null}
          <TextInput
            underlineColorAndroid="transparent"
            editable={!disabled}
            ref={ref => {
              this.input = ref;
            }}
            style={StyleSheet.flatten([
                styles.input,
                inputStyle,
                disabled && styles.disabledInput,
                disabled && disabledInputStyle,
              ])}
            {...props}
            value={tags.tag}
            onChangeText={text => this.onChangeText(text, tags, updateState, keysForTag)}
        />
        {rightElement ? this.renderRightElement(rightElement, rightElementContainerStyle) : null}
      </View>
        {customElement ? customElement : null}
     
        </View>
      </View>
  );
  }
}

Tags.propTypes = {
  disabled: PropTypes.bool,
  leftElement: PropTypes.element,
  rightElement: PropTypes.element,
  customElement: PropTypes.element,
  label: PropTypes.string,
  tags: PropTypes.object,
  updateState: PropTypes.func,
  keysForTag: PropTypes.string,
  containerStyle: ViewPropTypes.style,
  inputContainerStyle: ViewPropTypes.style,
  inputStyle: TextInput.propTypes.style,
  disabledInputStyle: ViewPropTypes.style,
  leftElementContainerStyle: ViewPropTypes.style,
  rightElementContainerStyle: ViewPropTypes.style,
  labelStyle: Text.propTypes.style,
  deleteIconStyles: ViewPropTypes.style,
};

const styles = {
  container: {
    width: '100%',
    paddingHorizontal: 10,
  },
  disabledInput: {
    opacity: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
  },
  leftElement: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  rightElement: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    color: 'black',
    fontSize: 18,
    flex: 1,
    minHeight: 40,
    marginLeft: 5,
    marginRight: 5,
  },
  tagsView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  tag: {
     flexDirection: 'row',
  },
  tagText: {
    marginHorizontal: 5,
    color:'#ffffff'
  },
  labelStyle: {
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 15,
   // marginBottom: -4
  },
  deleteIcon: {
    width: 20,
    height: 20,
    opacity: 0.5,
    marginLeft: 5
  }
};

export default Tags;
