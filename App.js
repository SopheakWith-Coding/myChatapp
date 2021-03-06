import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import auth from '@react-native-firebase/auth';

import LoginScreen from './src/screen/login';
import SignUpScreen from './src/screen/signup';
import ChatRoom from './src/screen/chatRoom';
import createChatScreen from './src/screen/createChat';

import ChatScreen from './src/screen/chat';
import ProfileScreen from './src/screen/profile';

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

export default class Navigation extends React.PureComponent {
  state = {
    initializing: true,
    user: null,
  };
  componentDidMount() {
    auth().onAuthStateChanged((user) => this.setState({user}));
  }

  render() {
    const {user} = this.state;

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
            })}
          />
          <Stack.Screen
            name="ChatRoom"
            component={ChatRoom}
            options={({route}) => ({title: route.params.title})}
          />
          <Stack.Screen name="Create Chat" component={createChatScreen} />
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
