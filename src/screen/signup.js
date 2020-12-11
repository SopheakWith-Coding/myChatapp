import React, {useState} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';

const Signup = ({navigation}) => {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    confirmpassword: '',
  });
  const {name, email, password, confirmpassword} = credentials;
  const onLoginPress = () => {
    if (!name) {
      alert('Name is required!');
    } else if (!email) {
      alert('Email is required!');
    } else if (!password) {
      alert('Password is required');
    } else if (password !== confirmpassword) {
      alert('Your password did not match');
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
          placeholder="Enter your name"
          onChangeText={(text) => HandlerOnchange('name', text)}
        />
        <TextInput
          style={styles.textinput}
          placeholder="Enter your email"
          onChangeText={(text) => HandlerOnchange('email', text)}
        />
        <TextInput
          style={styles.textinput}
          placeholder="Password"
          onChangeText={(text) => HandlerOnchange('password', text)}
        />
        <TextInput
          style={styles.textinput}
          placeholder="Confrim password"
          onChangeText={(text) => HandlerOnchange('confirmpassword', text)}
        />
        <View style={{alignItems: 'center'}}>
          <View style={styles.btncontainer}>
            {/* <Button title="Sing Up" onPress={() => navigation.navigate('')} /> */}
            <Button title="Sing Up" onPress={() => onLoginPress()} />
          </View>
          <View style={styles.btncontainer}>
            <Button
              title="Log In"
              onPress={() => navigation.navigate('LogIn')}
            />
          </View>
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
    marginTop: 300,
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
    width: 220,
    borderRadius: 10,
    backgroundColor: '#ffd54f',
    padding: 2,
  },
});
export default Signup;
