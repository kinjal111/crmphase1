import Toast from 'react-native-root-toast';
import axios from "axios";
import Constant from '../constants/Constant';
import ApiService from '../webservice/ApiService';
import  AsyncStorage  from '@react-native-community/async-storage';


_emailValidate = (text) => {
  
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (reg.test(text) === false) {
    
    return false;
  } else {
   
    return true;
  }
}

// Add a Toast on screen.
toastShow = (msg) => {
  Toast.show(msg, {
    duration: Toast.durations.SHORT,
    position: Toast.positions.BOTTOM,
    shadow: false,
    animation: true,
    hideOnPress: true,
    delay: 0,
    onShow: () => {
      // calls on toast\`s appear animation start
    },
    onShown: () => {
      // calls on toast\`s appear animation end.
    },
    onHide: () => {
      // calls on toast\`s hide animation start.
    },
    onHidden: () => {
      // calls on toast\`s hide animation end.
    }
  });

}

handleClick = () => {
  const min = 1;
  const max = 100;
  const rand = min + Math.random() * (max - min);
  return rand
}

_FoodApiTokenGenerate = () => {
  var headers = {
    "Content-Type": "application/json",
  }
  var body = new FormData();
  body.append('grant_type', 'client_credentials');
  body.append('scope', 'basic')


  var headers = {
    'content-type': 'application/json'
  }

  axios.post(ApiService.TOKEN_URL, body, {
    auth: {
      username: Constant.client_id,
      password: Constant.client_secret,
    }
  }, { headers: headers })
    .then((response) => {
      
      if (response !== null && response.data !== null) {
        if (response.data.access_token !== undefined && response.data.access_token !== null) {
          let dataStore = {
            secret_token: response.data.token_type + " " + response.data.access_token,
            expires_in: response.data.expires_in,
            token_time: Date.now()
          }
          
          AsyncStorage.setItem(Constant.FoodAPI, JSON.stringify(dataStore));
        }


      }
    }).catch((error) => {
      console.error(error);
    });
}

export default {
  _emailValidate,
  toastShow,
  handleClick,
  _FoodApiTokenGenerate
}