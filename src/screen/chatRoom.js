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
    const {chats} = this.props.route.params;
    firestore()
      .collection('Chats')
      .doc(chats._id)
      .collection('MESSAGES')
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

  send = (messages) => {
    const {chats} = this.props.route.params;
    const authUid = auth().currentUser.uid;
    const text = messages[0].text;

    firestore()
      .collection('Chats')
      .doc(chats._id)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: authUid,
        },
      });
    const image = chats.profileImage
      ? `${chats.profileImage}`
      : 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=';
    firestore()
      .collection('Chats')
      .doc(chats._id)
      .update({
        sender: authUid,
        receiver: chats.uuid,
        name: `${chats.name}`,
        profileImage: image,
        latestMessage: {
          text: text,
          createdAt: new Date().getTime(),
        },
      });
  };

  render() {
    const authUid = auth().currentUser.uid;
    const {messages} = this.state;

    // const descendingOrder = messages.sort((receiver, sender) => {
    //   return sender.createdAt - receiver.createdAt;
    // });

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
