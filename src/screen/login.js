import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  TextInput,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('screen').width;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  onLogin = () => {
    const {email, password} = this.state;
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {})
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
        <View style={styles.ImageWrapper}>
          <Image
            style={{width: 120, height: 120, borderRadius: 60}}
            source={{
              uri:
                'https://image.freepik.com/free-vector/colorful-logo-chat_1017-1721.jpg',
            }}
          />
          <Text style={styles.textTitle}>SIGN IN</Text>
        </View>
        <View style={styles.SubContainer}>
          <TextInput
            style={styles.TextInput}
            placeholder="Enter your email"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(email) => this.setState({email: email})}
          />
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            secureTextEntry
            onChangeText={(password) => this.setState({password: password})}
          />
          <View style={styles.BtnContainer}>
            <Button
              title="Log In"
              disabled={email.length === 0 || password.length === 0}
              onPress={this.onLogin}
            />
          </View>
          <View style={styles.BtnContainer}>
            <Button
              title="Create an Account"
              onPress={() => navigation.navigate('Sign Up')}
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
  },
  ImageWrapper: {
    marginVertical: 40,
    alignItems: 'center',
  },
  textTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },
  SubContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextInput: {
    marginTop: 15,
    lineHeight: 25,
    width: screenWidth - 40,
    padding: 12,
    backgroundColor: 'white',
    fontSize: 18,
    borderRadius: 5,
  },
  BtnContainer: {
    marginTop: 15,
    width: screenWidth - 40,
    borderRadius: 10,
    backgroundColor: '#ffd54f',
    padding: 2,
  },
});
export default Login;
