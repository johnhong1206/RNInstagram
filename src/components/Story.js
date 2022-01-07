import React, {useState, useEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import tw from 'tailwind-rn';
import {useNavigation} from '@react-navigation/native';

const Story = ({story}) => {
  const navigation = useNavigation();

  const [userData, setUserData] = useState('');
  const db = firestore();
  const userImage = userData?.photoURL;

  useEffect(() => {
    if (story) {
      db.collection('users')
        .doc(story)
        .get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) {
          } else {
            //console.log('User data: ', documentSnapshot.data());
            setUserData(documentSnapshot.data());
          }
        });
    }
  }, [db, story]);

  const navStories = () => {
    navigation.navigate('Story', {story});
  };

  return (
    <TouchableOpacity
      onPress={navStories}
      style={[
        tw(
          'border-pink-500 border-2 rounded-full mx-2 flex-row items-center justify-center bg-black w-14 h-14 rounded-full',
        ),
      ]}>
      <Image
        source={{uri: userImage}}
        style={[tw('rounded-full'), {width: 50, height: 50}]}
      />
    </TouchableOpacity>
  );
};

export default Story;
