import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const screenWidth = Dimensions.get('screen').width;

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      phonenumber: '',
      day: '',
      month: '',
      year: '',
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
      firstName,
      lastName,
      email,
      phonenumber,
      day,
      month,
      year,
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
            firstName: firstName,
            lastName: lastName,
            email: email,
            phonenumber: phonenumber,
            day: day,
            month: month,
            year: year,
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

  validation() {
    const {
      firstName,
      lastName,
      email,
      phonenumber,
      day,
      month,
      year,
      password,
      confirmPassword,
    } = this.state;

    const passwordAndConfirmPassword =
      password.length !== 0 &&
      confirmPassword.length !== 0 &&
      password === confirmPassword;

    const firstNameAndLastName =
      firstName.length !== 0 && lastName.length !== 0;

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const emailAndPhoneNumber = reg.test(email) && phonenumber.length !== 0;
    const datOfBirth =
      day.length !== 0 && month.length !== 0 && year.length !== 0;

    if (
      passwordAndConfirmPassword &&
      firstNameAndLastName &&
      emailAndPhoneNumber &&
      datOfBirth
    ) {
      return false;
    }

    return true;
  }

  render() {
    const {profileImage} = this.state;

    const placeholderImage =
      'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';
    const imagePath = profileImage ? profileImage : placeholderImage;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.Container}>
        <View style={styles.InformationWrapper}>
          <View style={styles.ImageWrapper}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => this.handleChoosePhoto()}>
              <Image style={styles.styleImage} source={{uri: imagePath}} />
            </TouchableOpacity>
          </View>
          <View style={styles.FullNameWrapper}>
            <TextInput
              style={styles.FullNameInput}
              placeholder="Enter first  name"
              autoCorrect={false}
              onChangeText={(firstName) =>
                this.setState({firstName: firstName})
              }
            />
            <TextInput
              style={styles.FullNameInput}
              placeholder="Enter last name"
              autoCorrect={false}
              onChangeText={(lastName) => this.setState({lastName: lastName})}
            />
          </View>
          <View>
            <TextInput
              style={styles.EmailPhoneNumberInput}
              placeholder="Enter your email"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={(email) => this.setState({email: email})}
            />
            <TextInput
              style={styles.EmailPhoneNumberInput}
              placeholder="Phone Number"
              textContentType={'oneTimeCode'}
              onChangeText={(phonenumber) =>
                this.setState({phonenumber: phonenumber})
              }
            />
          </View>
          <View style={styles.DateOfBirthWrapper}>
            <TextInput
              style={styles.DateOfBirthInput}
              placeholder="Day"
              textContentType={'oneTimeCode'}
              onChangeText={(day) => this.setState({day: day})}
            />
            <TextInput
              style={styles.DateOfBirthInput}
              placeholder="Month"
              textContentType={'oneTimeCode'}
              onChangeText={(month) => this.setState({month: month})}
            />
            <TextInput
              style={styles.DateOfBirthInput}
              placeholder="Year"
              textContentType={'oneTimeCode'}
              onChangeText={(year) => this.setState({year: year})}
            />
          </View>
          <View style={styles.PasswordWrapper}>
            <TextInput
              style={styles.PasswordInput}
              placeholder="Password"
              textContentType={'oneTimeCode'}
              secureTextEntry
              onChangeText={(password) => this.setState({password})}
            />
            <TextInput
              style={styles.PasswordInput}
              placeholder="Confirm password"
              textContentType={'oneTimeCode'}
              secureTextEntry
              onChangeText={(confirmPassword) =>
                this.setState({confirmPassword})
              }
            />
          </View>
          <View style={styles.SignUpWrapper}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.SignUpButton}
              onPress={this.onSignUp}>
              <Text style={styles.ButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    justifyContent: 'space-around',
  },
  ImageWrapper: {
    marginVertical: 20,
    alignItems: 'center',
  },
  styleImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  InformationWrapper: {
    paddingHorizontal: 16,
  },
  FullNameWrapper: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  FullNameInput: {
    fontSize: 15,
    paddingLeft: 10,
    borderRadius: 7,
    paddingVertical: 15,
    backgroundColor: 'white',
    width: screenWidth / 2 - 25,
  },
  EmailPhoneNumberInput: {
    fontSize: 15,
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 7,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  DateOfBirthWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  DateOfBirthInput: {
    borderRadius: 7,
    paddingLeft: 10,
    marginBottom: 10,
    paddingVertical: 15,
    backgroundColor: 'white',
    width: screenWidth / 2 - 90,
  },
  PasswordWrapper: {},
  PasswordInput: {
    fontSize: 15,
    paddingLeft: 10,
    marginBottom: 10,
    borderRadius: 7,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  SignUpWrapper: {
    alignItems: 'center',
    marginTop: 40,
  },
  SignUpButton: {
    borderRadius: 10,
    marginBottom: 120,
    paddingVertical: 15,
    alignItems: 'center',
    width: screenWidth - 32,
    backgroundColor: '#ffd54f',
  },
  ButtonText: {
    fontSize: 15,
    color: 'black',
  },
});

export default Signup;
