import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('screen').width;

export default class CreateChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  async componentDidMount() {
    const dbRef = database().ref('users');
    const data = await dbRef.once('value');
    this.setState({users: Object.values(data.val())});
  }

  goToChat = (data) => {
    const {navigation} = this.props;
    navigation.navigate('Chats', data);
  };

  CreateChatRoom = async (item) => {
    const authUid = auth().currentUser.uid;
    const image = item.profileImage
      ? `${item.profileImage}`
      : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';
    const dbRef = firestore().collection('Chats');
    const userName = `${item.firstName} ${item.lastName}`;
    const welcomeMessage = {
      text: `${userName} created Welcome!`,
      createdAt: new Date().getTime(),
    };

    const result = await dbRef.where('name', '==', userName).get();
    if (result.empty) {
      dbRef
        .add({
          sender: authUid,
          receiver: item.uuid,
          name: userName,
          profileImage: image,
          latestMessage: welcomeMessage,
        })
        .then((docRef) => {
          docRef.collection('MESSAGES').add({
            ...welcomeMessage,
            system: true,
          });
          this.goToChat({
            item,
            title: userName,
          });
        });
    } else {
      this.goToChat({
        item,
        title: userName,
      });
    }
  };

  render() {
    const {users} = this.state;
    const {uid} = auth().currentUser;
    const filterUser = users.filter((val) => val.uuid !== uid);

    return (
      <View style={styles.container}>
        <FlatList
          data={filterUser}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => {
            const image = item.profileImage
              ? {uri: `${item.profileImage}`}
              : {
                  uri:
                    'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=',
                };
            return (
              <TouchableOpacity onPress={() => this.CreateChatRoom(item)}>
                <View style={styles.SubContainer}>
                  <View style={styles.imageWrapper}>
                    <Image
                      style={{width: 50, height: 50, borderRadius: 50}}
                      source={image}
                    />
                  </View>
                  <View style={styles.TextWrapper}>
                    <Text style={styles.TextTitle}>
                      {item.firstName} {item.lastName}
                    </Text>
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
