import React from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  View,
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
      selectedUser: [],
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
    const {users, selectedUser} = this.state;
    console.log(selectedUser);
    const {uid} = auth().currentUser;
    const filterUser = users.filter((val) => val.uuid !== uid);
    return (
      <View style={styles.container}>
        <View style={styles.ShowUser}>
          <FlatList
            horizontal
            data={selectedUser}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              const image = item.profileImage
                ? {uri: `${item.profileImage}`}
                : {
                    uri:
                      'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=',
                  };
              return (
                <View style={styles.HorizontalContainer}>
                  <View style={styles.HorizontalSubContainer}>
                    <View style={styles.HorizontalImageWrapper}>
                      <Image
                        style={{width: 50, height: 50, borderRadius: 50}}
                        source={image}
                      />
                    </View>
                    <View style={styles.HorizontalTextWrapper}>
                      <Text style={{fontSize: 18}}>{item.name}</Text>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        </View>
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
                <View style={styles.CheckBoxWrapper} />
              </View>
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
    justifyContent: 'center',
    width: screenWidth / 2 + 70,
  },
  TextTitle: {
    fontSize: 18,
  },
  CheckBoxWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    width: screenWidth / 12,
  },
  CheckBox: {
    width: 25,
    height: 25,
  },
  ShowUser: {
    width: screenWidth,
    height: 140,
    backgroundColor: 'white',
  },
  HorizontalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  HorizontalSubContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  HorizontalImageWrapper: {
    justifyContent: 'center',
    width: 60,
    height: 60,
    alignItems: 'center',
  },
  HorizontalTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginVertical: 2,
  },
});
