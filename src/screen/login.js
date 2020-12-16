import React from 'react';
import {StyleSheet, View, Button, TextInput} from 'react-native';
import auth from '@react-native-firebase/auth';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  onLogin = () => {
    const {navigation} = this.props;
    const {email, password} = this.state;

    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        alert('Login succesful')
        // navigation.push('ChatScreen');
      })
      .catch((err) => {
        if (err.code === 'auth/wrong-password') {
          alert('Incorrect Password');
        } else if (err.code === 'auth/invalid-email') {
          alert('Invalid Email.');
        }
      });
  };

  render() {
    const {email, password} = this.state;
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <TextInput
            style={styles.textinput}
            placeholder="Enter your email"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(email) => this.setState({email: email})}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Password"
            secureTextEntry
            onChangeText={(password) => this.setState({password: password})}
          />
          <View style={styles.btncontainer}>
            <Button
              title="Log In"
              disabled={email.length === 0 || password.length === 0}
              onPress={this.onLogin}
            />
          </View>
          <View style={styles.btncontainer}>
            <Button
              title="Create an Account"
              onPress={() => navigation.push('SignUpScreen')}
            />
          </View>
        </View>
      </View>
    );
  }
}

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
