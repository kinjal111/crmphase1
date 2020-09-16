import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Keyboard,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Overlay, Divider } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import { textHeader, font_style } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground';
import Constant from '../constants/Constant';
import DatePicker from 'react-native-datepicker';
import FileViewer from "react-native-file-viewer";
import Colors from '../constants/Colors';
import { Dropdown } from 'react-native-material-dropdown';
import moment from 'moment';
import { ActionSheet, ActionSheetItem } from 'react-native-action-sheet-component';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { apiBasePath } from '../constantApi';
import FlashMessage, { showMessage } from "react-native-flash-message";
import NetworkUtils from '../components/NetworkUtils';

import ImageResizer from 'react-native-image-resizer';
import CameraRoll from "@react-native-community/cameraroll";


export default class AddNoteScreen extends React.Component {

  // Display the Header and it's elements and done functionality of the header

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.add_note}</Text>,

    headerLeft: () =>

      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity
          style={[styles.top_layout1]}
          activeOpacity={1}
          onPress={() => {
            navigation.goBack(null)
          }}
        >

          <Image source={require('./../assets/images/arrow-left.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.top_layout1], { paddingTop: 5, flex: 0.6 }}
          activeOpacity={1}
          onPress={() => { navigation.toggleDrawer(), Keyboard.dismiss() }}
        >

          <Image source={require('./../assets/images/menu_3x.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

      </View>,

    headerRight: () =>

      <TouchableOpacity
        style={styles.top_layout, { marginTop: 1, marginRight: 20 }}
        activeOpacity={1}
        onPress={() => { navigation.getParam('createNote')(); }}
      >

        <Text style={[{ color: Colors.white_color, fontSize: 16, textAlign: 'center' }, font_style.font_medium]}>Save</Text>

      </TouchableOpacity>,

  });

  // Initilize the State and state Variable

  constructor() {
    super();
    this.state = {
      isLoading: false,
      isvisible: false,
      showBG: false,
      text: '',
      dateFrom: moment().format("DD-MM-YYYY"),
      fileUri: '',
      conversation: '',
      contact_id: '',
      contact_Data: '',
      select_conversation: '',
      attachments: [],
      date_closed: '',
      ConversationState: false,
      isSave: false,
      note: '',
      time: []
      ,
      dateFrom: moment().format('LL'),

    }
  }

  // get the contact Data From Async Storage or navigation and fetch the conversation data when page is loading 

  componentDidMount = async () => {
    this.setState({ isSave: false });
    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      this.props.navigation.setParams({ createNote: this.createNote });
      _this = this

      let Contact_id = this.props.navigation.getParam('contactID')
      this.setState({ contact_id: Contact_id })

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();
      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token)
      formData.append('method', 'get_contact_conversations');
      formData.append('contact_id', this.state.contact_id);

      fetch(apiBasePath, {
        method: 'POST',
        body: formData
      })

        .then(response => {
          if (response.status == 200) {

            return response.json();
          }
          else if (response.status == 101) {
            this.props.navigation.navigate('SignUp');
          }
          else {

          }

        })
        .then(responseJson => {
          str = responseJson;
          if (str.error === 101) {
            AsyncStorage.removeItem(Constant.api_token);
            this.props.navigation.navigate('SignUp')

          }
          else {


            this.setState({ isLoading: false, conversation: str }, () => { this.modifyConversationKey() });

          }

        })
        .catch(error => {

          this.setState({ isLoading: false }, () => { });
        }
        )
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }
  }

  // modify Converstaion Key in which id change to value and name change to label 

  modifyConversationKey() {

    if (this.state.conversation.length == 0 || this.state.conversation === undefined || this.state.conversation === 'null') {

    } else {


      var item = this.state.conversation;
      item.map((val) => {

        val.value = val.id;

        if (val.category === 'product/service') {
          if (val.date_closed === null) {
            val.label = val.name;
          }
          else {
            val.label = val.name + ' ( ' + val.date_closed + ')'
          }
        }
        else {
          val.label = val.name
        }

        delete val.name
        delete val.id

      })
      this.setState({ conversation: item, select_conversation: item[0].value, ConversationState: true })
    }
  }

  // Send Note to server by add_contact_note method which have parameter contactid,note,conversation and attachment

  createNote = async () => {



    if (this.state.select_conversation === 'product/service') {

      this.setState({ select_conversation: select_conversation + this.state.date_closed })

    } else {
      if (this.state.note === '') {

        showMessage({
          message: "",
          description: "Note Must be Filled",
          type: "danger",
        });

      }
      else {

        if (this.state.isSave == false) {

          this.setState({ isSave: true });
          console.warn("IS SAVE BTN..", this.state.isSave);

          this.setState({ isLoading: true, })

          const isConnected = await NetworkUtils.isNetworkAvailable()

          if (isConnected) {

            const api_token = await AsyncStorage.getItem(Constant.api_token);
            let formData = new FormData();

            formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
            formData.append('api_token', api_token)
            formData.append('method', 'add_contact_note');
            formData.append('contact_id', this.state.contact_id);
            formData.append('note', this.state.note);
            formData.append('conversation', this.state.select_conversation);

            console.warn('attachements : ', this.state.attachments)
            let file_attachments = this.state.attachments;
            let files_len = file_attachments.length;

            if (files_len > 0) {
              for (let i = 0; i < files_len; i++) {
                formData.append('attachments[]', file_attachments[i]);
              }
            }
            console.warn('formData : ', formData)
            fetch(apiBasePath, {
              method: 'POST',
              body: formData
            })

              .then(response => {
                if (response.status == 200) {
                  return response.json();
                }
                else if (response.status == 101) {
                  AsyncStorage.removeItem(Constant.api_token);
                  this.props.navigation.navigate('SignUp');
                }
                else {

                }

              })
              .then(responseJson => {
                str = responseJson;

                if (str.error == 101) {
                  AsyncStorage.removeItem(Constant.api_token);
                  this.props.navigation.navigate('SignUp');
                }
                else {
                  if (str.status === true) {

                    this.setState({ isLoading: false })


                    showMessage({
                      message: "",
                      description: "Note successfully Created",
                      type: "success",
                    }.then(this.props.navigation.goBack(null))
                    );

                  }
                }

              })
              .catch(error => {

                this.setState({ isLoading: false }, () => { });
              }
              )
          }
          else {

            this.setState({ isLoading: false }, () => { alert('Check Your Internet Connection and Try Again') });


          }
        }
        else {
          console.log("Button Click 2 times...");
        }
      }
    }
  }

  // Toggle Visibility of Update App Notofication Prompt

  setOverlayVisible(visible) {
    this.setState({ isvisible: visible });
  }

  // Method for choosing the options for pick Document and hide ActionSheet Modal

  optionClick(index) {

    switch (index) {

      case 0:
        this.launchImageLibrary()
        break;

      case 1:
        this.launchCamera()
        break;

      case 2:
        this.pickDocument()
        break;

      case 3:
        this.hideBottomActionSheet()
        break;

    }

  }


  // Method for launching Camera for click the image and save the Image and then save it to attachment state

  launchCamera = () => {

    let tempArray = this.state.attachments
    let cameraImage;

    ImagePicker.openCamera({
      width: 1920,
      height: 1080,
      multiple: true,
      maxFiles: 10,
    }).then(image => {
      if (Platform.OS === 'ios') {
        CameraRoll.saveImageWithTag(image.path).then().catch();
      }
      let cameraImage =
      {
        uri: image.path,
        type: image.mime,
        name: Platform.OS === "android" ? image.path.substring(image.path.length - 10, image.path.length) : image.path.substring(image.path.length - 10, image.path.length)

      }

      tempArray.push(cameraImage)

      this.setState({
        attachments: tempArray
      }, () => { });

    });



  }

  // Method for launching Image gallery for Pick the single/multiple image and save the Images and then save it to attachment state

  launchImageLibrary = async () => {

    if (Platform.OS === 'android') {

      try {
        const results = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.images]
        });
        let tempArray = []
        let regexAll = /[^\\]*\.(\w+)$/;
        for (const res of results) {

          ImageResizer.createResizedImage(res.uri, 1000, 1000, 'JPEG', 20)
            .then(response => {
              let image =
              {
                uri: response.uri,
                type: (res.type === null || res.type === '' || res.type === 'null') ? res.uri.match(regexAll)[1] : res.type,
                name: res.name,
                size: res.size
              }
              tempArray.push(image)
              this.setState({ attachments: tempArray }, () => {
                ImagePicker.clean().then(() => {
                }).catch(e => {
                  // alert(e);
                });
              })
            })
            .catch(err => {
              // Oops, something went wrong. Check that the filename is correct and
              // inspect err to get more details.
            });
        }
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          // User cancelled the picker, exit any dialogs or menus and move on
        } else {
          throw err;
        }
      }

    }

    else {


      ImagePicker.openPicker({
        multiple: true,
        maxFiles: 10,
      })
        .then(response => {
          let tempArray = []
          response.forEach((item) => {
            ImageResizer.createResizedImage(item.path, item.height, item.width, 'JPEG', 20)
              .then(response => {
                // console.log('ahahah',response)
                let image =
                {
                  uri: response.path,
                  type: item.mime,
                  name: item.filename
                }
                tempArray.push(image)
                this.setState({ attachments: tempArray }, () => {
                  ImagePicker.clean().then(() => {
                  }).catch(e => {
                    // alert(e);
                  });
                })
              })
              .catch(err => {
                // Oops, something went wrong. Check that the filename is correct and
                // inspect err to get more details.
              });
          })
        });
    }
  }

  // Method for launching Document Picker for selecting the single/multiple files and save the files and then save it to attachment state

  async pickDocument() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles]
      });
      let tempArray = []
      let regexAll = /[^\\]*\.(\w+)$/;
      for (const res of results) {

        let document =
        {

          uri: res.uri,
          type: (res.type === null || res.type === '' || res.type === 'null') ? res.uri.match(regexAll)[1] : res.type,
          name: res.name,
          size: res.size

        }

        tempArray.push(document)

        this.setState({
          attachments: tempArray
        }, () => { })

      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }

  }

  // Show the Bottom Actionsheet when click the Add Attachment Button

  showBottomActionSheet = () => {
    this.bottomActionSheet.show();
  }

  // hide the Bottom Actionsheet when click the close/cancel Button or pick any option in ActionSheet

  hideBottomActionSheet = () => {
    this.bottomActionSheet.hide();
  }

  // Set Current Date in dateFrom State Variable

  _StartDate = (date) => {

    this.setState({ dateFrom: date })
  }

  openAttachment = async (item) => {

    try {

      await FileViewer.open(item.uri, { showOpenWithDialog: true });
    }
    catch (e) {

      console.log(e)

    }

  }

  // Display the thumbnail of Images which is pick by gallery and camera

  renderThumbnail = ({ item, index }) => {

    return (

      <View style={{ flexDirection: 'row' }}>

        <View style={{ width: 90, height: 90, backgroundColor: '#fff', marginTop: 10 }}>

          <TouchableOpacity activeOpacity={1}
            onPress={() => {
              this.openAttachment(item)
            }}
          >

            <Image style={{ width: 80, height: 80, }} source={item} resizeMode='contain' />
            {/* <Image style={{ width: 80, height: 80, }} source={require('../assets/images/file_icon.webp')} resizeMode='contain' /> */}

          </TouchableOpacity>

          <TouchableOpacity style={{ position: 'absolute', top: 1, left: 70, width: 45, height: 45 }}
            onPress={() => {
              var a = []
              if (this.state.attachments.length == 0 || this.state.attachments == undefined) {

              } else {

                a = this.state.attachments;
                a.splice(index, 1);
                this.setState({ attachments: a }, () => { })
              }

            }}
          >

            <Image style={{ width: 20, height: 20, }} source={require('../assets/images/closeAttachment.png')} resizeMode='contain' />

          </TouchableOpacity>

        </View>

      </View>

    );

  }

  // Display the Loading Activity Indicator While the Note have been saved/created

  renderFooterNote = () => {

    if (!this.state.isLoading) return null;
    else {
      return (
        <View
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#000000',
            opacity: 0.2,

          }}
        >

          <ActivityIndicator animating size='large' />

        </View>
      );
    }

  }

  render() {

    return (

      <KeyboardAwareScrollView style={styles.container}
        bounces={false}
      //  overScrollMode="never"
      // enableResetScrollToCoords={false}
      //enableAutomaticScroll={(Platform.OS === 'ios')}
      >

        {/* <ScrollView keyboardShouldPersistTaps='always' keyboardDismissMode='on-drag'> */}

        <View style={styles.container, { padding: 16 }}>

          {/* <Text style={[styles.txt_style1]}>Add Note:</Text> */}

          <Text style={[styles.txt_style, font_style.font_light]}>Date:</Text>

          <TouchableOpacity activeOpacity={1} style={[styles.top_view_btn,]}>


            <Text style={{ marginLeft: 8, alignSelf: 'center', justifyContent: 'center', color: '#ffffff', flex: 1, fontSize: 16, fontFamily: 'Helvetica Neue', fontSize: 16, fontWeight: '400', borderColor: 'transparent' }}>{this.state.dateFrom}</Text>
            <Image source={require('../assets/images/calender.png')} style={[styles.top_image_style]} resizeMode="contain" />

          </TouchableOpacity>

          <Text style={[styles.txt_style, font_style.font_light]}>Conversation:</Text>

          <View
            activeOpacity={1}
            style={[styles.dropdown_view]}>

            <View style={styles.img_view}>

              <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.black_color }]} resizeMode="contain" />

            </View>

            <Dropdown
              containerStyle={styles.dropdown_container}
              pickerStyle={{
                width: '92%', marginLeft: 16, marginTop: 60, marginStart: 17, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                shadowOffset: { width: 2, height: -4 },
                shadowRadius: 21,
                borderRadius: 46 / 2,
                backgroundColor: '#ffffff',
              }}
              inputContainerStyle={{
                borderBottomColor: 'transparent',
                justifyContent: 'center',
              }}
              textColor='#222222'
              itemColor='#222222'
              baseColor='#ffffff00'
              dropdownPosition={0}
              itemCount={5}
              dropdownOffset={{ top: 10, bottom: -10 }}
              dropdownMargins={{ min: 0, max: 0 }}
              data={(this.state.ConversationState) ? this.state.conversation : this.state.time}
              value={this.state.select_conversation}
              onChangeText={(value) => { this.setState({ select_conversation: value }) }}
            />

          </View>

          <Text style={[styles.txt_style, font_style.font_light]}>Note:</Text>

          <TextInput
            style={[{ borderRadius: 46 / 2, marginTop: 16, textAlignVertical: 'top', padding: 16, justifyContent: 'flex-start', backgroundColor: Colors.white_shade, marginBottom: 10, fontSize: 16, height: heightPercentageToDP(30), paddingTop: heightPercentageToDP(2) }, font_style.font_light]}
            onChangeText={(value) => this.setState({ note: value }, () => { })}
            value={this.state.note}
            multiline={true}
            placeholder='Note'
            placeholderTextColor='#222222'
          />

          <TouchableOpacity onPress={this.showBottomActionSheet}
            style={[styles.top_view_btn, { backgroundColor: Colors.green_start, width: '100%', }]}>

            <Image source={require('../assets/images/link.png')} style={styles.top_image_style} resizeMode="contain" />
            <Text style={[styles.followUp1]}>Add Attachments</Text>

          </TouchableOpacity>

          <FlatList
            keyboardShouldPersistTaps='handled'
            data={this.state.attachments}
            extraData={this.state}
            renderItem={this.renderThumbnail}
            numColumns={4}

          />

          <ActionSheet
            ref={(actionSheet) => { this.bottomActionSheet = actionSheet; }}
            position="bottom"
            onChange={this.onChange}
            overlayOpacity={0.2}
            show={this.state.showBG}
            style={{ width: '70%', borderRadius: 20, marginBottom: 1, marginRight: 16, paddingStart: 16, paddingEnd: 16 }}
            showSelectedIcon={false}
          >
            <ActionSheetItem

              text="Choose from Photos"
              value="Choose from Photos"
              style={{ padding: 16, paddingStart: 16, paddingEnd: 16, marginRight: 16 }}
              icon={

                <FontAwesome name='image' size={20} style={{ marginEnd: 10 }} />

              }
              onPress={() => { this.optionClick(0); }}

            />

            <ActionSheetItem
              text="Take Photo from Camera"
              value="Take Photo from Camera"
              style={{ padding: 16, paddingStart: 16, paddingEnd: 16, marginRight: 16 }}
              icon={

                <FontAwesome name='camera' size={20} style={{ marginEnd: 10 }} />

              }
              onPress={() => { this.optionClick(1); }}
            />

            <ActionSheetItem
              text="Browse Documents"
              value="Browse Documents"
              style={{ padding: 16, paddingStart: 16, paddingEnd: 16, marginRight: 16 }}
              icon={

                <FontAwesome name='file' size={20} style={{ marginEnd: 10 }} />

              }
              onPress={() => { this.optionClick(2); }}
            />

            <ActionSheetItem
              text="Cancel"
              value="Cancel"
              style={{ padding: 16, paddingStart: 16, paddingEnd: 16, marginRight: 16 }}
              icon={

                <FontAwesome name='close' size={20} style={{ marginEnd: 10 }} />

              }
              onPress={() => {
                this.setState({ showBG: false }, () => { this.optionClick(3); })
              }}
            />

          </ActionSheet>

          {/* Overlay for Update App Notification Prompt */}

          <Overlay
            isVisible={this.state.isvisible}
            windowBackgroundColor="rgba(0, 0, 0, 0.5)"
            overlayBackgroundColor="white"
            width="80%"
            height="35%"
          >

            <View style={{ marginTop: 30 }}>

              <Text style={styles.pleaseUpdate}>Please update Your app to Continue</Text>
              <Text style={styles.thisApp}>This app version 10.0.3.1 is no longer Supported.</Text>

              <TouchableOpacity>

                <View style={[styles.Update_now]}>

                  <Image source={require('../assets/images/Update_Now_bg.png')} style={styles.UpdateImage_Style} resizeMode="cover"></Image>

                  <Text style={[styles.updateNowtext]}>Update Now</Text>

                </View>

              </TouchableOpacity>

              <TouchableOpacity onPress={() => { this.setOverlayVisible(false); }}>

                <Text style={[styles.cancel_txt, font_style.font_medium,]}>Cancel</Text>

              </TouchableOpacity>

            </View>

          </Overlay>

          {this.renderFooterNote()}

        </View>

        {/* </ScrollView> */}

      </KeyboardAwareScrollView>
    );
  }

}

