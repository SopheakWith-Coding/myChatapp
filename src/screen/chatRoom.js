import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.get((message) => {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, message),
      }));
    });
  }

  get = async (callback) => {
    const {item} = this.props.route.params;
    const senderRef = database()
      .ref('chats')
      .orderByChild('sender')
      .equalTo(item.uuid);
    const senderSnapshot = await senderRef.once('value');
    if (senderSnapshot.val()) {
      senderRef.on('child_added', (snapshot) => callback(this.parse(snapshot)));
    }

    const receiverRef = database()
      .ref('chats')
      .orderByChild('receiver')
      .equalTo(item.uuid);
    const receiverSnapshot = await receiverRef.once('value');
    if (receiverSnapshot.val()) {
      receiverRef.on('child_added', (snapshot) =>
        callback(this.parse(snapshot)),
      );
    }
  };

  send = (messages) => {
    const {item} = this.props.route.params;
    const authUid = auth().currentUser.uid;

    messages.forEach((value) => {
      const message = {
        text: value.text,
        timestamp: database.ServerValue.TIMESTAMP,
        user: value.user,
        receiver: item.uuid,
        sender: authUid,
      };

      database().ref('chats').push(message);
    });
  };

  parse = (message) => {
    const {user, text, timestamp} = message.val();
    const {key: _id} = message;
    const createdAt = new Date(timestamp);
    return {
      _id,
      createdAt,
      text,
      user,
    };
  };

  render() {
    const authUid = auth().currentUser.uid;
    const {messages} = this.state;

    const descendingOrder = messages.sort((receiver, sender) => {
      return sender.createdAt - receiver.createdAt;
    });

    return (
      <GiftedChat
        messages={descendingOrder}
        onSend={this.send}
        user={{
          _id: authUid,
        }}
      />
    );
  }
}

export default ChatRoom;
