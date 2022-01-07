import React from 'react';
import {View, Text} from 'react-native';
import useAuth from '../hooks/useAuth';
import Stories from './Stories';
import Timeline from './Timeline';

const Feeds = ({stories, photo, userData}) => {
  const {user} = useAuth();

  return (
    <View style={{flex: 1}}>
      {user && <Stories stories={stories} userData={userData} />}
      <Timeline photo={photo} />
    </View>
  );
};

export default Feeds;