// Styling code for Ui elements

const styles = StyleSheet.create({

  top_layout: {
    height: 32,
    paddingRight: 20,
    paddingLeft: 20
  },
  top_layout1: {
    paddingTop: 5,
    height: 32,
    paddingRight: 20,
    paddingLeft: 20
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white_color,
    // padding: 16,

  },
  top_view_btn: {
    marginTop: 16,
    flexDirection: 'row',
    backgroundColor: Colors.primaryColor,
    height: 46,
    borderRadius: 46 / 1,
    justifyContent: 'center',
    paddingStart: 16, paddingEnd: 16
  },
  top_view_txt: {
    flex: 1,
    paddingLeft: 10,
    color: Colors.white_color,
    fontSize: 16,
    alignSelf: 'center'
  },

  top_image_style: {
    width: 20, height: 20,
    tintColor: Colors.white_color,
    marginEnd: 4,
    alignSelf: 'center',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },

  txt_style: {
    fontSize: 16, color: Colors.black_color,
    marginTop: 16,
    marginHorizontal: 6
  },
  txt_style1: {
    fontSize: 16, color: Colors.black_color,
    fontWeight: '400',
    marginTop: 5,
    marginHorizontal: 2
  },
  img_view: {
    alignSelf: 'flex-end',
    position: 'absolute',
    paddingEnd: 16
  },
  dropdown_container: {
    width: '100%',
    alignSelf: 'center',
    paddingStart: 16,
  },
  dropdown_view: {
    height: 46,
    justifyContent: 'center',
    backgroundColor: Colors.white_shade,
    borderRadius: 46 / 2, paddingEnd: 16,
    marginTop: 15,
  },
  followUp1: {
    marginTop: 10,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '500',
  },
  pleaseUpdate: {
    marginLeft: 20,
    marginEnd: 20,
    justifyContent: 'flex-start',
    textAlign: 'center',
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 22,
    fontWeight: '500',
  },
  thisApp: {
    marginLeft: 20,
    marginTop: 20,
    marginEnd: 20,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#5d5d5d',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '400',
  },
  Update_now: {
    width: 150,
    height: 56,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 56 / 2,
    backgroundColor: '#f0ab16',
  },
  UpdateImage_Style: {
    flex: 1,
    position: 'absolute',
    width: 150,
    height: 56,
    borderRadius: 56,
    backgroundColor: '#f0ab16',
  },

  updateNowtext: {
    flex: 1,
    marginTop: 18,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    zIndex: 9999,
  },

  cancel_txt: {
    marginTop: 20,
    color: '#f566a5',
    fontFamily: 'Helvetica Neue',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 30,
  },

});
