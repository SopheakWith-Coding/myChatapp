import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import moment from 'moment';
import {FlatList} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

const screenWidth = Dimensions.get('window').width;

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      loading: false,
    };
  }

  async componentDidMount() {
    const authUserID = auth().currentUser.uid;
    this.setState({loading: false});
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
        this.setState({users: threads, loading: true});
      });
  }

  render() {
    const {users} = this.state;
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        {this.state.loading ? (
          <FlatList
            data={users}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              const chatID = item.roomID;
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
                      chatID,
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
        ) : (
          <ActivityIndicator size="large" />
        )}
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
