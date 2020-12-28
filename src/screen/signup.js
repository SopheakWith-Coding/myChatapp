import React from 'react';
import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

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
      profileImage: null,
    };
  }

  handleChoosePhoto = async () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(async (image) => {
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.uri;
      const uploadTats = storage().ref(`profileImage/${imageUri}`);
      await uploadTats.putFile(imageUri);
      const url = await storage()
        .ref(`profileImage/${imageUri}`)
        .getDownloadURL();
      this.setState({profileImage: url});
    });
  };

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
    const imagePath = this.state.profileImage;
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <View style={styles.imageWrapper}>
            <TouchableOpacity onPress={() => this.handleChoosePhoto()}>
              {imagePath ? (
                <Image
                  style={styles.styleImage}
                  source={{
                    uri: imagePath,
                  }}
                />
              ) : (
                <Image
                  style={styles.styleImage}
                  source={{
                    uri:
                      'https://about.abc.net.au/wp-content/uploads/2018/05/JaneConnorsCorpSite-250x250.jpg',
                  }}
                />
              )}
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
  styleImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
});

export default Signup;
