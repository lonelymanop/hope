import Navigation from './src/navigation';
import React, { useEffect } from 'react';
// import FlashMessage from "react-native-flash-message";
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { getUserData } from './src/utils/utils';
import { saveUserData } from './src/redux/actions/auth';
import * as Font from 'expo-font'

const App = () => {

useEffect(()=>{
  
  (async()=>{
    const userData = await getUserData()
    console.log("user data App.js",userData)
    if(!!userData){
      saveUserData(userData)
    }  
  })();

  (async () => {
    await Font.loadAsync({
      'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
      'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
      'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
      // MontserratSemiBold : {
      //     uri: require('../assets/fonts/Poppins-Medium.ttf'),
      //     display: Font.FontDisplay.FALLBACK,
      // },
    });
  })();

},[])

  return (
    <Provider store={store}>
      <Navigation/>
    </Provider>
  );
};

export default App;
