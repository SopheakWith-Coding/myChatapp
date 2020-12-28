import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const screenWidth = Dimensions.get('screen').width;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: '',
      name: '',
      profileImage: '',
      users: [],
    };
  }

  async componentDidMount() {
    const dbRef = database().ref('users');
    const data = await dbRef.once('value');
    this.setState({users: Object.values(data.val())});
  }

  render() {
    const {uid} = auth().currentUser;
    const {users} = this.state;
    const {navigation} = this.props;
    const filTerUser = users.filter((val) => val.uuid !== uid);

    return (
      <View style={styles.container}>
        {filTerUser.map((user, value) => {
          return (
            <TouchableOpacity
              key={value}
              onPress={() => navigation.navigate('Dashboard')}>
              <View style={styles.subcontainer}>
                <View style={styles.imageWrapper}>
                  <Image
                    style={{width: 60, height: 60, borderRadius: 50}}
                    source={{uri: `${user.profileImage}`}}
                  />
                </View>

                <View style={styles.TextWrapper}>
                  <Text style={styles.texttitle}>{user.name}</Text>
                  <Text style={styles.textsubtitle}>Helo how are you?</Text>
                </View>

                <View style={styles.TimeWrapper}>
                  <Text>9:40pm</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  subcontainer: {
    height: 80,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  imageWrapper: {
    marginTop: 10,
    marginLeft: 10,
  },
  TextWrapper: {
    justifyContent: 'center',
    width: 210,
  },
  TimeWrapper: {
    justifyContent: 'flex-end',
    marginRight: 20,
  },
  texttitle: {
    fontSize: 25,
  },
  textsubtitle: {
    fontSize: 20,
  },
});
