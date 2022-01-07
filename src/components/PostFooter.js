import React from 'react';
import {View, Text} from 'react-native';
import tw from 'tailwind-rn';

const PostFooter = ({caption, username}) => {
  return (
    <View style={tw(`flex-row items-center w-full p-4 pt-2 pb-1`)}>
      <Text style={tw(`text-black font-bold mr-2 text-xl`)}>{username}</Text>
      <Text style={tw(`text-black font-medium`)}>{caption}</Text>
    </View>
  );
};

export default PostFooter;
