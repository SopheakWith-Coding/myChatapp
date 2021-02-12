import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.header();
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
  }

  header = () => {
    const {navigation} = this.props;
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
    });
  };

  send = (messages) => {
    const chatterID = auth().currentUser.uid;
    const {chatID} = this.props.route.params;
    const {item} = this.props.route.params;
    const chateeID = item.creator;
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
    dbRef.doc(chatterID).collection('friends').doc(chatID).update({
      latestMessage: welcomeMessage,
    });
    dbRef.doc(chateeID).collection('friends').doc(chatID).update({
      latestMessage: welcomeMessage,
    });
  };

  render() {
    const authUid = auth().currentUser.uid;
    const {messages} = this.state;
    return (
      <GiftedChat
        messages={messages}
        onSend={this.send}
        user={{
          _id: authUid,
        }}
      />
    );
  }
}

export default ChatRoom;
