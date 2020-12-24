import React from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

class Dashboard extends React.Component {
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

  send = (messages) => {
    messages.forEach((item) => {
      const message = {
        text: item.text,
        timestamp: database.ServerValue.TIMESTAMP,
        user: item.user,
      };

      database().ref('chat').push(message);
    });
  };

  get = (callback) => {
    database()
      .ref('chat')
      .on('child_added', (snapshot) => callback(this.parse(snapshot)));
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
    const currentUserUid = auth().currentUser.uid;

    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.send}
        user={{
          _id: currentUserUid,
        }}
      />
    );
  }
}

export default Dashboard;
