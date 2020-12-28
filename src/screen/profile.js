import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const screenWidth = Dimensions.get('screen').width;
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  async componentDidMount() {
    const authUid = auth().currentUser.uid;
    const ref = database().ref(`users/${authUid}`);
    const data = await ref.once('value');
    this.setState({users: data.val()});
  }

  Loutout = () => {
    auth().signOut();
  };

  render() {
    const {users} = this.state;
    console.log(users)
    return (
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={{width: 120, height: 120, borderRadius: 60}}
              source={{
                uri: `${users.profileImage}`,
              }}
            />
          </View>
          <Text style={styles.texttiitle}>{users.name}</Text>
          <Text style={styles.textsubtitle}>{users.phonenumber}</Text>
        </View>

        <View style={styles.informationcontainer}>
          <View style={styles.imageView}>
            <Image
              style={{width: 30, height: 30}}
              source={{
                uri:
                  'https://icon-library.com/images/username-icon-png/username-icon-png-4.jpg',
              }}
            />
          </View>
          <View style={styles.textViewinformation}>
            <Text style={styles.textinformation}>{users.name}</Text>
          </View>
        </View>

        <View style={styles.informationcontainer}>
          <View style={styles.imageView}>
            <Image
              style={{width: 30, height: 30}}
              source={{
                uri:
                  'https://www.clipartmax.com/png/middle/139-1399436_calendar-icons-facebook-date-of-birth-icon.png',
              }}
            />
          </View>
          <View style={styles.textViewinformation}>
            <Text style={styles.textinformation}>{users.datOfBirth}</Text>
          </View>
        </View>

        <View style={styles.informationcontainer}>
          <View style={styles.imageView}>
            <Image
              style={{width: 30, height: 30}}
              source={{
                uri:
                  'https://cdn2.iconfinder.com/data/icons/font-awesome/1792/phone-512.png',
              }}
            />
          </View>
          <View style={styles.textViewinformation}>
            <Text style={styles.textinformation}>{users.phonenumber}</Text>
          </View>
        </View>
        <View style={styles.viewButton}>
          <Button title="Log Out" onPress={this.Loutout} />
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
    height: 250,
    backgroundColor: 'red',
  },
  imageWrapper: {
    marginBottom: 15,
  },
  texttiitle: {
    fontSize: 28,
  },
  textsubtitle: {
    fontSize: 18,
    color: 'lightgrey',
  },
  informationcontainer: {
    backgroundColor: 'white',
    height: 50,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  imageView: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textViewinformation: {
    flex: 1,
    justifyContent: 'center',
  },
  textinformation: {
    marginLeft: 20,
    fontSize: 20,
  },
  viewButton: {
    marginTop: 20,
  },
});
