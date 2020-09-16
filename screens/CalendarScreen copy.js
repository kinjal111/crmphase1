import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Keyboard,
  ImageBackground,
  SafeAreaView
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { Overlay, Tooltip } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Constant from '../constants/Constant';
import Colors from '../constants/Colors';
import { font_style, textHeader } from '../components/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Dropdown, } from 'react-native-material-dropdown';
import HTML from 'react-native-render-html';
import { Calendar, LocaleConfig, CalendarList, Agenda, calendarListParams, calendarParams, calendarTheme } from 'react-native-calendars';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import { apiBasePath } from '../constantApi';
import ViewMoreText from 'react-native-view-more-text';
import moment from 'moment';

let calendarDate = moment();

let monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

//Define the Locale Configuration for Calendar 

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar', 'April', 'May', 'Jun', 'Jul.', 'Aug', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],

  dayNames: ['S', 'S', 'M', 'T', 'W', 'T', 'F',],
  dayNamesShort: ['S', 'S', 'M', 'T', 'W', 'T', 'F',],

};

// Define Default Locale Configuration for Calendar

LocaleConfig.defaultLocale = 'en';

export default class CalendarScreen extends React.Component {


  static navigationOptions = ({ navigation }) => ({

    headerShown: false,

  });

  // Initilize the State variable and Global Variable

  constructor(props) {

    super(props);
    this.MarkDateForCalendar;
    this.fetchInintialData = this.fetchInintialData.bind(this)
    this.onDayPress = this.onDayPress
    this.state = {
      currentMonth: new Date(),
      calendarDate: '',
      LoginUserDetail: '',
      isvisible: false,
      initialData: '',
      DropdownVisible: false,
      eventShow: false,
      select_company: '',
      printSelecteddate: '',
      selectedDate: '',
      MeetAgentData: '',
      MeetAgentState: true,
      MonthIndex: '',
      displaySelectedDateEvent: false,
      markedDate: '',
      markKeyDate: [],
      selectedDatemarking: '',
      markData: false,
      select_Agent: '',
      data: [
        { title: 'Lorem Ipsum is simply dummy text', show: true },
        { title: 'Lorem Ipsum is simply dummy text', show: false },
        { title: 'Lorem Ipsum is simply dummy text', show: false },
        { title: 'Lorem Ipsum is simply dummy text', show: false },
        { title: 'Lorem Ipsum is simply dummy text', show: false },
        { title: 'Lorem Ipsum is simply dummy text', show: false },
      ],
      LeadList: [
        { value: 'Company' },
        { value: 'Company1' },
        { value: 'company2' }
      ],
      Agent: [
        { value: 'Agent' },
        { value: 'Agent1' },
        { value: 'Agent2' }
      ],
      userData: [],
      calendarData: '',
      date: '',
      month: ' ',
      year: '',
      selectDate: false,
      refresh: false,
      appointmentDTformat: '',
    }
  }

  // set the current and default date of Calendar and get Company Data by calling Api method init

  componentDidMount = async () => {

    var date1 = new Date().getDate(); //Current Date

    var months = monthNames[new Date().getMonth()]; //Current Month
    var year = new Date().getFullYear(); //Current Year
    this.setState({});

    AsyncStorage.getItem('General_Settings')
    .then(req => JSON.parse(req))
    .then(json => {
      this.setState({
        appointmentDTformat: json,
      }, () => {
     

        this.setState({
          //Setting the value of the date time
          date: months + ' ' + date1 + ', ' + year + ' ',
          month: months,
          year: year,
        }, () => { this.fetchInintialData() });




      })
    })
    .catch(error => console.log('error : ' + error));



    


  }

