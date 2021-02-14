import React from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const screenWidth = Dimensions.get('screen').width;
export default class newGroupChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    this.setRemoteUsers();
  }

  setRemoteUsers = async () => {
    const dbRef = database().ref('users');
    const data = await dbRef.once('value');
    this.setState({users: Object.values(data.val())});
  };

  render() {
    const {users} = this.state;
    const {uid} = auth().currentUser;
    const filterUser = users.filter((val) => val.uuid !== uid);
    return (
      <View style={styles.container}>
        <FlatList
          data={filterUser}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            const image = item.profileImage
              ? {uri: `${item.profileImage}`}
              : {
                  uri:
                    'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=',
                };
            return (
              <TouchableOpacity>
                <View style={styles.SubContainer}>
                  <View style={styles.imageWrapper}>
                    <Image
                      style={{width: 50, height: 50, borderRadius: 50}}
                      source={image}
                    />
                  </View>
                  <View style={styles.TextWrapper}>
                    <Text style={styles.TextTitle}>{item.name}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  SubContainer: {
    height: 80,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  imageWrapper: {
    marginVertical: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  TextWrapper: {
    marginVertical: 1,
    marginRight: 15,
    justifyContent: 'center',
    width: screenWidth - 90,
  },
  TextTitle: {
    fontSize: 18,
  },
});
