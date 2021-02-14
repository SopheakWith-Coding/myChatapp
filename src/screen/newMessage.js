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
import {ScrollView} from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('screen').width;

export default class CreateChat extends React.Component {
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

  chatID = (item) => {
    const chatterID = auth().currentUser.uid;
    const chateeID = item.uuid;
    const chatIDpre = [];
    chatIDpre.push(chatterID);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    return chatIDpre.join('');
  };

  CreateChatRoom = async (call, item, authUserName) => {
    const userName = `${item.name}`;
    const chatID = call(item);
    const welcomeMessage = {
      text: "You're friend on Chatapp",
      createdAt: new Date().getTime(),
    };
    const smgRef = firestore()
      .collection('Chats')
      .doc(chatID)
      .collection('messages');
    const result = await smgRef.where('readed', '==', true).limit(1).get();
    if (result.empty) {
      smgRef.doc().set({
        createdAt: new Date().getTime(),
        ...welcomeMessage,
        system: true,
        readed: true,
      });
    } else {
      smgRef.doc().update({
        createdAt: new Date().getTime(),
        ...welcomeMessage,
        system: true,
        readed: true,
      });
    }

    const {navigation} = this.props;
    navigation.navigate('ChatRoom', {
      item,
      chatID,
      authUserName,
      title: userName,
    });
  };

  render() {
    const {navigation} = this.props;
    const {users} = this.state;
    const {uid} = auth().currentUser;
    const filterAuthUser = users.filter((val) => val.uuid === uid);
    const filterUser = users.filter((val) => val.uuid !== uid);
    const goToImage = {
      uri:
        'https://icon-library.com/images/greater-than-icon/greater-than-icon-9.jpg',
    };
    const groupImage = {
      uri: 'https://static.thenounproject.com/png/58999-200.png',
    };
    return (
      <View style={styles.container}>
        <ScrollView>
          <TouchableOpacity onPress={() => navigation.navigate('New  Group')}>
            <View style={styles.SubContainer}>
              <View style={styles.GroupImageWrapper}>
                <Image
                  style={{width: 40, height: 40, borderRadius: 40}}
                  source={groupImage}
                />
              </View>
              <View style={styles.GroupTextWrapper}>
                <Text style={styles.TextTitle}>Create a New Group</Text>
              </View>
              <View style={styles.NavigationSignWrapper}>
                <Image
                  style={{width: 30, height: 30, borderRadius: 30}}
                  source={goToImage}
                />
              </View>
            </View>
          </TouchableOpacity>
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
                <React.Fragment>
                  {filterAuthUser.map((authUserName) => (
                    <TouchableOpacity
                      onPress={() =>
                        this.CreateChatRoom(this.chatID, item, authUserName)
                      }>
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
                  ))}
                </React.Fragment>
              );
            }}
          />
        </ScrollView>
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
  ScrollViewContainer: {
    flex: 1,
    backgroundColor: 'red',
    height: 20,
  },
  GroupImageWrapper: {
    marginVertical: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  GroupTextWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    width: screenWidth / 2 + 35,
  },
  NavigationSignWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    width: screenWidth / 8 + 20,
  },
});
