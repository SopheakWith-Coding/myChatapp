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

  findLatestMessage = async () => {
    const finedLastMessage = database()
      .ref('chats')
      .orderByChild('text')
      .limitToLast(1)
      .once('value', (snapshot) => snapshot.Text);
  };

  render() {
    console.log(this.findLatestMessage());
    const {users} = this.state;
    const {navigation} = this.props;
    const {uid} = auth().currentUser;

    const filterUser = users.filter((val) => val.uuid !== uid);

    return (
      <View style={styles.container}>
        {filterUser.map((user, key) => {
          const image = user.profileImage
            ? {uri: user.profileImage}
            : {
                uri:
                  'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=',
              };

          const receivemassage = this.findLatestMessage(user.uuid);
          return (
            <TouchableOpacity
              key={key}
              onPress={() =>
                navigation.navigate('ChatRoom', {
                  user,
                  title: `${user.firstName} ${user.lastName}`,
                })
              }>
              <View style={styles.SubContainer}>
                <View style={styles.imageWrapper}>
                  <Image
                    style={{width: 60, height: 60, borderRadius: 50}}
                    source={image}
                  />
                </View>

                <View style={styles.TextWrapper}>
                  <Text style={styles.TextTitle}>
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text style={styles.TextSubTitle}>Helo how are you?</Text>
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
  SubContainer: {
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
  TextTitle: {
    fontSize: 25,
  },
  TextSubTitle: {
    fontSize: 20,
  },
});
