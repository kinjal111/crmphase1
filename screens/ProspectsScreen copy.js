import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  PermissionsAndroid,
  FlatList,
  RefreshControl,
  Keyboard,
  Dimensions,
  ActivityIndicator,
  Modal
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import { Overlay } from 'react-native-elements';
import { Dropdown } from 'react-native-material-dropdown';
import { textHeader, font_style } from '../components/styles';
import HeaderBackground from '../components/HeaderBackground'
import Constant from '../constants/Constant';
import Colors from '../constants/Colors';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import HeaderRight from '../components/HeaderRight';
import RNFS from 'react-native-fs';
import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator, ViewPager } from 'rn-viewpager';
import HTML from 'react-native-render-html';
import { apiBasePath } from '../constantApi';
import FileViewer from "react-native-file-viewer";
import FlashMessage, { showMessage } from "react-native-flash-message";
import RNFetchBlob from 'rn-fetch-blob';
import { indexOf } from 'lodash';
import NetworkUtils from '../components/NetworkUtils';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

export default class ProspectsScreen extends React.PureComponent {

  // Display the Header and functionalitiies of it's elements

  static navigationOptions = ({ navigation }) => ({

    headerBackground: () => <HeaderBackground />,

    headerTitle: () => <Text style={textHeader.header}>{Constant.prospects}</Text>,

    headerLeft: () =>

      <View style={{ flexDirection: 'row' }}>

        <TouchableOpacity
          style={[styles.top_layout1], { paddingLeft: 20 }}
          activeOpacity={1}
          onPress={() => { navigation.goBack(null) }}
        >

          <Image source={require('./../assets/images/arrow-left.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.top_layout1], { paddingLeft: 20, flex: 1.0 }}
          activeOpacity={1}
          onPress={() => { navigation.toggleDrawer(), Keyboard.dismiss() }}
        >

          <Image source={require('./../assets/images/menu_3x.png')}
            style={{ width: 20, height: 20, }} resizeMode="contain" />

        </TouchableOpacity>

      </View>,


  });

  // Initilize the Global variables and state variables

  constructor() {
    super();
    this.mounted = false;
    this.offset = 1;
    this.onEndReachedCalledDurationMomentum = true;

    this.state = {
      isvisible: false,
      showContent: true,
      selectedTab: 1,
      setPageView: 0,
      contact_id: '',
      Company_id: '',
      contact_category: '',
      contact_info: '',
      ConversationState: false,
      ConversationData: '',
      coversation: '',
      conversationtoShow: '',
      ProspectData: [],
      ProspectState: false,
      toggleSingleNote: false,
      forShowItem: false,
      cetegory: '',
      showNoteContent: '',
      page: 1,
      loading: true,
      loadingMore: false,
      showAll: 1,
      toggleArrow: true,
      fetching_from_server: false,
      loadMore: true,
      contact_Data: '',
      htmlContent: '',
      AttachmentData: '',
      downloadProgress: 0,
      isFetching: false,
      conversation: [
      ],
      isSpinner: false,
      appointmentDTformat:'',
    }
  }

  // get Contact Data from navigation and call the getconversion method of getting the conversation data

  componentDidMount = async () => {
    this.onEndReachedCalledDuringMomentum = true;
    this.mounted = true;

    let setValue = this.props.navigation.getParam('setValue')
    let tabValue = this.props.navigation.getParam('tabValue')
    let PreviousScreen = this.props.navigation.getParam('Screen')
    let Contact_id = this.props.navigation.getParam('contactID')
    let Company_id = this.props.navigation.getParam('companyID')
    let Contact_categ = this.props.navigation.getParam('contact_type')

    
    AsyncStorage.getItem('General_Settings')
    .then(req => JSON.parse(req))
    .then(json => {
      this.setState({
        appointmentDTformat: json,
      }, () => {
     
      //  let momentObj = moment(date1, (this.state.appointmentDTformat.date_format).toUpperCase());
      //  var dtRes = (moment(momentObj).format('YYYY-MM-DD')).toString();
       console.warn('user login date formate : ' ,  this.state.appointmentDTformat);
       
      })
    })



    if (PreviousScreen === 'Contacts') {

      //let Contact_Data = this.props.navigation.getParam('contactData')

      this.setState({ contact_id: Contact_id }, () => {
        this.getContactData(), this.changePage(setValue, tabValue);
      })
    }
    else if (PreviousScreen === 'Detail') {

      //  let Contact_Data = this.props.navigation.getParam('contactData')

      this.setState({ contact_id: Contact_id }, () => {
        this.getContactData(), this.changePage(setValue, tabValue);
      })
    }
    else if (PreviousScreen === 'Notification') {

      this.setState({ contact_id: Contact_id }, () => {
        this.getContactData(), this.changePage(setValue, tabValue);
      })

    }

  }

  // Fetch The Contact Data For Display the Contact Detail

  getContactData = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token)
      formData.append('method', 'get_contact_details');
      formData.append('contact_id', this.state.contact_id);

      if (this.mounted) {


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

            if (str.error === 101) {
              AsyncStorage.removeItem(Constant.api_token);
              this.props.navigation.navigate('SignUp');
            }
            else {
              console.warn("Json...", JSON.stringify(str))
              this.setState({ isLoading: false, contact_Data: str }, () => { this.getCoversation() });
              console.warn("contact_Data", this.state.contact_Data);
            }
          })
          .catch(error => {

            this.setState({ isLoading: false, });
          }
          )
      }
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }


  }
  onEndReached = ({ distanceFromEnd }) => {
    console.warn('onEndReached.... : ')
    if (!this.onEndReachedCalledDuringMomentum) {
      this.setState({
        page: this.state.page + 1,
        loadingMore: true,
        isFetching: true,
      },
        () => {
          //   this.getContactNote();


          this.getContactNote();
          this.onEndReachedCalledDuringMomentum = true;
        })

    }
  }
  // fetch the Contact note Data from api and call the getconversion method of getting the conversation data

  getContactNote = async () => {
    console.warn("GetContact.... " , this.state.ProspectData.length)
    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const { page } = this.state;

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token);
      formData.append('method', 'get_contact_notes');
      formData.append('contact_id', this.state.contact_id);
      formData.append('page', this.state.page);
      //   formData.append('conversation', this.state.coversation);
      if (this.state.conversation == "View All Conversation ") {
        let value = 'all';
        formData.append('conversation', value);
      }
      else {
        formData.append('conversation', this.state.conversation)
      }
      //console.warn('formdata : ', formData)
      console.warn("FormData124...", formData);
    //  console.warn('conversation123... : ', this.state.conversation);
      if (this.mounted) {

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

            str = responseJson

            if (str === []) {

              this.setState({ loadMore: false })
            }


            else if (str.error === 101) {

              AsyncStorage.removeItem(Constant.api_token);
              this.props.navigation.navigate('SignUp')

            }
            else {

              console.warn("JSON... str length  ", str.length)
              //  this.setState({ProspectData:str});
              //  this.setState({loading: false});
              //  this.toggleAllNote()
              this.setState({
                ProspectData:
                  this.state.page === 1
                    ? str
                    : [...this.state.ProspectData, ...str],
                loading: false,
                loadingMore: false,
                isFetching: false,
              }, () => {
                     console.warn('====================================Got Resut Profile Data123 == ', this.state.page , " == " , this.state.ProspectData.length)
                this.toggleAllNote()
              })

            }
          })
          .catch(error => {

            this.setState({ loading: false, loadingMore: false });

          }
          )

      }
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }

  }

  componentWillUnmount() {
    this.mounted = false;
  }

  // fetch the conversation data from api which have method get_contact_conversations and then call modify conversation key for the change the keys

  getCoversation = async () => {

    const isConnected = await NetworkUtils.isNetworkAvailable()

    if (isConnected) {

      const api_token = await AsyncStorage.getItem(Constant.api_token);
      let formData = new FormData();

      formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
      formData.append('api_token', api_token)
      formData.append('method', 'get_contact_conversations');
      formData.append('contact_id', this.state.contact_id);

      if (this.mounted) {

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

            str.unshift({ id: "View All Conversation ", name: "View All Conversation " });
            //item.unshift({id:"View All Conversation ",name:"View All Conversation"});

            if (str.error === 101) {
              AsyncStorage.removeItem(Constant.api_token);
              this.props.navigation.navigate('SignUp');
            }
            else {

              this.setState({ isLoading: false, ConversationData: str }, () => { this.modifyConversationKey() });
            }
          })
          .catch(error => {

            this.setState({ isLoading: false, });


          })
      }
    }
    else {

      alert('Check Your Internet Connection and Try Again')

    }

  }

  // modify Conversation Key like name into label and id into value

  modifyConversationKey() {

    var item = this.state.ConversationData;
    console.warn('conversation data : ', this.state.ConversationData)
    //item.unshift({id:"View All Conversation",name:"View All Conversation"});
    //this.setState({ConversationData:item});

    //item = this.state.ConversationData;
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
    this.setState({ ConversationData: item, ConversationState: true, coversation: item[1].value, conversation: 'View All Conversation ', conversationtoShow: 'All' }, () => { this.getContactNote() })
  }

  // For toggle the Menu drawer when click to menu

  toggleDrawer() {

    this.props.navigationProps.toggleDrawer();

  }

  // For Toggle Update App Notification Prompt

  setOverlayVisible(visible) {
    this.setState({ isvisible: visible });
  }

  // render Dot which indicate the position of page

  _renderDotIndicator() {
    return <PagerDotIndicator
      itemDotStyle={styles.indicatorText}
      selectedItemTextStyle={styles.indicatorSelectedText}
      pageCount={2}
      dotStyle={styles.dot_style}
      selectedDotStyle={styles.selected_dot_style}
    />
  }

  openAttachment = async (item, filename) => {
    console.warn(item, filename)
    console.warn('before : ', this.state.isSpinner);
    if (this.state.isSpinner == false) {
      this.setState({ isSpinner: true });
      console.warn('after :', this.state.isSpinner);
      const localFile = `${RNFS.DocumentDirectoryPath}/ ` + filename;

      const options = {
        fromUrl: item,
        toFile: localFile
      };
      RNFS.downloadFile(options).promise
        .then(() => {
          this.setState({ isSpinner: false });
          setTimeout(() => {
            console.warn('close')
            FileViewer.open(localFile)
          }, 500);

          //   setTimeout(() => this.setState({calendarIsReady: true}), 0);
        })
        .then(() => {
          // success

        })
        .catch(error => {
          // error
        });
    }


  }

  requestWriteFilePermission = async (filepath, filename) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Write Permission",
          message:
            "Write Permission For Save The File",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.downloadAttachment(filepath, filename)
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  downloadAttachment = async (item, filename) => {
    console.warn('dosnload attachement')
    /*.showDirectoryPicker(null, (response) => {
       console.warn('DirectoryPickerManager Response = ', response);
     
       if (response.didCancel) {
         console.warn('User cancelled directory picker');
       }
       else if (response.error) {
         console.warn('DirectoryPickerManager Error: ', response.error);
       }
       else {
         console.warn('Successed................'),
         this.setState({
           directory: response
         });
       }
     });
 */
    //selectDirectory((path) => console.warn(`The path is ${path}`));










    this.setState({ isSpinner: true });

    const { config, fs } = RNFetchBlob

    let path = Platform.OS == 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;
    let options = {
      fileCache: true,
      path: path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: filename,
        description: 'Downloading file.'
      }
    }
    RNFetchBlob.config(options)
      .fetch('GET', item)

      .then((res) => {

        console.log('Files are Saved Into ' + path)
        showMessage({
          message: "",
          description: "Attachment is Downloaded Successfully.",
          type: "success",
        });

        this.setState({ isSpinner: false });
      })
      .catch((err) => { console.log('error') })

  }

  // toggle Display of all note

  toggleAllNote() {

    // Sort the Notes by Created Date

    function custom_sort(a, b) {
      var dateA = new Date(a.date_created).getTime();
      var dateB = new Date(b.date_created).getTime();
      return dateA < dateB ? -1 : 1;
    }

    if (this.state.toggleSingleNote) {

    } else {
      var item = this.state.ProspectData;
      if (this.state.toggleArrow) {
        item.map((x) => {
          x.show = true
        })
      }
      else {
        item.map((x) => {
          x.show = false
        })
      }
      this.setState({ ProspectData: item, forShowItem: true }, () => {
      //  console.warn('toggle data....... : ' , item);
        this.state.ProspectData.sort(custom_sort);

      })
    }
  }

  // apend show key into the ProspectData

  appendShowInItem() {

    var item = this.state.ProspectData;

    item.map((x, i) => {
      if (i == this.state.showNoteContent) {
        x.show = !(x.show)
      }
      this.setState({ ProspectData: item, })

    })

  }


  // change the page when click to name and contact button

  changePage = (setValue, tabValue) => {

    this.viewPager.setPage(setValue);
    this.setState({ selectedTab: tabValue, setPageView: setValue })

  }

  // page selection when the click to render button
  onPageSelected(val) {

    if (val.position) {
      this.setState({ selectedTab: 0 })
    } else {
      this.setState({ selectedTab: 1 })
    }

  }

  // to Update the Component if any item has change

  _shouldItemUpdate = (prev, next) => {
    return prev.item !== next.item;
  }

  // map value to label for the disply coversation label into note

  mapValueTolabel() {

    var item = this.state.ConversationData
    item.map((x) => {
      if (x.value == this.state.conversation) {
        this.setState({ conversationtoShow: x.label })
      }
    })
  }

  // load More Data in which increment offset and call getContactnote for fetch the data from api 
  onRefresh() {
    console.warn('refreshing');
    // this.setState({isFetching:true});
    //  this.getContactNote();
  }
  _handleLoadMore = () => {
    console.warn('hanlde loadrd more.......................')
    this.setState({
      page: this.state.page + 1,
      loadingMore: true,
      isFetching: true,
    },
      () => {
        console.warn('load more........................============================== : ', this.state.page)
        this.getContactNote();
      }
    );
  };

  // render the Loader when Loading Data

  renderFooterNote = () => {

    if (!this.state.loadingMore) return null;

    else if (this.state.loadingMore) {
      return (

        <View
          style={{

            borderColor: "#CED0CE"

          }}
        >

          {/* <ActivityIndicator animating size='small' /> */}

        </View>
      );
    }

  }
  onNoteCall(note) {
   // console.warn("Note..", note);
    let value = note;
    value = value.replace(/<br\s*\/?>/gi, ' ');
  //  console.warn("note123", value);
    return (
      // <Text>{value}</Text>
      <HTML style={[styles.note_list_item_des]} html={value} />
    )
  }
  getWidthPara(path) {
    let filePath = path;
    //  console.warn("path...", path);
    var arr = path.split('.');
    arr[4] = arr[4].toUpperCase();
    var ext = arr[4];
    // console.warn("Extension",ext);
    if (ext == 'JPG' || ext == 'PNG' || ext == 'JPEG' || ext == 'GIF')
      return true;
    else
      return false;
  }
  getExtention(name, path) {
    let filePath = path;
    //   console.warn("path...", path);
    var arr = path.split('.');
    arr[4] = arr[4].toUpperCase();
    var ext = arr[4];
    // console.warn("Extension",ext);
    if (ext == 'JPG' || ext == 'PNG' || ext == 'JPEG' || ext == 'GIF') {
      //console.warn("Ext.. JPG", ext, "FilePath..", filePath);
      // return true;
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '26%', borderWidth: 0.4, borderColor: '#ccc' }}>
          <Image source={{ uri: filePath }} style={[{
            width: 80, height: 80,
          }]} resizeMode="stretch" />
        </TouchableOpacity>
      )
    }
    else if (ext == 'PPT' || ext == 'PPTX') {
     // console.warn("Ext..PPT", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/POWERPOINT.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'WAV') {
     // console.warn("Ext..WAV", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/WAV.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'DOCX' || ext == 'DOC') {
     // console.warn("Ext..WORD", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/WORD.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'TXT') {
    //  console.warn("Ext..TXT", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/TEXT.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'XLS' || ext == 'XLSX') {
    //  console.warn("Ext..XLS", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/EXCEL.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'MP3') {
      //console.warn("Ext..MP3", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{}}>
          <Image source={require('../assets/images/MP3_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'MP4') {
    //  console.warn("Ext..MP4", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/MP4_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'PSD') {
    //  console.warn("Ext..PSD", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/PSD_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'CAD') {
    //  console.warn("Ext..CAD", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{}}>
          <Image source={require('../assets/images/CAD.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'AI') {
   //   console.warn("Ext..AI", ext,);
      return (

        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/AI_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>

      )
    }
    else if (ext == 'KEY') {
   //   console.warn("Ext..KEY", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/KEYNOTE_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'PDF') {
     // console.warn("Ext..PDF", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/PDF.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'AVI') {
    //  console.warn("Ext..AVI", ext,);
      return (

        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/AVI.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'AAC') {
    //  console.warn("Ext..AAC", ext,);
      return (

        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/AAC_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else {
     // console.warn("Ext..ALL", ext);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/AAC.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />
          <Text style={[styles.note_list_item_des], { position: 'absolute', backgroundColor: Colors.primaryColor, color: '#fff', fontSize: 12, padding: 2, textAlignVertical: 'center', marginTop: 27, marginLeft: 9 }}>{name.substring(name.length - 3, name.length)}</Text>
        </TouchableOpacity>
      )
    }

  }
  getExtentionFollowUp(name, path) {

    let filePath = path;
    //console.warn("path...", path);
    var arr = path.split('.');
    arr[4] = arr[4].toUpperCase();
    var ext = arr[4];
    //console.warn("Extension", ext);

    if (ext == 'JPG' || ext == 'PNG' || ext == 'JPEG' || ext == 'GIF') {
    //  console.warn("Ext.. JPG", ext, "FilePath..", filePath);
      // return true;
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '26%', borderWidth: 0.4, borderColor: '#ccc' }}>
          <Image source={{ uri: filePath }} style={[{
            width: 80, height: 80,
          }]} resizeMode="stretch" />
        </TouchableOpacity>
      )
    }
    else if (ext == 'PPT' || ext == 'PPTX') {
    //  console.warn("Ext..PPT", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/POWERPOINT.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'WAV') {
     // console.warn("Ext..WAV", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/WAV.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'DOCX' || ext == 'DOC') {
    //  console.warn("Ext..WORD", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/WORD.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'TXT') {
    //  console.warn("Ext..TXT", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/TEXT.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'XLS' || ext == 'XLSX') {
    //  console.warn("Ext..XLS", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/EXCEL.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'MP3') {
      console.warn("Ext..MP3", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{}}>
          <Image source={require('../assets/images/MP3_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'MP4') {
  //    console.warn("Ext..MP4", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/MP4_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'PSD') {
    //  console.warn("Ext..PSD", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/PSD_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'CAD') {
    //  console.warn("Ext..CAD", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{}}>
          <Image source={require('../assets/images/CAD.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
  
    else if (ext == 'AI') {
   //   console.warn("Ext..AI", ext,);
      return (

        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/AI_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>

      )
    }
    else if (ext == 'KEY') {
   //   console.warn("Ext..KEY", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/KEYNOTE_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'PDF') {
    //  console.warn("Ext..PDF", ext,);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/PDF.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'AVI') {
    //  console.warn("Ext..AVI", ext,);
      return (

        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/AVI.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else if (ext == 'AAC') {
     // console.warn("Ext..AAC", ext,);
      return (

        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/AAC_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

        </TouchableOpacity>
      )
    }
    else {
    //  console.warn("Ext..ALL", ext);
      return (
        <TouchableOpacity onPress={() => { this.openAttachment(filePath, name) }} style={{ width: '15%' }}>
          <Image source={require('../assets/images/AAC.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />
          <Text style={[styles.note_list_item_des], { position: 'absolute', backgroundColor: Colors.primaryColor, color: '#fff', fontSize: 12, padding: 2, textAlignVertical: 'center', marginTop: 27, marginLeft: 9 }}>{name.substring(name.length - 3, name.length)}</Text>
        </TouchableOpacity>
      )
    }

  }
/*
  else if (ext == 'AI') {
    console.warn("File Path12", path.split('.').slice(0, -1).join('.'));
    console.warn("File Name 1234", name.split('.').slice(0, -1).join('.'));
    let FPath = path.split('.').slice(0, -1).join('.');
    let FName = name.split('.').slice(0, -1).join('.');
    console.warn("Ext..AI", ext,);
    return (
      <View style={{ flexDirection: 'row', }}>
        <TouchableOpacity onPress={() => { this.openAttachment(FPath, name) }} style={{}}>
          <Image source={require('../assets/images/AI_2.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />
       
        </TouchableOpacity>

        <Text style={[styles.note_list_item_des], { textAlignVertical: 'center', marginHorizontal: 10, marginTop: 20, width: this.getWidthPara(FPath) ? '44%' : '55%' }}>{FName}</Text>
      </View>
    )
  }*/
  getFileName(name){
   
    
    var arr = name.split('.');
  //  console.warn('arr : ', arr[2]);
   var res = arr[2];
 //  arr[2] = res.toUpperCase();
 //    arr[2] = arr[2].toUpperCase();

    var ext = arr[2];
    if (ext == 'AI' || ext == 'ai') {
     
    //  console.warn("File Name 1234", name.split('.').slice(0, -1).join('.'));
 
      let FName = name.split('.').slice(0, -1).join('.');
     // console.warn("Ext..AI", ext,);
      return (FName)
    }
    else
     return name
  }

  displayAttachemtnsFollowUp(item) {
    return (
      item.attachments.map((val) =>

        <View style={{}}>


          <View style={{ flexDirection: 'row', paddingRight: 5, width: '100%' }}>

            {/* <View style={{width:'26%'}}> */}

            {/* <Image source={require('../assets/images/AAC.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />
                 <Text style={[styles.note_list_item_des], { position: 'absolute', backgroundColor: Colors.primaryColor, color: '#fff', fontSize: 12, padding: 2, textAlignVertical: 'center', marginTop: 27, marginLeft: 9 }}>{val.filename.substring(val.filename.length - 3, val.filename.length)}</Text> */}

            {this.getExtentionFollowUp(val.filename, val.filepath)}
 <Text style={[styles.note_list_item_des], { textAlignVertical: 'center', marginTop: 20, width: this.getWidthPara(val.filepath) ? '44%' : '55%' }}>{this.getFileName(val.filename)}</Text>

           

            {/* </View> */}


            {/* <Text style={[styles.note_list_item_des], {textAlignVertical: 'center', marginTop: 20, width: this.getWidthPara( val.filepath)?'44%':'55%'}}>{val.filename}</Text> */}

            <TouchableOpacity style={{ width: '15%', alignItems: "flex-end" }} onPress={() => { (Platform.OS === 'ios') ? this.downloadAttachment(val.filepath, val.filename) : this.requestWriteFilePermission(val.filepath, val.filename) }}>

              <Image source={require('../assets/images/download.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

            </TouchableOpacity>

            <TouchableOpacity style={{ width: '15%', alignItems: 'flex-end' }} onPress={() => { this.openAttachment(val.filepath, val.filename) }}

            >

              <Image source={require('../assets/images/View.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

            </TouchableOpacity>

          </View>

        </View>
      )
    )
  }
  displayAttachemtns(item) {
    return (
      item.attachments.map((val) =>

        <View style={{}}>


          <View style={{ flexDirection: 'row', paddingRight: 5, width: '100%' }}>

            {/* <View style={{width:'26%'}}> */}

            {/* <Image source={require('../assets/images/AAC.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />
                 <Text style={[styles.note_list_item_des], { position: 'absolute', backgroundColor: Colors.primaryColor, color: '#fff', fontSize: 12, padding: 2, textAlignVertical: 'center', marginTop: 27, marginLeft: 9 }}>{val.filename.substring(val.filename.length - 3, val.filename.length)}</Text> */}

            {this.getExtention(val.filename, val.filepath)}
            {/* </View> */}


            <Text style={[styles.note_list_item_des], { textAlignVertical: 'center', marginTop: 20, width: this.getWidthPara(val.filepath) ? '44%' : '55%' }}>{val.filename}</Text>

            <TouchableOpacity style={{ width: '15%', alignItems: "flex-end" }} onPress={() => { (Platform.OS === 'ios') ? this.downloadAttachment(val.filepath, val.filename) : this.requestWriteFilePermission(val.filepath, val.filename) }}>

              <Image source={require('../assets/images/download.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

            </TouchableOpacity>

            <TouchableOpacity style={{ width: '15%', alignItems: 'flex-end' }} onPress={() => { this.openAttachment(val.filepath, val.filename) }}

            >

              <Image source={require('../assets/images/View.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

            </TouchableOpacity>

          </View>

        </View>
      )
    )
  }

  retunrDateTimeFormatData(dateNtime){
    console.warn('fomate : ' , this.state.appointmentDTformat);
    console.warn('dateNTime ===== : ' , dateNtime);



    let momentObj = moment(dateNtime, 'YYYY-MM-DD h:m:s');
    let timeformate = this.state.appointmentDTformat.time_format;
    timeformate = timeformate.replace('i','m');
    timeformate = timeformate.replace('I','M');
    //console.warn('new formate text : ' , timeformate)
    var dtRes = (moment(momentObj).format(this.state.appointmentDTformat.date_format.toUpperCase() + ' ' +timeformate)).toString();
  //  console.warn('Date Formate : ' , dtRes);

    return dtRes;//dateNtime;

  }
  renderItem = (item, index) => {

    return (

      <View style={{ backgroundColor: Colors.white_color, }}>

        {

          (

            <View style={{ backgroundColor: '#ffffff', paddingTop: 8, paddingBottom: 8 }}>

              {(item.category === 'appointment') ?

                <View style={{ backgroundColor: '#ffffff' }}>

                  <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 10 }}
                    onPress={() => {
                      this.state.ProspectState ?
                        this.setState({ showNoteContent: index, toggleSingleNote: true }, () => { this.appendShowInItem() })
                        : null
                    }
                    }>

                    <View style={{ backgroundColor: Colors.primaryColor, width: 40, height: 40, borderRadius: 40 / 2, justifyContent: 'center', alignItems: 'center' }}>

                      <Image source={require('../assets/images/user.png')} style={[styles.top_image_style, { marginEnd: 0 }]} resizeMode="contain" />

                    </View>

                    <Text style={[styles.list_txt, { flex: 1, marginStart: 10, marginEnd: 5 }]}>{item.user_name + ' set an appointment ' + this.retunrDateTimeFormatData(item.date_created)}</Text>

                    <Image source={item.show ? require('../assets/images/arrow_up.png') : require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { marginTop: 10, alignItems: 'flex-end', tintColor: Colors.primaryColor, justifyContent: 'center' }]} resizeMode="contain" />

                  </TouchableOpacity>

                  {(this.state.forShowItem && (item.show)) ?

                    <View style={{ backgroundColor: Colors.bg_color, paddingStart: 32 }}>

                      <Text style={[styles.list_item_des2]}>{(item.conversation_name === undefined || item.conversation_name === null) ? 'Conversation: ' : 'Conversation: ' + item.conversation_name} </Text>

                      {(item.note === 'undefined') ? '' :

                        <HTML style={[styles.note_list_item_des]} html={item.note} />

                      }

                      {(item.attachments === undefined || item.attachments === null || item.attachments === "null" || item.attachments === '') ? null :

                        <View>

                          <Text style={[styles.list_item_des2]}>{(item.attachments === undefined || item.attachments === null) ? 'Attachments: ' : 'Attachments: '} </Text>

                          {this.displayAttachemtns(item)}
                        </View>
                      }

                      <View style={{ height: 10 }} />

                    </View>

                    :

                    null

                  }

                </View>

                : (item.category === 'followup') ?

                  <View style={{ backgroundColor: '#ffffff' }}>


                    <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 10 }}
                      onPress={() => { this.state.ProspectState ? this.setState({ showNoteContent: index, toggleSingleNote: true }, () => { this.appendShowInItem() }) : null }}>

                      <View style={{ backgroundColor: Colors.primaryColor, width: 40, height: 40, borderRadius: 40 / 2, justifyContent: 'center', alignItems: 'center' }}>

                        <Image source={require('../assets/images/user.png')} style={[styles.top_image_style, { marginEnd: 0 }]} resizeMode="contain" />

                      </View>

                      <Text style={[styles.list_txt, { flex: 1, marginStart: 10, marginEnd: 5 }]}>{item.user_name + ' scheduled a follow-up ' + item.followup_action + ' ' + this.retunrDateTimeFormatData(item.date_created)}</Text>

                      <Image source={item.show ? require('../assets/images/arrow_up.png') : require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { marginTop: 10, alignItems: 'flex-end', tintColor: Colors.primaryColor, justifyContent: 'center' }]} resizeMode="contain" />

                    </TouchableOpacity>

                    <View style={{ backgroundColor: Colors.bg_color }}>

                      {(this.state.forShowItem && (item.show)) ? <View style={{ width: '95%', backgroundColor: Colors.bg_color, paddingStart: 32 }}>

                        <Text style={[styles.list_item_des2]}>{(item.conversation_name === undefined || item.conversation_name === null) ? 'Conversation: ' : 'Conversation: ' + item.conversation_name} </Text>

                        <HTML style={[styles.note_list_item_des,]} html={item.note} />

                        {(item.attachments === undefined || item.attachments === null || item.attachments === "null" || item.attachments === '') ? null :

                          <View >

                            <Text style={[styles.list_item_des2]}>{(item.attachments === undefined || item.attachments === null) ? 'Attachments: ' : 'Attachments: '} </Text>

                            {this.displayAttachemtnsFollowUp(item)}

                          </View>
                        }
                        <View style={{ height: 10 }} />

                      </View>
                        :
                        null
                      }

                    </View>

                  </View>

                  : (item.category === 'note') ?

                    <View style={{ backgroundColor: '#ffffff' }}>

                      <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 10 }}
                        onPress={() => { this.state.ProspectState ? this.setState({ showNoteContent: index, toggleSingleNote: true }, () => { this.appendShowInItem() }) : null }}>

                        <View style={{ backgroundColor: Colors.primaryColor, width: 40, height: 40, borderRadius: 40 / 2, justifyContent: 'center', alignItems: 'center' }}>

                          <Image source={require('../assets/images/user.png')} style={[styles.top_image_style, { marginEnd: 0 }]} resizeMode="contain" />

                        </View>

                        <Text style={[styles.list_txt, { flex: 1, marginStart: 10, marginEnd: 5 }]}>{item.user_name + ' created a note ' + this.retunrDateTimeFormatData(item.date_created)} </Text>

                        <Image source={item.show ? require('../assets/images/arrow_up.png') : require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { marginTop: 10, alignItems: 'flex-end', tintColor: Colors.primaryColor, justifyContent: 'center' }]} resizeMode="contain" />

                      </TouchableOpacity>

                      <View style={{ backgroundColor: Colors.bg_color }}>

                        {(this.state.forShowItem && (item.show)) ? <View style={{ width: '95%', backgroundColor: Colors.bg_color, marginBottom: 10, paddingStart: 32 }}>

                          <Text style={[styles.list_item_des2]}>{(item.conversation_name === undefined || item.conversation_name === null) ? 'Conversation: ' : 'Conversation: ' + item.conversation_name} </Text>

                          {(item.note === 'undefined') ? '' :
                            this.onNoteCall(item.note)

                          }
                          {(item.attachments === undefined || item.attachments === null || item.attachments === "null" || item.attachments === '') ? null :

                            <View>

                              <Text style={[styles.list_item_des2]}>{(item.attachments === undefined || item.attachments === null) ? 'Attachments: ' : 'Attachments: '} </Text>

                              {this.displayAttachemtns(item)}
                            </View>

                          }

                          <View style={{ height: 25 }} />

                        </View>
                          :
                          null
                        }
                      </View>
                    </View>

                    : (item.category === 'sms') ?

                      <View style={{ backgroundColor: '#ffffff' }}>

                        <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 10 }}
                          onPress={() => { this.state.ProspectState ? this.setState({ showNoteContent: index, toggleSingleNote: true }, () => { this.appendShowInItem() }) : null }}>

                          <View style={{ backgroundColor: Colors.primaryColor, width: 40, height: 40, borderRadius: 40 / 2, justifyContent: 'center', alignItems: 'center' }}>

                            <Image source={require('../assets/images/user.png')} style={[styles.top_image_style, { marginEnd: 0 }]} resizeMode="contain" />

                          </View>

                          <Text style={[styles.list_txt, { flex: 1, marginStart: 10, marginEnd: 5 }]}>{item.user_name + ' sends an sms ' + this.retunrDateTimeFormatData(item.date_created)}</Text>

                          <Image source={item.show ? require('../assets/images/arrow_up.png') : require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { marginTop: 10, alignItems: 'flex-end', tintColor: Colors.primaryColor, justifyContent: 'center' }]} resizeMode="contain" />

                        </TouchableOpacity>

                        <View style={{ backgroundColor: Colors.bg_color }}>

                          {(this.state.forShowItem && (item.show)) ? <View style={{ width: '95%', backgroundColor: Colors.bg_color, paddingStart: 32 }}>

                            <Text style={[styles.list_item_des2]}>{(item.conversation_name === undefined || item.conversation_name === null) ? 'Conversation: ' : 'Conversation: ' + item.conversation_name} </Text>

                            {(item.note === 'undefined') ? '' :

                              <HTML style={[styles.note_list_item_des], { marginEnd: 16 }} html={item.note} />

                            }

                            {(item.attachments === undefined || item.attachments === null || item.attachments === "null" || item.attachments === '') ? null :

                              <View>

                                <Text style={[styles.list_item_des2]}>{(item.attachments === undefined || item.attachments === null) ? 'Attachments: ' : 'Attachments: '} </Text>

                                {this.displayAttachemtns(item)}
                              </View>
                            }

                            <View style={{ height: 22 }} />

                          </View>
                            :
                            null
                          }
                        </View>

                      </View>

                      : (item.category === 'note_reply') ?

                        <View style={{ backgroundColor: '#ffffff' }}>

                          <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 16, marginBottom: 10 }}
                            onPress={() => { this.state.ProspectState ? this.setState({ showNoteContent: index, toggleSingleNote: true }, () => { this.appendShowInItem() }) : null }}>

                            <View style={{ backgroundColor: Colors.primaryColor, width: 40, height: 40, borderRadius: 40 / 2, justifyContent: 'center', alignItems: 'center' }}>

                              <Image source={require('../assets/images/user.png')} style={[styles.top_image_style, { marginEnd: 0 }]} resizeMode="contain" />

                            </View>

                            <Text style={[styles.list_txt, { flex: 1, marginStart: 10, marginEnd: 5 }]}>{item.user_name + ' replied to a note ' + this.retunrDateTimeFormatData(item.date_created)}</Text>

                            <Image source={item.show ? require('../assets/images/arrow_up.png') : require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { marginTop: 10, alignItems: 'flex-end', tintColor: Colors.primaryColor, justifyContent: 'center' }]} resizeMode="contain" />

                          </TouchableOpacity>

                          <View style={{ backgroundColor: Colors.bg_color }}>

                            {(this.state.forShowItem && (item.show)) ? <View style={{ width: '95%', backgroundColor: Colors.bg_color, paddingStart: 32 }}>

                              <Text style={[styles.list_item_des2]}>{(item.conversation_name === undefined || item.conversation_name === null) ? 'Conversation: ' : 'Conversation: ' + item.conversation_name} </Text>

                              {(item.note === 'undefined') ? '' :
                                <HTML style={[styles.note_list_item_des]} html={item.note} />
                              }


                              {(item.attachments === undefined || item.attachments === null || item.attachments === "null" || item.attachments === '') ? null :

                                item.attachments.map((val) =>

                                  <View>

                                    <Text style={[styles.list_item_des2]}>{(val === undefined || val === null) ? 'Attachments: ' : 'Attachments: '} </Text>

                                    <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>

                                      <TouchableOpacity >

                                        <Image source={require('../assets/images/AAC.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />
                                        <Text style={[styles.note_list_item_des], { position: 'absolute', backgroundColor: Colors.primaryColor, color: '#fff', fontSize: 12, padding: 2, textAlignVertical: 'center', marginTop: 27, marginLeft: 9 }}>{val.filename.substring(val.filename.length - 3, val.filename.length)}</Text>

                                      </TouchableOpacity >

                                      <Text style={[styles.note_list_item_des], { textAlignVertical: 'center', marginTop: 20, width: '65%', marginLeft: 10 }}>{val.filename}</Text>

                                      <TouchableOpacity onPress={() => { (Platform.OS === 'ios') ? this.downloadAttachment(val.filepath, val.filename) : this.requestWriteFilePermission(val.filepath, val.filename) }}>

                                        <Image source={require('../assets/images/download.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

                                      </TouchableOpacity>

                                      <TouchableOpacity onPress={() => { this.openAttachment(val.filepath, val.filename) }}

                                      >

                                        <Image source={require('../assets/images/View.png')} style={[{ width: 40, height: 40, marginTop: 10, alignItems: 'flex-end', justifyContent: 'center' }]} resizeMode="contain" />

                                      </TouchableOpacity>

                                    </View>

                                  </View>
                                )

                              }

                              <View style={{ height: 22 }} />

                            </View> :
                              null
                            }
                          </View>
                        </View>
                        :
                        null
              }
            </View>
          )
        }
      </View>
    )
  }

  // render Tabs of Name and Contacts

  _renderTabScreen = () => {
    const { height } = Dimensions.get('window');

    return (

      <View style={{ backgroundColor: Colors.white_color, }}>

        <IndicatorViewPager ref={viewPager => { this.viewPager = viewPager; }}
          style={{ height: 150, flex: 1 }}
          initialPage={this.state.setPageView}
          onPageSelected={this.onPageSelected.bind(this)}
          indicator={this._renderDotIndicator()}
        >

          <View style={{ paddingStart: 16, paddingEnd: 16, }} >

            <View style={{ flexDirection: 'row', marginTop: 8 }}>

              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_medium]}>From:</Text>
              <Text style={[{ fontSize: 16, color: Colors.black_color, width: widthPercentageToDP(66) }, font_style.font_light]}> {(this.state.contact_Data.contact_owners === null || this.state.contact_Data.contact_owners === undefined || this.state.contact_Data.contact_owners === "null" || this.state.contact_Data.contact_owners === "undefined") ? '' : this.state.contact_Data.contact_owners.join(', ')}</Text>

            </View>

            <View style={{ flexDirection: 'row' }}>

              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_medium]}>Contact Name:</Text>
              <Text style={[{ fontSize: 16, color: Colors.black_color, width: widthPercentageToDP(60) }, font_style.font_light]}> {(this.state.contact_Data.first_name === null || this.state.contact_Data.first_name === undefined || this.state.contact_Data.first_name === "null" || this.state.contact_Data.first_name === "undefined" || this.state.contact_Data.first_name === "") ? '' : (this.state.contact_Data.last_name === undefined || this.state.contact_Data.last_name === null || this.state.contact_Data.last_name === "undefined" || this.state.contact_Data.last_name === "null" || this.state.contact_Data.last_name === "") ? this.state.contact_Data.first_name : this.state.contact_Data.first_name + ' ' + this.state.contact_Data.last_name}</Text>

            </View>

            <View style={{ flexDirection: 'row' }}>

              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_medium]}>Designation:</Text>
              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_light]}> {(this.state.contact_Data.designation === null || this.state.contact_Data.designation === undefined || this.state.contact_Data.designation === "null" || this.state.contact_Data.designation === "undefined") ? '' : this.state.contact_Data.designation}</Text>

            </View>

            <View style={{ flexDirection: 'row' }}>

              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_medium]}>Company:</Text>
              <Text style={[{ fontSize: 16, color: Colors.black_color, width: widthPercentageToDP(75) }, font_style.font_light]}> {(this.state.contact_Data.company_name === null || this.state.contact_Data.company_name === undefined || this.state.contact_Data.company_name === "null" || this.state.contact_Data.company_name === "undefined") ? ' ' : this.state.contact_Data.company_name} </Text>

            </View>

            <View style={{ alignItems: 'flex-end', alignSelf: 'flex-end', position: 'absolute' }}>

              <TouchableOpacity style={[{
                backgroundColor: Colors.primaryColor,
                justifyContent: 'center',
                marginEnd: 16,
                borderRadius: 32 / 2,
                paddingStart: 24,
                paddingEnd: 24, height: 32,
              }]}
                onPress={() => {
                  this.props.navigation.navigate("AccountSettingSecond", { contactID: this.state.contact_id, companyID: this.state.contact_Data.company_id, contact_type: this.state.contact_Data.categ })

                }}>

                <Text style={[styles.top_view_txt, font_style.font_medium]}>Edit</Text>

              </TouchableOpacity>

            </View>

          </View>

          <View style={{ paddingStart: 16, paddingEnd: 16, }} >

            <View style={{ flexDirection: 'row', marginTop: 8 }}>

              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_medium]}>Office No.:</Text>
              <Image source={require('../assets/images/phone_call.png')} style={styles.top_image_style1} resizeMode="contain" />
              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_light]}> {(this.state.contact_Data.office_number === null || this.state.contact_Data.office_number === undefined || this.state.contact_Data.office_number === "null" || this.state.contact_Data.office_number === "undefined") ? '' : this.state.contact_Data.office_number}</Text>

            </View>

            <View style={{ flexDirection: 'row' }}>

              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_medium]}>Mobile No.:</Text>
              <Image source={require('../assets/images/device.png')} style={styles.top_image_style1} resizeMode="contain" />
              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_light]}> {(this.state.contact_Data.mobile_number === null || this.state.contact_Data.mobile_number === undefined || this.state.contact_Data.mobile_number === "null" || this.state.contact_Data.mobile_number === "undefined") ? '' : this.state.contact_Data.mobile_number}</Text>

            </View>

            <View style={{ flexDirection: 'row' }}>

              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_medium]}>Email Address:</Text>
              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_light]}> {(this.state.contact_Data.email === null || this.state.contact_Data.email === undefined || this.state.contact_Data.email === "null" || this.state.contact_Data.email === "undefined") ? '' : this.state.contact_Data.email}</Text>

            </View>

            <View style={{ flexDirection: 'row' }}>

              <Text style={[{ fontSize: 16, color: Colors.black_color, }, font_style.font_medium]}>Address:</Text>
              <Text style={[{ fontSize: 16, color: Colors.black_color, width: widthPercentageToDP(80) }, font_style.font_light]}> {(this.state.contact_Data.address === null || this.state.contact_Data.address === undefined || this.state.contact_Data.address === "null" || this.state.contact_Data.address === "undefined") ? '' : this.state.contact_Data.address} </Text>

            </View>

            <View style={{ alignItems: 'flex-end', alignSelf: 'flex-end', position: 'absolute' }}>

              <TouchableOpacity style={[{
                backgroundColor: Colors.primaryColor,
                justifyContent: 'center',
                marginEnd: 16,
                borderRadius: 32 / 2,
                paddingStart: 24,
                paddingEnd: 24, height: 32,
              }]}
                onPress={() => {
                  this.props.navigation.navigate("AccountSettingSecond", { contactID: this.state.contact_id, companyID: this.state.contact_Data.company_id, contact_type: this.state.contact_Data.categ })

                }}>

                <Text style={[styles.top_view_txt, font_style.font_medium]}>Edit</Text>

              </TouchableOpacity>

            </View>

          </View>

        </IndicatorViewPager>

        <View style={{ height: 1, backgroundColor: Colors.lighter_gray, marginStart: 16, marginEnd: 16 }} />

        <View style={{ flexDirection: 'row', marginTop: 16, paddingStart: 16, paddingEnd: 16 }}>

          <TouchableOpacity onPress={() => { this.props.navigation.navigate("Appointment", { Screen: 'Prospects', contactID: this.state.contact_id, companyID: this.state.contact_Data.company_id, }) }}>

            <View style={[styles.new_notification]}>

              <Image source={require('../assets/images/Appointment_bg.png')} style={styles.new_notofication_Image_Style} resizeMode="cover"></Image>
              <Text style={[styles.newnotficationtext]}>Appointment</Text>

            </View>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { this.props.navigation.navigate("Followup", { Screen: 'Prospects', contactID: this.state.contact_id, companyID: this.state.contact_Data.company_id, }) }}
            style={[{ marginStart: 10, marginEnd: 4 }]}>


            <View style={[styles.new_notification]}>

              <Image source={require('../assets/images/Follow_up_bg.png')} style={styles.new_notofication_Image_Style} resizeMode="cover"></Image>
              <Text style={[styles.newnotficationtext]}>Follow-up</Text>

            </View>

          </TouchableOpacity>

        </View>

        <View style={{ flexDirection: 'row', marginTop: 2, marginBottom: 20, paddingStart: 16, paddingEnd: 16 }}>

          <TouchableOpacity onPress={() => {
            this.props.navigation.navigate("Opportunity", { contactID: this.state.contact_id, companyID: this.state.contact_Data.company_id, contact_type: this.state.Contact_category, category: 0, selectedTopLayerButton: 'usb' })
          }}>

            <View style={[styles.new_notification]}>

              <Image source={require('../assets/images/opportunity_bg.png')} style={styles.new_notofication_Image_Style} resizeMode="cover"></Image>
              <Text style={[styles.newnotficationtext]}>Opportunities</Text>

            </View>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => { this.props.navigation.navigate("Add", { contactID: this.state.contact_id }) }}
            style={[{ marginStart: 10, marginEnd: 4, flexDirection: 'row' }]}>

            <View style={[styles.follow_up]}>

              <Image source={require('../assets/images/Follow_bg.png')} style={styles.follow_up_Image_style} resizeMode="cover"></Image>
              <Image source={require('../assets/images/note.png')} style={styles.call_btn_style} resizeMode="contain" />
              <Text style={[styles.followtext]}>Add Note</Text>

            </View>

          </TouchableOpacity>

        </View>

        <View style={{ height: 10, backgroundColor: '#f0f0f0' }}></View>

        <View style={{ backgroundColor: '#ffff' }}>

          <View style={{ marginTop: 10, backgroundColor: Colors.white_color, flexDirection: 'row' }}>

            <TouchableOpacity

              style={{ flex: 16.5, marginStart: 4, flexDirection: 'row', alignItems: 'center', height: 46, justifyContent: 'center', }}>

              <Image source={require('../assets/images/pass_note.png')} style={styles.past_note_style} resizeMode="contain" />
              <Text style={[styles.past_note_text, font_style.font_light,]}>Past Notes</Text>

            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { this.setState({ showContent: this.state.showContent, toggleArrow: !(this.state.toggleArrow) }, () => { this.toggleAllNote() }) }}
              style={{ flex: 0.8, alignItems: 'center', height: 46, justifyContent: 'center', marginRight: 15 }}>

              <Image source={(this.state.toggleArrow) ? require('../assets/images/arrow_up.png') : require('../assets/images/arrow_down.png')} style={[styles.past_note_arrow_style]} resizeMode="contain" />

            </TouchableOpacity>

          </View>

          <View activeOpacity={0} style={styles.followTimeRectangle3, { flexDirection: 'row', backgroundColor: '#ffff' }}>

            <ImageBackground source={require('../assets/images/Rectangle_14.png')} style={{ width: '98%', height: '100%', marginLeft: 10, }} resizeMode='cover'>

              <View style={styles.img_view}>

                <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style1, { tintColor: Colors.white_color, zIndex: 999, marginEnd: 12, marginTop: 7 }]} resizeMode="contain" />

              </View>

              <Dropdown
                containerStyle={styles.dropdown_container}
                pickerStyle={{
                  width: '92%', marginTop: 60, marginLeft: 8, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                  shadowOffset: { width: 2, height: -4 },
                  shadowRadius: 21,
                  borderRadius: 46 / 2,
                  backgroundColor: '#ffffff',
                }}
                inputContainerStyle={{
                  marginLeft: 10,
                  borderBottomColor: 'transparent',
                  justifyContent: 'center',
                }}
                selectedItemColor='#222222'
                textColor={Colors.white_color}
                itemColor='#222222'
                baseColor='#ffffff00'
                dropdownPosition={0}
                itemCount={5}
                dropdownOffset={{ top: 10, bottom: -10, left: 0 }}
                dropdownMargins={{ min: 0, max: 0 }}
                data={this.state.ConversationState ? this.state.ConversationData : this.state.conversation}
                value={this.state.conversation}
                // onChangeText={(value) => { this.setState({ coversation: value, conversation: value,page:this.state.page+1 }, () => { this.getContactNote() }) }}
                onChangeText={(value) => { this.setState({ coversation: value, conversation: value, page: 1 }, () => { this.getContactNote() }) }}
              />

            </ImageBackground>

          </View>

        </View>

        <View style={{ marginTop: 16, height: 2, backgroundColor: '#f0f0f0' }}></View>

        <View style={{ flex: 1 }}>

          <FlatList

            // onRefresh={() => this.onRefresh()}
            // refreshing={this.state.loadingMore}
           
            data={this.state.ProspectData}
          //    onEndReached={() => { this._handleLoadMore() }}
            // onEndReachedThreshold={0.5}
            // initialNumToRender={10}
            // onRefresh={console.warn('on efresh.....................')}
            ListFooterComponent={this.renderFooterNote}
            keyExtractor={(item, index) => { return item.id + " " + index }}
            renderItem={({ item, index }) => this.renderItem(item, index)}
             onEndReached={()=>
              {

                console.warn('on end reached ================================ +++++++++++')
            // this.onEndReached.bind(this)

               //this._handleLoadMore()
              }

             }
            onEndReachedThreshold={0.5}
          //  onMomentumScrollBegin={() => { 
          //    console.warn('s croll begin.............');
          //    this.onEndReachedCalledDuringMomentum = false; }}
          />

        </View>

      </View>

    )
  }


  render() {

    return (

      <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
        <Spinner
          visible={this.state.isSpinner}
          textContent={''}

        />


        {/* <Modal
          transparent={true}
          animationType={'none'}
          visible={this.state.isSpinner}
          style={{ zIndex: 1100 }}
          onRequestClose={() => { }}>
          <View style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: '#rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}>
            <View style={{
              backgroundColor: '#FFFFFF',
              height: 100,
              width: 100,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around'
            }}>
              <ActivityIndicator animating={this.state.isSpinner} color={Colors.primary} />

            
             
            </View>
          </View>
        </Modal> */}



        <View style={styles.container}>

          <NavigationEvents
            onDidFocus={() => this.setState({ page: 1 }, () => { this.getContactNote() })}

          />

          <View style={{ backgroundColor: Colors.white_color, padding: 16 }}>

            <View style={{ backgroundColor: Colors.primaryColor, height: 46, borderRadius: 46 / 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 2 }}>

              <TouchableOpacity onPress={() => { this.changePage(0, 1); }} activeOpacity={1}
                style={[{ flex: 1, height: 42, justifyContent: 'center' }, this.state.selectedTab === 0 ? {} : { backgroundColor: Colors.white_color, borderRadius: 42 / 2, }]}>

                <Text style={[styles.tab_text, font_style.font_medium, this.state.selectedTab === 0 ? { color: Colors.white_color } : { color: Colors.primaryColor }]}>Name</Text>

              </TouchableOpacity>

              <TouchableOpacity activeOpacity={1} onPress={() => { this.changePage(1, 0) }}
                style={[{ flex: 1, height: 42, justifyContent: 'center' }, this.state.selectedTab === 1 ? {} : { backgroundColor: Colors.white_color, borderRadius: 42 / 2, }]}>

                <Text style={[styles.tab_text, font_style.font_medium, this.state.selectedTab === 1 ? { color: Colors.white_color } : { color: Colors.primaryColor }]}>Contact</Text>

              </TouchableOpacity>

            </View>

          </View>

          {this._renderTabScreen()}

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

        </View>

      </ScrollView>
    );
  }

}

