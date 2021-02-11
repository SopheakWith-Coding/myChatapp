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
    const {receiverId} = this.props.route.params;
    const {chatID} = this.props.route.params;
    const {item} = this.props.route.params;
    const authUid = auth().currentUser.uid;
    const text = messages[0].text;
    const image = item.profileImage
      ? `${item.profileImage}`
      : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';

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
    // firestore()
    //   .collection('users')
    //   .doc()
    //   .update({
    //     sender: authUid,
    //     receiver: receiverId,
    //     name: `${chats.name}`,
    //     profileImage: image,
    //     latestMessage: {
    //       text: text,
    //       createdAt: new Date().getTime(),
    //     },
    //   });
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
