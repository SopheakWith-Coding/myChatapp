import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {FlatList} from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('screen').width;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uuid: '',
      name: '',
      profileImage: '',
      users: [],
      messages: [],
    };
  }

  async componentDidMount() {
    this.findLatestMessage();
    const dbRef = database().ref('users');
    const data = await dbRef.once('value');
    this.setState({users: Object.values(data.val())});
  }

  findLatestMessage = async () => {
    const LastMessage = database()
      .ref('chats')
      .orderByChild('timestamp')
      .limitToLast(1);
    const findMessage = await LastMessage.once('value');
    this.setState({messages: Object.values(findMessage.val())});
  };

  render() {
    const {messages} = this.state;
    const {users} = this.state;
    const {navigation} = this.props;
    const {uid} = auth().currentUser;

    const filterUser = users.filter((val) => val.uuid !== uid);

    return (
      <View style={styles.container}>
        <FlatList
          data={filterUser}
          keyExtractor={(item) => item._id}
          renderItem={({item}) => {
            const image = item.profileImage
              ? {uri: item.profileImage}
              : {
                  uri:
                    'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=',
                };
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ChatRoom', {
                    item,
                    title: `${item.firstName} ${item.lastName}`,
                  })
                }>
                <View style={styles.SubContainer}>
                  <View style={styles.imageWrapper}>
                    <Image
                      style={{width: 50, height: 50, borderRadius: 50}}
                      source={image}
                    />
                  </View>

                  <View style={styles.TextWrapper}>
                    <Text style={styles.TextTitle}>
                      {item.firstName} {item.lastName}
                    </Text>
                    {messages.map((val) => {
                      return (
                        <Text style={styles.TextSubTitle}>{val.text}</Text>
                      );
                    })}
                  </View>
                  <View style={styles.TimeWrapper}>
                    {messages.map((val) => {
                      return (
                        <Text>{moment(val.timestamp).format('hh:mm A')}</Text>
                      );
                    })}
                  </View>
                </View>
              </TouchableOpacity>
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
    backgroundColor: 'green',
  },
  SubContainer: {
    height: 80,
    width: screenWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'gray',
  },
  imageWrapper: {
    marginVertical: 1,
    marginLeft: 15,
    justifyContent: 'center',
    backgroundColor: 'red',
  },
  TextWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    width: screenWidth - 160,
    backgroundColor: 'yellow',
  },
  TimeWrapper: {
    marginVertical: 1,
    justifyContent: 'flex-end',
    marginRight: 15,
    width: screenWidth - 350,
    backgroundColor: 'brown',
  },
  TextTitle: {
    fontSize: 18,
  },
  TextSubTitle: {
    fontSize: 14,
  },
});
