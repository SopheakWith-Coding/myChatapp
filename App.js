import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';
import {HeaderBackButton} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

import LoginScreen from './src/screen/login';
import SignUpScreen from './src/screen/signup';
import ChatRoom from './src/screen/chatRoom';
import createChatScreen from './src/screen/newMessage';
import newGroupChatScreen from './src/screen/newGroup';
import createGroupChatScreen from './src/screen/createGroup';

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
    firestore()
      .collection('users')
      .where('uuid', '==', authUid)
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            ...documentSnapshot.data(),
          };
        });
        this.setState({users: threads});
      });
  }

  render() {
    const {user} = this.state;
    const {users} = this.state;
    const image = users.map((val) => {
      const img = val.profileImage;
      return img;
    });

    function chatStack() {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="Chats"
            component={ChatScreen}
            options={({navigation}) => ({
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('New Message')}>
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
                  onPress={() => navigation.navigate('Profile')}>
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
          <Stack.Screen
            name="New Message"
            component={createChatScreen}
            options={{headerBackTitle: 'Cancel'}}
          />
          <Stack.Screen
            name="New  Group"
            component={newGroupChatScreen}
            options={({navigation}) => ({
              headerBackTitle: 'Cancel',
            })}
          />
          <Stack.Screen
            name="Create Group"
            component={createGroupChatScreen}
            options={{
              title: 'New Group',
              headerBackTitle: 'Cancel',
            }}
          />
        </Stack.Navigator>
      );
    }

    function profileStack() {
      return (
        <Stack.Navigator>
          <Stack.Screen
            name="Profile"
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
              name="Profile"
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
