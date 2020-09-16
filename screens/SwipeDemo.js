import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Keyboard,
  View,
} from 'react-native';

import { Overlay } from 'react-native-elements';

import Colors from '../constants/Colors';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { widthPercentageToDP } from 'react-native-responsive-screen';



const dataSource = [
  {
      name: 'Andy',
      age: 12,
      disableRightSwipe: true,
  },
  {
      name: 'Betty',
      age: 11,
      leftOpenValue: 150,
  },
  {
      name: 'Carl',
      age: 11,
  },
];
export default class SwipeDemo extends React.PureComponent {

  // Header and Elements of Header Display and did functionality of header's element 

 

  // Initilise the State variable of this page

  constructor() {

    super();

    this.state = {
     
    }
  }

  // static Variable to update the badge value


  render() {

    return (

      <View style={styles.container}>

        <SafeAreaView>

          {/* Overlay for Update App Notification Prompt */}

         
            <View style={{ marginTop: 30,borderWidth:3,height:200 }}>

              <SwipeListView
                dataSource={dataSource}
                renderItem={(rowData, rowMap) => (
                  <SwipeRow
                    // disableRightSwipe={parseInt(rowId) % 2 !== 0}
                    // disableLeftSwipe={parseInt(rowId) % 2 === 0}
                    // leftOpenValue={20 + parseInt(rowId) * 5}
                    // rightOpenValue={-150}
                  >
                    <View style={[{borderWidth:3}]}>
                      <Text>Left Hidden</Text>
                      <Text>Right Hidden</Text>
                    </View>
                    <View>
                      <Text>Row front </Text>
                    </View>
                  </SwipeRow>
                )}
              />
            </View>

         
        </SafeAreaView>

      </View>

    );
  }

}

// styling Code for UI Elements of this page

const styles = StyleSheet.create({

  container: {

    flex: 1,
    backgroundColor: Colors.lightGray,

  },

  top_layout: {

    paddingTop: 5,
    height: 32,
    paddingRight: 20,
    paddingLeft: 20

  },

  top_image_style: {

    flexDirection: 'row',
    width: 50, height: 50,
    borderRadius: 50 / 2,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  top_image_style1: {

    flexDirection: 'row',
    width: 20, height: 20,
    tintColor: Colors.white_color,
    marginEnd: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  new_notification: {

    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    width: widthPercentageToDP('47%'),
    flexDirection: 'row',
    height: 42,
    borderRadius: 42 / 2,
    justifyContent: 'center',
    paddingStart: 16,
    paddingEnd: 16,
    backgroundColor: '#29dfb4',

  },

  follow_up: {

    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    width: widthPercentageToDP('43%'),
    flexDirection: 'row',
    height: 42,
    borderRadius: 42 / 2,
    justifyContent: 'center',
    paddingStart: 16,
    paddingEnd: 16,
    backgroundColor: '#29dfb4',
  },

  loadMore: {

    marginLeft: widthPercentageToDP(2),
    width: widthPercentageToDP('23%'),
    height: 42,
    alignItems: 'flex-end',

  },

  markAll: {

    marginLeft: widthPercentageToDP(2),
    width: widthPercentageToDP('40%'),
    flexDirection: 'row',
    height: 42,
    alignContent: 'flex-end'

  },

  call_btn_style: {

    flexDirection: 'row',
    width: 20, height: 20,
    tintColor: Colors.white_color,
    marginEnd: -4,
    marginStart: 14,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1

  },

  top_view_btn: {

    marginTop: 10,
    flexDirection: 'row',
    height: 36,
    borderRadius: 36 / 2,
    justifyContent: 'center',
    paddingStart: 16, paddingEnd: 16

  },

  text_style: {

    color: Colors.black_color,
    fontSize: 14,

  },

  image_style: {

    width: 14, height: 14,
    tintColor: Colors.green_start,
    alignItems: 'flex-end',
    justifyContent: 'center',

  },

  followUp1: {

    marginTop: 6,
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 17,
    fontWeight: '600',

  },

  rowFront: {

    alignItems: 'center',
    justifyContent: 'center',

  },

  rowBack: {

    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },

  new_notofication_Image_Style: {

    flex: 1,
    position: 'absolute',
    width: widthPercentageToDP('47%'),
    height: 42,
    borderRadius: 42 / 2,
    backgroundColor: '#f0ab16',

  },

  follow_up_Image_style: {

    flex: 1,
    marginLeft: 20,
    paddingLeft: 20,
    position: 'absolute',
    width: widthPercentageToDP('43%'),
    height: 42,
    borderRadius: 42 / 2,
    backgroundColor: '#f0ab16',

  },

  newnotficationtext: {

    flex: 1,
    marginTop: 10,
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
    marginTop: 10,
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    zIndex: 9999,

  },

  loadMoretext: {

    color: '#4ba5e7',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    alignContent: 'flex-end',
    paddingLeft: widthPercentageToDP(2),

  },

  markAlltext: {

    color: '#4ba5e7',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',

  },

  markAllButton: {
    // alignContent: 'flex-end',
    marginLeft: widthPercentageToDP(65),

  },

  icon: {

    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    margin: 10,

  },

  list_txt: {

    color: Colors.primaryColor,
    fontSize: 18,

  },

  name: {

    color: '#4ba5e7',
    fontFamily: 'Helvetica Neue',
    fontSize: 20,
    fontWeight: '500',

  },

  list_item_des: {

    fontSize: 16,
    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',

  },

  subHeading: {

    width: widthPercentageToDP('47%'),
    color: '#171f24',
    fontFamily: 'Helvetica Neue',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,

  },

  Heading: {

    color: '#333333',
    fontFamily: 'Helvetica Neue',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 31,

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
