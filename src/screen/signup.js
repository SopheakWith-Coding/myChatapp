import React from 'react';
import {StyleSheet, View, Button, TouchableOpacity, Image} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phonenumber: '',
      datOfBirth: '',
      password: '',
      confirmPassword: '',
      uuid: '',
      profileImage: '',
    };
  }

  onSignUp = () => {
    const {
      name,
      email,
      phonenumber,
      datOfBirth,
      password,
      confirmPassword,
      profileImage,
    } = this.state;

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        const uid = user.user.uid;
        database()
          .ref(`/users/${uid}`)
          .set({
            name: name,
            email: email,
            phonenumber: phonenumber,
            datOfBirth: datOfBirth,
            password: password,
            confirmpassword: confirmPassword,
            profileImage: profileImage,
            uuid: uid,
          })
          .then(() => console.log('Data set.'));
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          alert('Email is already use.');
        } else if (err.code === 'auth/weak-password') {
          alert('The password is too weak.');
        }
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => this.updateProfile}>
              <Image
                style={{width: 120, height: 120, borderRadius: 60}}
                source={{
                  uri:
                    'https://about.abc.net.au/wp-content/uploads/2018/05/JaneConnorsCorpSite-250x250.jpg',
                }}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.textinput}
            placeholder="Enter your name"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(name) => this.setState({name: name})}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Enter your email"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(email) => this.setState({email: email})}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Phone Number"
            textContentType={'oneTimeCode'}
            onChangeText={(phonenumber) =>
              this.setState({phonenumber: phonenumber})
            }
          />
          <TextInput
            style={styles.textinput}
            placeholder="Dat of birth"
            textContentType={'oneTimeCode'}
            onChangeText={(datOfBirth) =>
              this.setState({datOfBirth: datOfBirth})
            }
          />
          <TextInput
            style={styles.textinput}
            placeholder="Password"
            textContentType={'oneTimeCode'}
            secureTextEntry
            onChangeText={(password) => this.setState({password: password})}
          />
          <TextInput
            style={styles.textinput}
            placeholder="Confirm password"
            textContentType={'oneTimeCode'}
            secureTextEntry
            onChangeText={(confirmpassword) =>
              this.setState({confirmpassword: confirmpassword})
            }
          />
          <View style={{alignItems: 'center'}}>
            <View style={styles.btncontainer}>
              <Button title="Sign Up" onPress={this.onSignUp} />
            </View>
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
  subcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
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
  imageWrapper: {
    marginBottom: 20,
  },
});

export default Signup;
