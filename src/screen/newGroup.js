import React from 'react';
import {
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('screen').width;

export default class newGroupChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUser: [],
      disabledText: false,
    };
  }

  componentDidMount() {
    this.renderNextButton();
    this.getRemoteUsers();
    this.getRemoteAuthUsers();
  }

  renderNextButton = () => {
    const {navigation} = this.props;
    const {selectedUser} = this.state;
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          disabled={selectedUser.length < 2}
          activeOpacity={0.1}
          onPress={() => this.CreateGroupRoom()}
          style={{marginRight: 15}}>
          <Text
            style={{
              fontSize: 18,
              color: selectedUser.length < 2 ? 'gray' : 'black',
            }}>
            Next
          </Text>
        </TouchableOpacity>
      ),
    });
  };

  getRemoteAuthUsers = async () => {
    const authUid = auth().currentUser.uid;
    firestore()
      .collection('users')
      .where('uuid', '==', authUid)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            ...documentSnapshot.data(),
          };
        });
        threads.map((item) => {
          this.setState({authUserItem: item});
        });
      });
  };

  CreateGroupRoom = () => {
    const {navigation} = this.props;
    const {selectedUser} = this.state;
    const {authUserItem} = this.state;
    const authUserID = authUserItem.uuid;
    const chatIDpre = [];
    chatIDpre.push(authUserID);
    selectedUser.map((user) => {
      chatIDpre.push(user.uuid);
    });
    navigation.navigate('Create Group', {
      authUserItem,
      selectedUser,
      chatIDpre,
    });
  };

  getRemoteUsers = async () => {
    const authUid = auth().currentUser.uid;
    firestore()
      .collection('users')
      .where('uuid', '!=', authUid)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            ...documentSnapshot.data(),
          };
        });
        this.setState({users: threads});
      });
  };

  selectedItem = (item) => {
    const helperArray = this.state.selectedUser;
    const index = helperArray.indexOf(item);
    if (helperArray.indexOf(item) > -1) {
      helperArray.splice(index, 1);
      this.setState({toggleCheckBox: false});
    } else {
      helperArray.push(item);
    }
    if (helperArray.length !== 0) {
      this.setState({toggleCheckBox: true});
    } else {
      this.setState({toggleCheckBox: false});
    }
    this.setState({selectedUser: helperArray}, this.renderNextButton);
  };

  render() {
    const {users, selectedUser, toggleCheckBox} = this.state;
    return (
      <View style={styles.container}>
        {toggleCheckBox ? (
          <View style={styles.ShowUser}>
            <FlatList
              horizontal
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
                  <View style={styles.HorizontalContainer}>
                    <View style={styles.HorizontalSubContainer}>
                      <View style={styles.HorizontalImageWrapper}>
                        <Image
                          style={{width: 50, height: 50, borderRadius: 50}}
                          source={image}
                        />
                      </View>
                      <View style={styles.HorizontalTextWrapper}>
                        <Text style={{fontSize: 18}}>{item.name}</Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <View />
        )}

        <FlatList
          data={users}
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
                <View style={styles.CheckBoxWrapper}>
                  <CheckBox
                    disabled={false}
                    style={styles.CheckBox}
                    onValueChange={() => this.selectedItem(item)}
                  />
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
    width: screenWidth / 2 + 70,
  },
  TextTitle: {
    fontSize: 18,
  },
  CheckBoxWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    width: screenWidth / 12,
  },
  CheckBox: {
    width: 25,
    height: 25,
  },
  ShowUser: {
    width: screenWidth,
    height: 140,
    backgroundColor: 'white',
  },
  HorizontalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  HorizontalSubContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  HorizontalImageWrapper: {
    justifyContent: 'center',
    width: 60,
    height: 60,
    alignItems: 'center',
  },
  HorizontalTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    marginVertical: 2,
  },
});