  fetchInintialData = async () => {

    const api_token = await AsyncStorage.getItem(Constant.api_token);
    let formData = new FormData();

    formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
    formData.append('api_token', api_token);
    formData.append('method', 'init');


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

          this.setState({ initialData: str.company_access }, () => { this.modifyCompanyAccessKey() });

        }

      })
      .catch(error => {


        this.setState({ isLoading: false });

      }
      )

  }

  // Fetch the Appointment Meet Agent Data by Calling Api Method appt_meet_agents 

  fetchApointmentMeetAgentData = async () => {

    await AsyncStorage.setItem(Constant.selectedCompany, this.state.select_company);


    const api_token = await AsyncStorage.getItem(Constant.api_token);
    let formData = new FormData();

    formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
    formData.append('api_token', api_token);
    formData.append('method', 'appt_meet_agents');
    formData.append('company_id', this.state.select_company);

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

          this.setState({ MeetAgentData: str.meet_agents }, () => { this.modifyAgentKey() });

        }

      })
      .catch(error => {


        this.setState({ isLoading: false });

      }
      )

  }

  // Fetch the Calendar Data By Calling Api Method get_calendar_data

  fetchCalendarData = async () => {
    const api_token = await AsyncStorage.getItem(Constant.api_token);
    let formData = new FormData();

    formData.append('api_key', 'b4bc8f195a1c926b184f33a466bbc837689b33fe');
    formData.append('api_token', api_token);
    formData.append('method', 'get_calendar_data');
    formData.append('company_id', this.state.select_company);
    formData.append('agent_id', this.state.select_Agent);

    console.warn("FormData...",formData)
    
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
      console.warn("responseJson calendar : " , responseJson);
        str = responseJson;

        if (str.error === 101) {

          AsyncStorage.removeItem(Constant.api_token);
          this.props.navigation.navigate('SignUp')

        }

        else {
          /*for(var i=0;i<str.length;i++){
            var dt = new Date(str[i].date);
            var formate = (this.state.appointmentDTformat.date_format).toUpperCase();
           console.warn(moment(dt).format(formate));
            str[i].date = moment(dt).format(formate)
            
          }*/
          console.warn("JSON DATA...",JSON.stringify(str))
          this.setState({ calendarData: str, refresh: false }, () => { this.createMarkData() });

        }

      })
      .catch(error => {


        this.setState({ isLoading: false });

      }
      )
  }

  // Toggle Visibility of Update App Notification Prompt

  setOverlayVisible(visible) {

    this.setState({ isVisible: visible });

  }

  // Modify Company Data For Make suitable to Dropdown to change key id to value and company_name to label

  modifyCompanyAccessKey = async() => {

    if (this.state.initialData == undefined || this.state.initialData.length == 0 || this.state.initialData == 'null') {

    }
    else {

      const SelectedCompany = await AsyncStorage.getItem(Constant.selectedCompany);


      var item = this.state.initialData;
      item.map((val) => {

        val.value = val.id;
        val.label = val.company_name;
        delete val.company_name
        delete val.id

      })

      if(SelectedCompany === null){

        await AsyncStorage.setItem(Constant.selectedCompany, item[0].value).then(
          this.setState({ initialData: item, LoginUserDetail: str.user_details, select_company: item[0].value }, () => { this.fetchApointmentMeetAgentData() })

        )
      }
      else{

        await AsyncStorage.setItem(Constant.selectedCompany, SelectedCompany).then(
          this.setState({ initialData: item, LoginUserDetail: str.user_details, select_company: SelectedCompany }, () => { this.fetchApointmentMeetAgentData() })
          )
    }

    }

  }

  // Modify Agent Data For Make suitable to Dropdown to change key id to value and name to label

  modifyAgentKey() {

    if (this.state.MeetAgentData == undefined || this.state.MeetAgentData.length == 0 || this.state.MeetAgentData == 'null') {

    }
    else {

      var item = this.state.MeetAgentData;

      item.map((val) => {
        val.value = val.id;
        val.label = val.name;

        delete val.name
        delete val.id
      })
      this.setState({ MeetAgentData: item, MeetAgentState: false, select_Agent: item[0].value }, () => {  this.fetchCalendarData() })
    }
  }

  // Create Mark Data by Processing the Calendar Data and get the value of markKeyDate of state variable

  createMarkData() {

    if (this.state.calendarData == 'null' || this.state.calendarData == undefined || this.state.calendarData.length == 0) {

    }
    else {

      var item = []
      item = this.state.calendarData

      var obj = {}

      for (var i = 0; i < item.length; i++) {
        var t = item[i].date
        var temp = obj.hasOwnProperty(t)

        if (temp) {
          obj[t].dots.push({ "color": item[i].color, "selectedDotColor": item[i].color })
          // console.log(obj[t])

        } else {
          obj[t] = { 
            dots: [{ "color": item[i].color, "selectedDotColor": item[i].color }], "marked": true,
            "selected": false
          }
        }

      }
      this.setState({ markedDate: obj, selectedDate: this.state.date, markData: true });
      console.warn("Marked",this.state.markedDate);

    }

  }


  onRefresh() {

    this.setState({ refresh: true }, () => {
      this.fetchCalendarData()
    })
  }

  // Set Display Date into state Variable to Display date in Same Format

  SetDisplayDateFormat = (Date) => {

    this.setState({ printSelecteddate: monthNames[Date.month - 1] + ' ' + Date.day + ', ' + Date.year })
  }

  // Highlight Selected Day in calendar by markdate object

  highlightSelectDay = () => {

    if (this.state.markedDate.length == 0 || this.state.markedDate === undefined || this.state.markedDate === 'null') {

    }
    else {
     

      const item = this.state.markedDate
      var item1 = []

      
     // var obj = new Object();
     // obj[this.state.selectedDate] = {"dots":[],marked:true,selected:false};
    //  console.warn('obj : ' , obj);

    // item.append(obj);
     // item.push(obj);
    
//console.warn('marked date : ' ,)
      console.warn('item ====:: ', item)
      item1.push(item);

       var obj = new Object();
      obj[this.state.selectedDate] = {"dots":[],marked:true,selected:false};
    //  console.warn('obj : ' , obj);

    // item.append(obj);
    //  item1.push(obj);


     // item1[0][this.state.selectedDate] = {"dots":[],marked:true,selected:false};
     console.warn(item1[0][this.state.selectedDate]? 'true' :'false')
      console.warn('item 1 :: ', item1)
      /*if(!item1[0][this.state.selectedDate]){
        var dt=this.state.selectedDate

     var item2  = [...item1,{ [dt] : {"dots": [], "marked": true, "selected": false}}] ;
    item1= item2;
        console.warn(item2);
    //  data_ = data_ +obj;
      }*/
      item1.map((data_) => {
        console.warn(data_[this.state.selectedDate]? 'true' :'false')
       
        for (date_ in data_) {

          data_[date_].selected = false;
         // console.warn(date_ + " :: " + this.state.selectedDate)
         //  data_[this.state.selectedDate].selected = true;
          if (date_ === this.state.selectedDate) {
            console.warn('selected dte ==' + date_);
            console.warn(data_[date_]);
            data_[date_].selected = true;

          }

          this.setState({ markedDate: data_, selectDate: true }, () => { });
        //  console.warn("Marked...",this.state.markedDate);

        }


      })

    }

  }

  // Display the header and it's elements of this page

  headerRender = () => {

    return (

      <ImageBackground source={require('../assets/images/header_bg.png')} style={{ width: widthPercentageToDP('100%'), }}>

        <SafeAreaView />

        <NavigationEvents
          onDidFocus={() => this.componentDidMount
            ()}

        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, paddingStart: 10, paddingEnd: 10 }}>

          <TouchableOpacity style={[styles.top_layout]} activeOpacity={1}
            onPress={() => { this.props.navigation.goBack(null) }} >

            <Image source={require('./../assets/images/arrow-left.png')}
              style={{ width: 20, height: 20, }} resizeMode="contain" />

          </TouchableOpacity>

          <TouchableOpacity style={[styles.top_layout], { paddingLeft: 10, paddingTop: 7, flex: 0.6 }} activeOpacity={1}
            onPress={() => { this.props.navigation.toggleDrawer(), Keyboard.dismiss() }} >

            <Image source={require('./../assets/images/menu_3x.png')}
              style={{ width: 20, height: 20, }} resizeMode="contain" />

          </TouchableOpacity>

          <Text style={[textHeader.header, { flex: 2.0 }]}>{this.state.month + ' ' + this.state.year}</Text>

          <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>

            {
              (this.state.DropdownVisible) ?
                <TouchableOpacity activeOpacity={1} style={{ marginEnd: 20 }}
                  onPress={() => { this.setState({ DropdownVisible: false }) }} >

                  <LinearGradient
                    colors={[Colors.pink_start, Colors.pink_end]}
                    style={styles.icon_bg}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}>

                    <Image source={require('./../assets/images/user.png')}
                      style={{ width: 20, height: 20, }} resizeMode="contain" />

                  </LinearGradient>

                </TouchableOpacity>

                :

                <TouchableOpacity activeOpacity={1} style={{ marginEnd: 20 }}
                  onPress={() => { this.setState({ DropdownVisible: true }) }} >

                  <Image source={require('./../assets/images/user.png')}
                    style={{ width: 20, height: 20, }} resizeMode="contain" />

                </TouchableOpacity>

            }

            <Tooltip
              ref={ref => (this.tooltip = ref)}
              contentStyle={{ flex: 1, background: '#ffffff', borderRadius: 10, borderWidth: 2, }}
              backgroundColor='#ffffff'
              popover={

                <View>

                  <TouchableOpacity style={{ marginTop: 6, marginBottom: 6, }}
                    onPress={() => { this.props.navigation.navigate('Appointment', { Screen: 'Calendar', companyID: this.state.select_company }), this.tooltip.toggleTooltip(); }} >

                    <View style={{ flexDirection: 'row' }}>

                      <Image source={require('./../assets/images/calender1.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />
                      <Text style={{ marginLeft: 6, fontSize: 14, color: Colors.primaryColor, fontWeight: '400' }}>Add Appointment</Text>

                    </View>

                  </TouchableOpacity>

                  <View style={{ backgroundColor: '#2222', marginLeft: -6, marginTop: 2, width: '106%', marginBottom: 2, height: 1 }} />

                  <TouchableOpacity style={{ marginTop: 6, marginBottom: 6, }}
                    onPress={() => { this.props.navigation.navigate('Event', { EventData: { 'company_id': this.state.select_company, 'user_id': this.state.select_Agent } }), this.tooltip.toggleTooltip(); }} >

                    <View style={{ flexDirection: 'row' }}>

                      <Image source={require('./../assets/images/16909.png')} style={{ width: 20, height: 20, }} resizeMode="contain" />
                      <Text style={{ marginLeft: 6, fontSize: 14, color: Colors.primaryColor, fontWeight: '400' }}>Add Event</Text>

                    </View>

                  </TouchableOpacity>

                </View>
              }
            >

              <Image source={require('./../assets/images/3-layers.png')} style={{ width: 30, height: 30, }} resizeMode="contain" />

            </Tooltip>

          </View>

        </View>

        {

          (this.state.DropdownVisible) ?

            <View>

              <View activeOpacity={1} style={styles.dropdown_view, { flexDirection: 'row', marginTop: 10 }}>

                <ImageBackground source={require('../assets/images/Call_listcompany_bg.png')} style={styles.followTimeRectangle3, { marginStart: 16, width: '96%', borderRadius: 46 / 2 }} resizeMode='contain'>

                  <View style={styles.img_view}>

                    <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { tintColor: Colors.white_color, marginTop: 16, marginEnd: 20 }]} resizeMode="contain" />

                  </View>

                  <Dropdown
                    containerStyle={styles.dropdown_container1}
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
                    textColor='#ffffff'
                    itemColor='#222222'
                    baseColor='#ffffff00'
                    selectedItemColor='#222222'
                    dropdownPosition={0}
                    itemCount={5}
                    dropdownOffset={{ top: 6, bottom: 0 }}
                    dropdownMargins={{ min: 0, max: 0 }}
                    data={(this.state.initialData === undefined || this.state.initialData === null || this.state.initialData === '') ? [] : this.state.initialData}
                    value={this.state.select_company}
                    onChangeText={(value) => { this.setState({ select_company: value }), this.fetchApointmentMeetAgentData() }}
                  />

                </ImageBackground>

              </View>

              <View activeOpacity={1} style={[styles.dropdown_view, styles.margin_style, { marginTop: 10, marginBottom: 10 }]}>

                <ImageBackground source={require('../assets/images/userDropdown_BG.png')} style={styles.followTimeRectangle3, { width: '102%', height: '100%', borderRadius: 46 / 2, }} resizeMode='contain'>

                  <View style={styles.img_view}>

                    <Image source={require('../assets/images/arrow_down.png')} style={[styles.top_image_style, { marginTop: 13, tintColor: Colors.black_color }]} resizeMode="contain" />

                  </View>

                  <Dropdown
                    containerStyle={styles.dropdown_container}
                    pickerStyle={{
                      width: '92%', marginLeft: 16, marginTop: 60, marginStart: 17, paddingStart: 17, shadowColor: 'rgba(0, 0, 0, 0.24)',
                      shadowOffset: { width: 2, height: -4 },
                      shadowRadius: 21,
                      borderRadius: 46 / 2,
                      backgroundColor: '#ffffff'
                    }}
                    inputContainerStyle={{
                      marginLeft: 10,
                      borderBottomColor: 'transparent',
                      justifyContent: 'center',
                    }}
                    textColor='#222222'
                    itemColor='#222222'
                    baseColor='#ffffff00'
                    selectedItemColor='#222222'
                    dropdownPosition={0}
                    itemCount={5}
                    dropdownOffset={{ top: 4, bottom: 0 }}
                    dropdownMargins={{ min: 0, max: 0 }}
                    data={(this.state.MeetAgentState) ? this.state.userData : this.state.MeetAgentData}
                    value={this.state.select_Agent}
                    onChangeText={(value) => { this.setState({ select_Agent: value }), this.fetchCalendarData() }}
                  />

                </ImageBackground>

              </View>

            </View>
            :
            null
        }

      </ImageBackground>

    )
  }

  // Update the month and year when swipe left or right calendar 

  updateCalendarDate() {
console.warn('updateCalendarDate')
    this.setState({
      calendarDate: calendarDate.format('MMMM-DD-YYYY')
    }, () => {
      var Year = calendarDate.year();
      var Month = calendarDate.month();
      var Month1 = this.state.MonthIndex;


      this.setState({ month: monthNames[Month1 - 1] }, () => { })
    });

  }
  renderViewMore(onPress){
    return(
      <Text onPress={onPress}>...</Text>
    )
  }
  renderViewLess(onPress){
    return(
      <Text onPress={onPress}></Text>
    )
  }

  render() {

    return (

      <View style={{ flex: 1, backgroundColor: '#ffffff' }}>

        {this.headerRender()}


        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ffffff', }}
          refreshControl={
            <RefreshControl refreshing={this.state.refresh} onRefresh={this.onRefresh.bind(this)} />} >


          <CalendarList
            current={new Date()}
            horizontal={true}
            markedDates={this.state.markedDate}
            markingType={'multi-dot'}
            onVisibleMonthsChange={(months) => { this.setState({ MonthIndex: months[0].month, year: months[0].year }, () => { this.updateCalendarDate() }) }}
            onDayPress={(date) => this.setState({ selectedDate: date.dateString }, () => {
              this.highlightSelectDay(), this.SetDisplayDateFormat(date)
            }
            )}
            theme={{
              selectedDayBackgroundColor: '#2de2b7',
              selectedDayTextColor: '#ffffff',
              selectedDayBorderRadius: 46 / 2,
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#2d4150',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              monthTextColor: Colors.primaryColor,
              indicatorColor: 'blue',
              textDayFontFamily: 'Helvetica Neue',
              textMonthFontFamily: 'Helvetica Neue',
              textDayHeaderFontFamily: 'Helvetica Neue',
              textDayFontSize: 14,
              textMonthFontSize: 14,
              textDayHeaderFontSize: 14,
              'stylesheet.calendar.header': {
                header: {
                  height: 0,
                  opacity: 0
                }
              }
            }}

            // Enable paging on horizontal, default = false
            pagingEnabled={true}
            firstDay={1}
            showSixWeeks={true}
            hideExtraDays={false}
            calendarWidth={widthPercentageToDP('100%')}
            {...calendarListParams}
            {...calendarParams}
          />

          <View style={{ height: 0.4, marginLeft: 2, width: '102%', backgroundColor: '#bdbdbd' }}></View>

          <View style={{ backgroundColor: '#fff' }}>

            <Text style={[styles.today, { paddingBottom: 8 }]}>{(this.state.printSelecteddate) ? this.state.printSelecteddate : 'Today'}</Text>

          </View>

          <View style={{ backgroundColor: Colors.bg_color }}>

            {

              (this.state.calendarData) ?

                this.state.calendarData.map(item => {
                  
                  if (this.state.selectedDate == item.date) {
                  //  console.warn("Item...",item);
                    return (<TouchableOpacity activeOpacity={1}

                      onPress={() => { this.props.navigation.navigate('Details', { Detail: item , Screen : 'Calendar'}) }} >

                      <View style={{ flexDirection: 'row', marginTop: 8, }}>

                        <View style={{ backgroundColor: item.color, marginLeft: 2, width: 6, borderRadius: 3 }} />

                        <View style={{ flexDirection: 'row', padding: 8, backgroundColor: Colors.white_color, borderRadius: 5, flex: 1, marginStart: 8, justifyContent: 'center', marginEnd: 8 }}>

                          <View style={{ backgroundColor: '#ffffff', height: 60, borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                            <Text style={styles.am}>{item.time}</Text>

                            <View style={{ backgroundColor: item.color, width: 80, height: 30, borderRadius: 50, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                              <Text style={styles.appointment}>{(item.ev_categ === 'appointment') ? 'Appointment' : (item.ev_categ === 'followup') ? 'Followup' : (item.ev_categ === 'event') ? 'Event' : ''}</Text>

                            </View>

                          </View>

                          <View style={{ paddingTop: 8, paddingBottom: 8, flex: 1.5, paddingEnd: 8 }}>

                            <Text style={[styles.chisPlayford]}>{item.title}</Text>

                            {item.location === undefined ?

                              null

                              :

                              <View style={{ flexDirection: 'row', marginTop: 8 }}>

                                <FontAwesome name='map-marker' size={15} style={{ marginEnd: 10, marginTop: 3 }} />
                                <Text style={[styles.bBencoolen]}>{(item.location === "undefined") ? item.postal_code : item.location + ', ' + item.postal_code}</Text>

                              </View>

                            }

                            <View style={{ flexDirection: 'row', marginTop: 8 }}>

                              <FontAwesome name='file' size={10} style={{ marginEnd: 10, marginTop: 3 }} />
                             
                              {item.note === 'undefined' ? null :
                                // <HTML style={[styles.bBencoolen]} html={item.note} />
                                <ViewMoreText
                                numberOfLines={5}
                                renderViewMore={this.renderViewMore}
                                renderViewLess={this.renderViewLess}
                                textStyle={styles.bBencoolen}
                              >
                              <Text>{item.note}</Text>
                              {/* <HTML html = {item.note}/> */}

                              </ViewMoreText>
                              }

                            </View>

                          </View>

                        </View>


                      </View>

                    </TouchableOpacity>
                    )
                  }
                  else {

                  }

                })

                :

                null
            }

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

      </View>
    );
  }
}

// Styling Code for UI elements of this page

const styles = StyleSheet.create({

  top_layout: {

    paddingTop: 7,
    height: 32,
    paddingRight: 10,
    paddingLeft: 10

  },

  container: {

    flex: 1,
    backgroundColor: Colors.white_color,

  },

  dropdown_view: {

    height: 42,
    justifyContent: 'center',
    backgroundColor: Colors.white_shade,
    borderRadius: 42 / 2, paddingEnd: 16

  },

  dropdown_container: {

    width: '100%',
    alignSelf: 'center',
    paddingTop: 4,
    paddingStart: 8,

  },

  dropdown_container1: {

    width: '100%',
    alignSelf: 'center',
    paddingTop: 4,
    paddingStart: 18,

  },

  img_view: {

    alignSelf: 'flex-end',
    position: 'absolute',
    paddingEnd: 16

  },
  margin_style: {

    marginStart: 16,
    marginEnd: 16

  },

  followTimeRectangle3: {

    width: '100%',
    borderRadius: 46 / 2,
    alignContent: 'center',
    borderStyle: 'solid',
    borderWidth: 2,

  },

  followUp: {

    marginTop: 10,
    marginLeft: 16,
    color: '#222222',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '400',

  },

  icon_bg: {

    width: 36,
    height: 36,
    borderRadius: 36 / 2,
    alignItems: 'center',
    justifyContent: 'center',

  },

  top_image_style: {

    width: 16, height: 16,
    tintColor: Colors.black_color,
    alignItems: 'flex-end',
    justifyContent: 'center',

  },

  txt_style: {

    fontSize: 16,
    color: Colors.black_color,
    marginTop: 10,
    marginStart: 16

  },

  list_txt: {

    color: Colors.primaryColor,
    fontSize: 18,

  },

  list_item_des: {

    color: Colors.dark_gray,
    fontSize: 14,

  },

  top_image_style: {

    width: 16, height: 16,
    tintColor: Colors.white_color,

  },

  today: {

    marginTop: 10,
    marginStart: 16,
    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',

  },

  december12: {

    marginTop: 10,
    marginStart: 16,
    color: '#59b6ec',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',

  },

  am: {

    textAlign: 'center',
    justifyContent: 'center',
    width: 100,
    color: '#aab2b7',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21.78,

  },

  Button_bg: {

    marginTop: -20,
    width: '92%',
    height: '100%',
    borderRadius: 100,

  },

  appointment: {

    color: '#ffffff',
    textAlign: 'center',
    justifyContent: 'center',
    fontFamily: 'Helvetica Neue',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21.78,

  },

  chisPlayford: {

    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',

  },

  bBencoolen: {

    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontSize: 14,
    fontWeight: '400',

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

})