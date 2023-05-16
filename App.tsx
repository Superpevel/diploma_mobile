import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from "react-native";
import { NavigationContainer,useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useClock } from 'react-native-timer-hooks'
import CountDownTimer from 'react-native-countdown-timer-hooks';


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  async function loginHandle() {
    try {
      let res = await fetch("http://localhost:8007/login", {
        method: "POST",
        body: JSON.stringify({
          login: email,
          password: password,
        }),
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      });
      let resJson = await res.json();
      if (res.status === 200) {

        try {
          await AsyncStorage.setItem(
            'token',
            resJson.token,
          );
          await AsyncStorage.setItem(
            'rank',
            resJson.rank.toString(),
          );
          await AsyncStorage.setItem(
            'login',
            resJson.login,
          );
          navigation.navigate('MainPage')
          Alert.alert( resJson.login, 'Login Success', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        
        } catch (error) {
          Alert.alert( 'bk', 'My Alert Msg', [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
          
          // Error saving data
        }
        // console.log(resJson.token)
        // localStorage.setItem('token', resJson.token);
        // localStorage.setItem('rank', resJson.rank);
        // localStorage.setItem('login', resJson.login);
        // localStorage.setItem('password', resJson.password);
        // window.location.href = window.location.origin
        // setMessage("User created successfully");
      } else {

        // setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
  
    <View style={styles.container}>
      <Image style={styles.image} source={require("./assets/logo.png")} /> 
      <StatusBar style="auto" />
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Email."
          placeholderTextColor="#003f5c"
          onChangeText={(email) => setEmail(email)}
        /> 
      </View> 
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Password."
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        /> 
      </View> 
      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text> 
      </TouchableOpacity> 

      <TouchableOpacity style={styles.loginBtn}>
      <Button
        onPress={loginHandle}
        title="login"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />

      </TouchableOpacity> 


    </View> 
  );
}

const MainPage = () =>  {
  const navigation = useNavigation();

  const [login, setlogin] = useState('');
  const [token, setToken] = useState('');
  const [imagePlace, setImage] = useState("");
  async function GetQrCode() {  
    try {
      let res = await fetch("http://localhost:8007/api/qr_code/", {
        method: "GET",
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.blob();
      setImage(URL.createObjectURL(data));
      // if (res.status === 200) {
      //     //
      // } else {

      //   // setMessage("Some error occured");
      // }
    } catch (err) {
      Alert.alert( 'bad', 'bad', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      console.log(err);
    }
  };

  async function LogOut() {  
    await AsyncStorage.clear();
    navigation.navigate('LoginPage')
  
  };

  useEffect(() => {
    const fetchData = async () => {
      const login =  await AsyncStorage.getItem('login');
      const token =  await AsyncStorage.getItem('token');

      setlogin(login)
      setToken(token)
    }
    fetchData().catch(console.error)
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome! {login} </Text>
            {imagePlace ? (
        <Image source={{ uri: imagePlace }} style={{ width: 300, height: 300 }} />
      ) : (
        <></>
      )}
      <Button
        onPress={GetQrCode}
        title="Get qr code"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Button
        onPress={() => navigation.navigate('WorkBreak')}
        title="Взять перерыв"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Button
        onPress={LogOut}
        title="Log out"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}



const WorkBreak = () =>  {
  const navigation = useNavigation();

  const [login, setlogin] = useState('');
  const [token, setToken] = useState('');
  const [took_break, setBreak] = useState(true);

  const [imagePlace, setImage] = useState("");
  async function TakeWorkBreak() {  
    try {
      let res = await fetch("http://localhost:8007/api/work_break/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.blob();
      setImage(URL.createObjectURL(data));
      if (res.status === 200) {
        setBreak(false)
        Alert.alert( 'Перерыв Взят!', 'на 15 мин', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      } else {

        // setMessage("Some error occured");
      }
    } catch (err) {
      Alert.alert( 'bad', 'bad', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      console.log(err);
    }
  };

  const refTimer = useRef();

  // For keeping a track on the Timer
  const [timerEnd, setTimerEnd] = useState(false);

  const timerCallbackFunc = (timerFlag) => {
    // Setting timer flag to finished
    setTimerEnd(timerFlag);
    console.warn(
      'You can alert the user by letting him know that Timer is out.',
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const login =  await AsyncStorage.getItem('login');
      const token =  await AsyncStorage.getItem('token');

      setlogin(login)
      setToken(token)
    }
    fetchData().catch(console.error)
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Перерыв</Text>
        {
          took_break ? <Text></Text> : 
            <CountDownTimer
                ref={refTimer}
                timestamp={900}
                timerCallback={timerCallbackFunc}
                containerStyle={{
                  height: 56,
                  width: 120,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 35,
                  backgroundColor: '#2196f3',
                }}
                textStyle={{
                  fontSize: 25,
                  color: '#FFFFFF',
                  fontWeight: '500',
                  letterSpacing: 0.25,
                }}
              />

        }

      <TouchableOpacity
        style={{
          display: timerEnd ? 'flex' : 'none',
          height: 56,
          width: 120,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 35,
          backgroundColor: '#512da8',
        }}
        onPress={() => {
          setTimerEnd(false);
          refTimer.current.resetTimer();
        }}>
        <Text style={{ fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' }}>
          Resend
        </Text>
      </TouchableOpacity>
      <Button
        onPress={() => navigation.navigate('MainPage')}
        title="Вернуться на главную"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <Button
        onPress={TakeWorkBreak}
        title="Взять перерыв"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator>
        {/*Define our routes*/}
        {/* <Stack.Screen name="LoginPage" component={LoginPage} /> */}
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="WorkBreak" component={WorkBreak} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
});


export default App;