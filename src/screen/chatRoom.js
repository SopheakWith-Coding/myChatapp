import React from 'react';
import {Dimensions, Platform} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      Type: null,
    };
  }

  componentDidMount() {
    this.getTypeChat();
    this.header();
    this.fetchChatMessages();
  }

  fetchChatMessages = () => {
    const {chatID} = this.props.route.params;
    firestore()
      .collection('Chats')
      .doc(chatID)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();
          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };
          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.displayName,
            };
          }
          return data;
        });
        this.setState({messages: messages});
      });
  };

  header = () => {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
    });
  };

  GroupSend = (messages) => {
    const {chatID} = this.props.route.params;
    const {chatIDpre} = this.props.route.params;
    const authUid = auth().currentUser.uid;
    const text = messages[0].text;
    const welcomeMessage = {
      text: text,
      createdAt: new Date().getTime(),
    };
    firestore()
      .collection('Chats')
      .doc(chatID)
      .collection('messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: authUid,
        },
      });
    const dbRef = firestore().collection('users');
    chatIDpre.forEach((element) => {
      dbRef.doc(element).collection('friends').doc(chatID).update({
        latestMessage: welcomeMessage,
      });
    });
  };

  ChatsSend = (messages) => {
    const {chatID} = this.props.route.params;
    const {item} = this.props.route.params;
    const authUid = auth().currentUser.uid;
    const {authUserName} = this.props.route.params;
    const chatterID = auth().currentUser.uid;
    const chateeID = item.uuid;
    const text = messages[0].text;
    const welcomeMessage = {
      text: text,
      createdAt: new Date().getTime(),
    };
    const userName = `${item.name}`;
    const authName = authUserName.name;
    const image = item.profileImage
      ? `${item.profileImage}`
      : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';
    const authImage = authUserName.profileImage
      ? `${item.profileImage}`
      : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';
    const membersID = [];
    membersID.push(chatterID);
    membersID.push(chateeID);
    membersID.sort();
    const dbRef = firestore().collection('users');
    dbRef.doc(chatterID).collection('friends').doc(chatID).set({
      uuid: chateeID,
      roomID: chatID,
      name: userName,
      profileImage: image,
      latestMessage: welcomeMessage,
      members: membersID,
      creator: chateeID,
      type: 'Chats',
    });
    dbRef.doc(chateeID).collection('friends').doc(chatID).set({
      uuid: chatterID,
      roomID: chatID,
      name: authName,
      profileImage: authImage,
      latestMessage: welcomeMessage,
      members: membersID,
      creator: chatterID,
      type: 'Chats',
    });
    firestore()
      .collection('Chats')
      .doc(chatID)
      .collection('messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: authUid,
        },
      });
  };

  getTypeChat = () => {
    const {type} = this.props.route.params;
    this.setState({Type: type});
  };

  callSendFunction = (messages) => {
    const {Type} = this.state;
    if (Type == 'Chats') {
      this.ChatsSend(messages);
    } else {
      this.GroupSend(messages);
    }
  };

  render() {
    const authUid = auth().currentUser.uid;
    const {messages} = this.state;
    const isIphoneX =
      Platform.OS === 'ios' && Dimensions.get('window').height >= 812;

    return (
      <GiftedChat
        bottomOffset={isIphoneX ? 48.5 + 30 : 48.5}
        messages={messages}
        onSend={this.callSendFunction}
        user={{
          _id: authUid,
        }}
      />
    );
  }
}

export default ChatRoom;
