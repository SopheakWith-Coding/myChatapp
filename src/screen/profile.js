import React from 'react';
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
      user: null,
    };
  }

  async componentDidMount() {
    const authUid = auth().currentUser.uid;
    const ref = database().ref(`users/${authUid}`);
    const data = await ref.once('value');
    this.setState({user: data.val()});
  }

  Loutout = () => {
    auth().signOut();
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
          <Text style={styles.texttiitle}>Sopheak Seng</Text>
          <Text style={styles.textsubtitle}>+855 0969655222</Text>
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
            <Text style={styles.textinformation}>Seng Sopheak</Text>
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
            <Text style={styles.textinformation}>02 April 1999</Text>
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
            <Text style={styles.textinformation}>0969655222</Text>
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