// Styling Code for UI elements of this page

const styles = StyleSheet.create({

  container: {

    flex: 1,
    backgroundColor: Colors.bg_color,

  },

  tab_text: {

    fontSize: 16,
    color: Colors.primaryColor,
    textAlign: 'center'

  },

  indicatorText: {

    backgroundColor: 'green'

  },

  indicatorSelectedText: {

    color: 'orange'

  },

  top_view_btn: {

    flex: 1,
    backgroundColor: Colors.primaryColor,
    height: 46,
    borderRadius: 46 / 2,
    alignItems: 'center',
    justifyContent: 'center'

  },

  followTimeRectangle3: {

    height: 46,
    width: '90%',
    borderRadius: 46 / 2,
    alignContent: 'center',
    borderRadius: 60,
    paddingStart: 40,
    paddingEnd: 40,
    borderStyle: 'solid',
    borderWidth: 2,

  },

  dropdown_container: {

    width: '100%',
    alignSelf: 'center',
    paddingTop: 4,
    paddingStart: 16,
    paddingEnd: 10,

  },

  call: {

    marginLeft: 15,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 18,
    fontWeight: '900',

  },

  top_image_style1: {

    flexDirection: 'row',
    width: 16, height: 16,
    tintColor: Colors.white_color,
    marginTop: 16,
    marginRight: 36,
    paddingEnd: 16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  img_view: {

    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    paddingEnd: 30,
    marginTop: 12,

  },

  top_view_txt: {

    color: Colors.white_color,
    fontSize: 14,
    textAlign: 'center'

  },

  top_image_style: {

    width: 16, height: 16,
    tintColor: Colors.white_color,
    marginEnd: 4

  },

  top_image_style1: {

    width: 16, height: 16,
    marginLeft: 4,
    marginTop: 4,
    marginEnd: 4

  },

  new_notification: {

    marginBottom: 5,
    width: widthPercentageToDP('45%'),
    flexDirection: 'row',
    height: 46,
    borderRadius: 46 / 2,
    justifyContent: 'center',
    paddingStart: 16,
    paddingEnd: 16,

  },

  follow_up: {

    marginBottom: 10,
    width: widthPercentageToDP('45%'),
    flexDirection: 'row',
    height: 42,
    borderRadius: 42 / 2,
    justifyContent: 'center',
    paddingStart: 16,
    paddingEnd: 16,

  },

  new_notofication_Image_Style: {

    flex: 1,
    position: 'absolute',
    width: widthPercentageToDP('45%'),
    height: 46,
    borderRadius: 46 / 2,

  },

  follow_up_Image_style: {

    flex: 1,
    position: 'absolute',
    width: widthPercentageToDP('45%'),
    height: 46,
    borderRadius: 46 / 2,

  },

  call_btn_style: {

    flexDirection: 'row',
    width: 20, height: 20,
    tintColor: Colors.white_color,
    marginEnd: -15,
    marginStart: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  newnotficationtext: {

    flex: 1,
    marginTop: 12,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    zIndex: 9999,

  },

  followtext: {

    flex: 1,
    marginTop: 12,
    marginLeft: 20,
    justifyContent: 'center',
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    zIndex: 9999,

  },

  past_note_style: {

    width: 24,
    height: 24,
    tintColor: Colors.primaryColor,
    marginEnd: 4

  },

  past_note_arrow_style: {

    width: 16,
    height: 16,
    tintColor: Colors.primaryColor,
    marginEnd: 9

  },

  past_note_text: {

    color: Colors.primaryColor,
    fontSize: 18,
    textAlign: 'center'

  },

  list_txt: {

    color: '#171f24',
    width: '80%',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '400',

  },

  list_txt1: {

    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '600',

  },

  list_item_des: {

    color: '#171f24',
    fontSize: 16,
    marginBottom: 10,
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',

  },

  note_list_item_des: {

    color: '#171f24',
    marginBottom: 10,
    fontSize: 40,
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',

  },

  list_item_des1: {

    marginTop: 10,
    marginBottom: 10,
    color: '#171f24',
    fontSize: 16,
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',

  },

  list_item_des2: {

    marginTop: 10,
    marginBottom: 10,
    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '600',

  },

  dot_style: {

    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: Colors.lighter_gray

  },

  selected_dot_style: {

    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    backgroundColor: Colors.primaryColor

  },

  top_layout: {

    flexDirection: 'row',
    width: 32,
    height: 32,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 5,
    justifyContent: 'center',

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
