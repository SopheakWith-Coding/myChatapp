import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

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
    firestore()
      .collection('Chats')
      .orderBy('latestMessage.createdAt', 'desc')
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

  render() {
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
                    title: `${item.name}`,
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
    width: screenWidth - 160,
  },
  TimeWrapper: {
    marginVertical: 1,
    justifyContent: 'center',
    marginRight: 15,
    width: screenWidth - 350,
  },
  TextTitle: {
    fontSize: 18,
  },
  TextSubTitle: {
    fontSize: 14,
  },
});
