import React from 'react';
import {Dimensions, Platform} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
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
      .collection('messages')
      .where('roomID', '==', chatID)
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
    const {authUserItem} = this.props.route.params;
    const authUserName = authUserItem.name;
    const authUserProfile = authUserItem.profileImage;
    const {chatID} = this.props.route.params;
    const authUid = auth().currentUser.uid;
    const text = messages[0].text;
    const welcomeMessage = {
      text: text,
      createdAt: new Date().getTime(),
    };
    firestore()
      .collection('messages')
      .add({
        roomID: chatID,
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: authUid,
          name: authUserName,
          avatar: authUserProfile,
        },
      });
    firestore().collection('channels').doc(chatID).update({
      latestMessage: welcomeMessage,
    });
    const dbRef = firestore().collection('messages');
    dbRef.doc(chatID).update({
      latestMessage: welcomeMessage,
    });
  };

  ChatsSend = (messages) => {
    const {membersID} = this.props.route.params;
    const {authUserItem} = this.props.route.params;
    const authUserName = authUserItem.name;
    const authUserProfile = authUserItem.profileImage;
    const {chatID} = this.props.route.params;
    const authUid = auth().currentUser.uid;
    const chatterID = auth().currentUser.uid;
    const text = messages[0].text;
    const welcomeMessage = {
      text: text,
      createdAt: new Date().getTime(),
    };
    const dbRef = firestore().collection('users');
    const chats = {
      [chatID]: true,
    };

    membersID.forEach((element) => {
      dbRef.doc(element).set({chats}, {merge: true});
    });
    firestore().collection('channels').doc(chatID).set({
      roomID: chatID,
      latestMessage: welcomeMessage,
      members: membersID,
      creator: chatterID,
      type: 'Chats',
    });

    firestore()
      .collection('messages')
      .add({
        roomID: chatID,
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: authUid,
          name: authUserName,
          avatar: authUserProfile,
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

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {backgroundColor: '#ECF87F'},
          right: {backgroundColor: '#2EB5E0'},
        }}
      />
    );
  };

  render() {
    const authUid = auth().currentUser.uid;
    const {messages} = this.state;
    const isIphoneX =
      Platform.OS === 'ios' && Dimensions.get('window').height >= 812;
    const smg = messages.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });
    return (
      <GiftedChat
        bottomOffset={isIphoneX ? 48.5 + 30 : 48.5}
        messages={smg}
        onSend={this.callSendFunction}
        user={{
          _id: authUid,
        }}
        renderBubble={this.renderBubble}
      />
    );
  }
}

export default ChatRoom;
