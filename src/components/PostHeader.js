import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import tw from 'tailwind-rn';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';

const PostHeader = ({username, userDocId, timestamp}) => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState([]);
  const userImage = userData?.photoURL;
  const userId = userData?.userId;
  const db = firestore();

  useEffect(() => {
    db.collection('users')
      .doc(userDocId)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          console.log('nodata');
        } else {
          //console.log('User data: ', documentSnapshot.data());
          setUserData(documentSnapshot.data());
        }
      });
  }, [db, userDocId]);

  const navProfile = () => {
    navigation.navigate('Profile', {userDocId});
  };

  return (
    <View
      style={[
        tw(`w-full items-baseline justify-between border-b border-gray-300`),
      ]}>
      <View style={[tw(`px-2 py-2`)]}>
        <View style={tw(`flex-row items-center`)}>
          <TouchableOpacity onPress={navProfile}>
            <Image
              source={{uri: userImage}}
              style={[tw('rounded-full'), {width: 50, height: 50}]}
            />
          </TouchableOpacity>

          <View style={tw(`ml-2`)}>
            <Text style={tw(`text-black font-semibold text-lg`)}>
              {username}
            </Text>
            <Text style={tw(`font-medium text-gray-400`)}>
              {moment(timestamp).format('MMMM Do YYYY, h:mm:ss a')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PostHeader;
