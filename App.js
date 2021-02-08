import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import {HeaderBackButton} from '@react-navigation/stack';

import LoginScreen from './src/screen/login';
import SignUpScreen from './src/screen/signup';
import ChatRoom from './src/screen/chatRoom';
import createChatScreen from './src/screen/createChat';
import database from '@react-native-firebase/database';

import ChatScreen from './src/screen/chat';
import ProfileScreen from './src/screen/profile';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export default class Navigation extends React.PureComponent {
  state = {
    initializing: true,
    user: null,
    users: [],
  };
  async componentDidMount() {
    auth().onAuthStateChanged((user) => this.setState({user}));
    const authUid = auth().currentUser.uid;
    const ref = database().ref(`users/${authUid}`);
    const data = await ref.once('value');
    this.setState({users: data.val()});
  }

  render() {
    const {user} = this.state;
    const {users} = this.state;
    const image = users.profileImage
      ? {uri: users.profileImage}
      : {
          uri:
            'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1214428300?b=1&k=6&m=1214428300&s=612x612&w=0&h=kMXMpWVL6mkLu0TN-9MJcEUx1oSWgUq8-Ny6Wszv_ms=',
        };

    function chatStack() {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="Chats"
            component={ChatScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Create Chat')}>
                  <Image
                    style={{width: 22, height: 22, marginRight: 15}}
                    source={{
                      uri: 'https://cdn.onlinewebfonts.com/svg/img_402168.png',
                    }}
                  />
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProFile')}>
                  <Image
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      marginLeft: 15,
                    }}
                    source={image}
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="ChatRoom"
            component={ChatRoom}
            options={({navigation, route}) => ({
              title: route.params.title,
              headerLeft: (props) => (
                <HeaderBackButton
                  {...props}
                  onPress={() => navigation.navigate('Chats')}
                />
              ),
            })}
          />
          <Stack.Screen name="Create Chat" component={createChatScreen} />
        </Stack.Navigator>
      );
    }

    function profileStack() {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="ProFile"
            component={ProfileScreen}
            options={{title: 'Profile'}}
          />
        </Stack.Navigator>
      );
    }

    return (
      <NavigationContainer>
        {user ? (
          <Tab.Navigator>
            <Tab.Screen
              name="ChatStack"
              component={chatStack}
              options={{
                title: 'Chat',
                tabBarIcon: () => (
                  <Image
                    style={{width: 25, height: 25}}
                    source={{
                      uri:
                        'https://icon-library.com/images/chat-icon/chat-icon-20.jpg',
                    }}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="ProfileScreen"
              component={profileStack}
              options={{
                title: 'Profile',
                tabBarIcon: () => (
                  <Image
                    style={{width: 20, height: 20}}
                    source={{
                      uri:
                        'https://icons.iconarchive.com/icons/iconsmind/outline/256/Profile-icon.png',
                    }}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Log In" component={LoginScreen} />
            <Stack.Screen name="Sign Up" component={SignUpScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    );
  }
}
