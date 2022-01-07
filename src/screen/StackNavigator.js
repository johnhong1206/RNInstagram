import React from 'react';
import {View, Text} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainScreen from './main/MainScreen';
import LoginScreen from './auth/LoginScreen';
import RegisterScreen from './auth/RegisterScreen';
import ProfileScreen from './profile/ProfileScreen';
import ProfileImageUploadScreen from './imageupload/ProfileImageUploadScreen';
import ImageScreen from './modal/ImageScreen';
import ImageUpload from './imageupload/ImageUpload';
import StoryScreen from './modal/StoryScreen';
import StoryUpload from './imageupload/StoryUpload';
import ChatScreen from './Chat/ChatScreen';
import MessageScreen from './Chat/MessageScreen';
import ExploreScreen from './Explore/ExploreScreen';
import FollowingScreen from './follow/FollowingScreen';
import PostDetailScreen from './PostDetail/PostDetailScreen';
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Group>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ImageUpload" component={ImageUpload} />
        <Stack.Screen name="StoryUpload" component={StoryUpload} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Message" component={MessageScreen} />
        <Stack.Screen name="Following" component={FollowingScreen} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />

        <Stack.Screen name="Explore" component={ExploreScreen} />
      </Stack.Group>

      <Stack.Group>
        <Stack.Screen
          name="ProfileImageUpload"
          component={ProfileImageUploadScreen}
        />
        <Stack.Screen name="Image" component={ImageScreen} />
        <Stack.Screen name="Story" component={StoryScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default StackNavigator;
