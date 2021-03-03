import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';

const screenWidth = Dimensions.get('window').width;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUserItem: {},
      users: [],
      UserItem: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.getFriendUsers();
    this.getAuthUser();
    this.getUser();
  }

  getFriendUsers() {
    const authUserID = auth().currentUser.uid;
    firestore()
      .collection('users')
      .doc(authUserID)
      .collection('friends')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            name: '',
            profileImage: '',
            latestMessage: {text: ''},
            ...documentSnapshot.data(),
          };
        });
        this.setState({users: threads});
      });
  }

  getUser = async () => {
    const dbRef = database().ref('users');
    const data = await dbRef.once('value');
    this.setState({UserItem: Object.values(data.val())});
  };

  getAuthUser = async () => {
    const dbRef = database().ref('users');
    const data = await dbRef.once('value');
    const {uid} = auth().currentUser;
    const filterAuthUser = Object.values(data.val()).find(
      (val) => val.uuid === uid,
    );
    this.setState({authUserItem: filterAuthUser});
  };

  renderItem = (item, index) => {
    const {navigation} = this.props;
    const {authUserItem} = this.state;
    const type = item.type;
    const chatIDpre = item.members;
    const chatID = item.roomID;
    const image = item.profileImage;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChatRoom', {
            type,
            item,
            chatIDpre,
            chatID,
            authUserItem,
            title: `${item.name}`,
          })
        }>
        <View style={styles.SubContainer}>
          <View style={styles.imageWrapper}>
            <Image
              style={{width: 50, height: 50, borderRadius: 50}}
              source={{uri: image}}
            />
          </View>

          <View style={styles.TextWrapper}>
            <Text style={styles.TextTitle}>{item.name}</Text>
            <Text style={styles.TextSubTitle}>
              {item.latestMessage.text.slice(0, 90)}
            </Text>
          </View>
          <View style={styles.TimeWrapper}>
            <Text>
              {moment(item.latestMessage.createdAt).format('hh:mm A')}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const {users} = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          data={users}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => this.renderItem(item, index)}
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
    width: screenWidth / 2 + 35,
  },
  TimeWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    marginRight: 15,
    width: screenWidth / 8 + 20,
  },
  TextTitle: {
    fontSize: 18,
  },
  TextSubTitle: {
    fontSize: 14,
  },
});
