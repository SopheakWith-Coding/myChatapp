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

  componentDidMount() {
    this.setRemoteUsers();
  }

  setRemoteUsers = async () => {
    const dbRef = database().ref('users');
    const data = await dbRef.once('value');
    this.setState({users: Object.values(data.val())});
  };

  goToChat = (data) => {
    const {navigation} = this.props;
    navigation.navigate('ChatRoom', data);
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
    const authName = `${authUserName.firstName} ${authUserName.lastName}`;
    const chatID = call(item);
    const chatterID = auth().currentUser.uid;
    const chateeID = item.uuid;
    const image = item.profileImage
      ? `${item.profileImage}`
      : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';
    const userName = `${item.firstName} ${item.lastName}`;
    const welcomeMessage = {
      text: `${userName} created Welcome!`,
      createdAt: new Date().getTime(),
    };
    const chatIDpre = [];
    chatIDpre.push(chatterID);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    const dbRef = firestore().collection('users');
    dbRef
      .doc(chatterID)
      .collection('friends')
      .doc(chatID)
      .set({roomID: chatID});
    dbRef.doc(chatterID).set({
      name: authName,
      profileImage: image,
      latestMessage: welcomeMessage,
      members: chatIDpre,
      creator: chatterID,
    });
    dbRef.doc(chateeID).collection('friends').doc(chatID).set({roomID: chatID});
    dbRef.doc(chateeID).set({
      name: userName,
      profileImage: image,
      latestMessage: welcomeMessage,
      members: chatIDpre,
      creator: chateeID,
    });
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
    navigation.navigate('ChatRoom', {item, chatID, title: userName});
  };

  // CreateChatRoom = async (call, item) => {
  //   const chatID = call(item);
  //   const chatterID = auth().currentUser.uid;
  //   console.log(chatID);
  //   const image = item.profileImage
  //     ? `${item.profileImage}`
  //     : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';
  //   const userName = `${item.firstName} ${item.lastName}`;
  //   const welcomeMessage = {
  //     text: `${userName} created Welcome!`,
  //     createdAt: new Date().getTime(),
  //   };
  //   const dbRef = firestore().collection('messages').doc(chatID);
  //   dbRef.collection('chats').add({
  //     name: userName,
  //     profileImage: image,
  //     latestMessage: welcomeMessage,
  //   });
  //   dbRef.set({
  //     name: userName,
  //     profileImage: image,
  //     latestMessage: welcomeMessage,
  //     // members: chatIDpre,
  //     creator: chatterID,
  //   });
  //   const {navigation} = this.props;
  //   navigation.navigate('ChatRoom', {item, chatID, title: userName});
  // };

  // CreateChatRoom = async (call, item) => {
  //   const receiverId = item.uuid;
  //   const chatID = call(item);
  //   const chatterID = auth().currentUser.uid;
  //   const chateeID = item.uuid;
  //   const userName = `${item.firstName} ${item.lastName}`;
  //   const welcomeMessage = {
  //     text: `${userName} created Welcome!`,
  //     createdAt: new Date().getTime(),
  //   };
  //   const image = item.profileImage
  //     ? `${item.profileImage}`
  //     : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';

  //   const dbRef = firestore().collection('Chats');
  //   const result = await dbRef.where('creator', '==', chatterID).limit(1).get();
  //   if (result.empty) {
  //     dbRef
  //       .add({
  //         name: userName,
  //         profileImage: image,
  //         latestMessage: welcomeMessage,
  //         members: {
  //           [chatterID]: true,
  //           [chateeID]: true,
  //         },
  //         creator: chatterID,
  //       })
  //       .then((docRef) => {
  //         docRef.collection('MESSAGES').add({
  //           ...welcomeMessage,
  //           system: true,
  //         });
  //       });
  //   } else {
  //     dbRef.where('creator', '==', chatID).onSnapshot((querySnapshot) => {
  //       const msg = querySnapshot.docs.map((documentSnapshot) => {
  //         return {
  //           _id: documentSnapshot.id,
  //           name: '',
  //           profileImage: '',
  //           latestMessage: {text: ''},
  //           ...documentSnapshot.data(),
  //         };
  //       });
  //       msg.map((chats) => {
  //         this.goToChat({
  //           chats,
  //           receiverId,
  //           title: userName,
  //         });
  //       });
  //     });
  //   }
  // };

  // CreateChatRoom = async (item) => {
  //   const receiverId = item.uuid;
  //   const authUid = auth().currentUser.uid;
  //   const image = item.profileImage
  //     ? `${item.profileImage}`
  //     : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';
  //   const userName = `${item.firstName} ${item.lastName}`;
  //   const welcomeMessage = {
  //     text: `${userName} created Welcome!`,
  //     createdAt: new Date().getTime(),
  //   };
  //   const dbRef = firestore().collection('Chats');
  //   const result = await dbRef
  //     .where('receiver', '==', receiverId || 'sender', '==', authUid)
  //     .limit(1)
  //     .get();
  //   if (result.empty) {
  //     dbRef
  //       .add({
  //         sender: authUid,
  //         receiver: receiverId,
  //         name: userName,
  //         profileImage: image,
  //         latestMessage: welcomeMessage,
  //       })
  //       .then((docRef) => {
  //         docRef.collection('MESSAGES').add({
  //           ...welcomeMessage,
  //           system: true,
  //         });
  //       });
  //   } else {
  //     dbRef.where('name', '==', userName).onSnapshot((querySnapshot) => {
  //       const msg = querySnapshot.docs.map((documentSnapshot) => {
  //         return {
  //           _id: documentSnapshot.id,
  //           name: '',
  //           profileImage: '',
  //           latestMessage: {text: ''},
  //           ...documentSnapshot.data(),
  //         };
  //       });
  //       msg.map((chats) => {
  //         this.goToChat({
  //           chats,
  //           receiverId,
  //           title: userName,
  //         });
  //       });
  //     });
  //   }
  // };

  render() {
    const {users} = this.state;
    const {uid} = auth().currentUser;
    const filterAuthUser = users.filter((val) => val.uuid === uid);
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
                        <Text style={styles.TextTitle}>
                          {item.firstName} {item.lastName}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </React.Fragment>
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
