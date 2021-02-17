import React from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
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
      authUser: {},
    };
  }

  componentDidMount() {
    this.header();
  }
  CreateGroupChat = () => {
    const {selectedUser} = this.props.route.params;
    const {GroupName} = this.state;
    const welcomeMessage = {
      text: "You're friend on Chatapp",
      createdAt: new Date().getTime(),
    };
    const chatIDpre = [];
    chatIDpre.push();
    chatIDpre.sort();
    selectedUser.map((user) => {
      chatIDpre.push(user.uuid);
    });
    const dbRef = firestore().collection('users');
    selectedUser.forEach((element) => {
      dbRef.doc(element.uuid).collection('friends').doc().set({
        uuid: element.uuid,
        name: GroupName,
        profileImage: '',
        latestMessage: welcomeMessage,
        members: chatIDpre,
        creator: 'dfsjh',
        type: 'GroupChats',
      });
    });

    const {navigation} = this.props;
    selectedUser.map((val) => {
      navigation.navigate('', {selectedUser});
    });
  };

  header = () => {
    const {navigation} = this.props;
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => this.CreateGroupChat()}
          style={{marginRight: 15}}>
          <Text style={{fontSize: 18}}>Create</Text>
        </TouchableOpacity>
      ),
    });
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
            onChangeText={(GroupName) => this.setState({GroupName})}
          />
        </View>
        <ScrollView>
          <View style={{marginLeft: 15, marginBottom: 5}}>
            <Text style={{fontSize: 18}}>{selectedUser.length} MEMBERS</Text>
          </View>
          <FlatList
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
        </ScrollView>
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
