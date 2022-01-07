import React from 'react';
import {View, Text} from 'react-native';
import Header from '../../components/Header';
import tw from 'tailwind-rn';
import ChatList from '../../components/ChatList';

const ChatScreen = () => {
  return (
    <View style={tw(`flex-1`)}>
      <Header goback />
      <ChatList />
    </View>
  );
};

export default ChatScreen;
