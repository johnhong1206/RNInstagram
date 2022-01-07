import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import useAuth from '../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';
import Story from './Story';
import tw from 'tailwind-rn';
import {getUniqueValues} from '../utils/helper';
import {useNavigation, useRoute} from '@react-navigation/native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stories = ({userData}) => {
  const {user} = useAuth();
  const navigation = useNavigation();

  const [stories, setStories] = useState([]);
  const [myStories, setMystories] = useState([]);
  const following = userData?.following;
  const db = firestore();
  const [allStories, setAllStories] = useState([]);
  const storiesUser = stories ? getUniqueValues(stories, 'userId') : null;
  const myStoriesUser = myStories ? getUniqueValues(myStories, 'userId') : null;

  useEffect(() => {
    let unsubscribe;

    const fetchPhotos = () => {
      if (user) {
        const followingUsers = following?.length > 0 ? following : ['test'];

        unsubscribe = db
          .collection('stories')
          .where('userId', 'in', [...followingUsers])
          .onSnapshot(snapshot => {
            setStories(
              snapshot?.docs.map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
            );
          });
      }
    };
    fetchPhotos();
    return unsubscribe;
  }, [db, following, user]);

  useEffect(() => {
    let unsubscribe;

    const fetchMyStories = () => {
      if (user) {
        unsubscribe = db
          .collection('stories')
          .where('userId', '==', user?.uid)
          .onSnapshot(snapshot => {
            setMystories(
              snapshot?.docs.map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
            );
          });
      }
    };
    fetchMyStories();
    return unsubscribe;
  }, [db, user]);

  useEffect(() => {
    const joinStories = () => {
      if (user) {
        let all = [];
        all.push(...myStoriesUser, ...storiesUser);
        setAllStories(all);
      }
    };
    joinStories();
  }, [user, stories, myStories]);

  const navPostStories = () => {
    navigation.navigate('StoryUpload');
  };

  return (
    <View style={tw('mx-2 flex-row items-center justify-center')}>
      <TouchableOpacity
        onPress={navPostStories}
        style={[
          tw(
            'mx-2 flex-row items-center justify-center bg-black w-14 h-14 rounded-full border-red-500 border-2',
          ),
        ]}>
        <MaterialCommunityIcons name="instagram" color={'white'} size={26} />
      </TouchableOpacity>

      <FlatList
        data={allStories}
        keyExtractor={item => item.id}
        numColumns={3}
        scrollEnabled={false}
        renderItem={({item}) => <Story story={item} />}
      />
    </View>
  );
};

export default Stories;
