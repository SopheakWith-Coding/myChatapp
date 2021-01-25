import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
const screenWidth = Dimensions.get('screen').width;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isTrue: false,
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
    const {button} = this.state;

    const {email, password} = this.state;
    const {navigation} = this.props;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={styles.SubContainer}>
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
          <View style={styles.ViewButtonWrapper}>
            <View style={styles.ButtonWrapper}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.ButtonTouchableOpacity}
                disabled={email.length === 0 || password.length === 0}
                onPress={this.onLogin}>
                <Text style={styles.ButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ButtonTouchableOpacity}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.SignUpButton}
                onPress={() => navigation.navigate('Sign Up')}>
                <Text style={styles.ButtonText}>Create an Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  ImageWrapper: {
    marginBottom: 80,
    alignItems: 'center',
  },
  textTitle: {
    marginTop: 20,
    fontSize: 22,
    fontWeight: 'bold',
  },
  SubContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextInput: {
    marginTop: 15,
    lineHeight: 25,
    width: screenWidth - 32,
    padding: 12,
    backgroundColor: 'white',
    fontSize: 18,
    borderRadius: 5,
  },
  ViewButtonWrapper: {
    alignItems: 'center',
    marginTop: 40,
  },
  ButtonWrapper: {
    marginVertical: 15,
  },
  ButtonTouchableOpacity: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    width: screenWidth - 32,
    backgroundColor: '#ffd54f',
  },
  ButtonText: {
    fontSize: 15,
  },
});
export default Login;
