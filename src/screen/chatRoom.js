import React from 'react';
import {Dimensions, Platform} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const isIphonex =
  Platform.OS === 'ios' && Dimensions.get('window').height >= 812;
class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      Type: null,
      memberImageUrl: '',
      memberName: '',
    };
  }

  componentDidMount() {
    this.getTypeChat();
    this.header();
    this.fetchChatMessages();
    this.getMemberImageUrl();
  }

  getMemberImageUrl = async () => {
    const {item} = this.props.route.params;
    const authUid = auth().currentUser.uid;
    const memberUid = item.members.filter((member) => member !== authUid)[0];

    try {
      const snapshot = await firestore()
        .collection('users')
        .doc(memberUid)
        .get();
      const userProfile = snapshot.data();

      this.setState({
        memberImageUrl: userProfile.profileImage,
        memberName: userProfile.name,
      });
    } catch (err) {
      alert(err);
    }
  };

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

  groupSend = (messages) => {
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

  chatSend = async (messages) => {
    const {memberImageUrl, memberName} = this.state;
    const {membersID, authUserItem, chatID} = this.props.route.params;
    const authUid = auth().currentUser.uid;
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

    await firestore().collection('channels').doc(chatID).set({
      roomID: chatID,
      latestMessage: welcomeMessage,
      members: membersID,
      creator: authUid,
      type: 'Chats',
      profileImage: memberImageUrl,
      name: memberName,
    });

    await firestore()
      .collection('messages')
      .add({
        roomID: chatID,
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: authUid,
          name: authUserItem.name,
          avatar: authUserItem.profileImage,
        },
      });
  };

  getTypeChat = () => {
    const {type} = this.props.route.params;

    this.setState({Type: type});
  };

  onSend = (messages) => {
    const {Type} = this.state;
    if (Type === 'Chats') {
      this.chatSend(messages);
    } else {
      this.groupSend(messages);
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
    const {messages} = this.state;
    const authUid = auth().currentUser.uid;

    const roomMessages = messages.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return (
      <GiftedChat
        bottomOffset={isIphonex ? 48.5 + 30 : 48.5}
        messages={roomMessages}
        onSend={this.onSend}
        user={{
          _id: authUid,
        }}
        renderBubble={this.renderBubble}
      />
    );
  }
}

export default ChatRoom;
