import React, {useState} from 'react';
import {StyleSheet, View, Button, TextInput} from 'react-native';

const Login = ({navigation}) => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const {email, password} = credentials;
  const onLoginPress = () => {
    if (!email) {
      alert('Email is required!');
    } else if (!password) {
      alert('Password is required');
    } else {
      navigation.navigate('DashBoard');
    }
  };

  const HandlerOnchange = (name, value) => {
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <TextInput
          style={styles.textinput}
          placeholder="Enter your email"
          onChangeText={(text) => HandlerOnchange('email', text)}
        />
        <TextInput
          style={styles.textinput}
          placeholder="Password"
          // secureTextEntry="true"
          onChangeText={(text) => HandlerOnchange('password', text)}
        />
        <View style={styles.btncontainer}>
          {/* <Button title="LOG IN" onPress={() => navigation.navigate('')} /> */}
          <Button title="LOG IN" onPress={() => onLoginPress()} />
        </View>
        <View style={styles.btncontainer}>
          <Button
            title="CREATE NEW ACCOUNT"
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  subcontainer: {
    marginTop: 400,
    marginHorizontal: 10,
  },
  textinput: {
    marginTop: 15,
    lineHeight: 25,
    width: 395,
    padding: 12,
    backgroundColor: 'white',
    fontSize: 18,
    borderRadius: 5,
  },
  btncontainer: {
    marginTop: 15,
    width: 395,
    borderRadius: 10,
    backgroundColor: '#ffd54f',
    padding: 2,
  },
});
export default Login;
