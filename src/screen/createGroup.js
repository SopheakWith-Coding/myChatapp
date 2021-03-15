import React from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('screen').width;
export default class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      GroupName: '',
    };
  }

  componentDidMount() {
    this.header();
  }

  CreateGroupMessages = () => {
    const {authUserItem} = this.props.route.params;
    const {GroupName} = this.state;
    const {membersID} = this.props.route.params;
    const welcomeMessage = {
      text: "You're friend on Chatapp",
      createdAt: new Date().getTime(),
    };
    const groupRef = firestore().collection('messages').doc();
    const chatID = groupRef.id;
    const chats = {
      [chatID]: true,
    };
    const dbRef = firestore().collection('users');
    membersID.forEach((element) => {
      dbRef.doc(element).set({chats}, {merge: true});
    });

    const smgRef = firestore().collection('messages').doc(chatID);
    smgRef.set({
      createdAt: new Date().getTime(),
      ...welcomeMessage,
      system: true,
      readed: true,
      roomID: chatID,
    });
    firestore().collection('channels').doc(chatID).set({
      latestMessage: welcomeMessage,
      name: GroupName,
      members: membersID,
      type: 'GroupChats',
      roomID: chatID,
    });
    const {navigation} = this.props;
    const type = 'GroupChats';
    navigation.navigate('ChatRoom', {
      type,
      authUserItem,
      membersID,
      chatID,
      title: GroupName,
    });
  };

  header = () => {
    const {navigation} = this.props;
    const {GroupName} = this.state;
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={GroupName.length === 0}
          onPress={() => this.CreateGroupMessages()}
          style={{marginRight: 15}}>
          <Text
            style={{
              fontSize: 18,
              color: GroupName.length === 0 ? 'grey' : 'black',
            }}>
            Create
          </Text>
        </TouchableOpacity>
      ),
    });
  };

  totalSelectedUser = () => {
    const {selectedUser} = this.props.route.params;
    return (
      <View style={{marginLeft: 15, marginBottom: 5}}>
        <Text style={{fontSize: 18}}>{selectedUser.length} MEMBERS</Text>
      </View>
    );
  };

  render() {
    const {selectedUser} = this.props.route.params;
    return (
      <View style={styles.container}>
        <View style={{marginTop: 10}}>
          <Text style={{fontSize: 28}}>Name Your new chat</Text>
        </View>
        <View style={styles.GroupNameWrapper}>
          <TextInput
            autoFocus
            style={styles.GroupNameInput}
            placeholder="Group name is required"
            onChangeText={(GroupName) =>
              this.setState({GroupName}, this.header)
            }
          />
        </View>
        <FlatList
          ListHeaderComponent={this.totalSelectedUser}
          data={selectedUser}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            const image = item.profileImage
              ? {uri: `${item.profileImage}`}
              : {
                  uri:
                    'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=',
                };
            return (
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
    justifyContent: 'center',
    width: screenWidth / 2 + 115,
    marginRight: 15,
  },
  TextTitle: {
    fontSize: 18,
  },
  GroupNameWrapper: {
    marginVertical: 10,
    justifyContent: 'center',
    height: 60,
    borderRadius: 30,
    marginHorizontal: 15,
    backgroundColor: 'white',
    width: screenWidth - 30,
  },
  GroupNameInput: {
    marginLeft: 15,
    fontSize: 18,
  },
});
