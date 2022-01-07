import React from 'react';
import {View, Text, FlatList} from 'react-native';
import tw from 'tailwind-rn';
import Posts from './Posts';

const Timeline = ({photo}) => {
  return (
    <View style={tw('flex-1')}>
      <FlatList
        style={tw('h-full')}
        data={photo}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Posts post={item} key={item.id} id={item.id} />
        )}
      />
      <View style={tw('')} />
    </View>
  );
};

export default Timeline;
