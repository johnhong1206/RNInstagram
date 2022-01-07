import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import tw from 'tailwind-rn';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';
import useAuth from '../hooks/useAuth';

const FollowCard = ({users}) => {
  const db = firestore();
  const {user} = useAuth();
  const [userData, setUserData] = useState([]);
  const [myData, setMyData] = useState([]);
  const userImage = userData?.photoURL;
  const navigation = useNavigation();
  const followingsss = myData?.following?.includes(users?.userId);

  useEffect(() => {
    let unsubscribe;
    const fetchUserData = () => {
      unsubscribe = db
        .collection('users')
        .doc(users.id)
        .onSnapshot(snapshot => setUserData(snapshot.data()));
    };
    fetchUserData();
    return unsubscribe;
  }, [db, users]);

  useEffect(() => {
    let unsubscribe;
    const fetchmyUserData = () => {
      unsubscribe = db
        .collection('users')
        .doc(user?.uid)
        .onSnapshot(snapshot => setMyData(snapshot.data()));
    };
    fetchmyUserData();
    return unsubscribe;
  }, [db, user]);

  const navProfile = () => {
    const userDocId = users?.userId;
    navigation.navigate('Profile', {userDocId});
  };

  const handleToggleFollow = async () => {
    await db
      .collection('users')
      .doc(user?.uid)
      .update({
        following: followingsss
          ? firestore.FieldValue.arrayRemove(users?.userId)
          : firestore.FieldValue.arrayUnion(users?.userId),
      });

    await db
      .collection('users')
      .doc(users?.userId)
      .update({
        followers: followingsss
          ? firestore.FieldValue.arrayRemove(user?.uid)
          : firestore.FieldValue.arrayUnion(user?.uid),
      });
  };

  return (
    <View
      style={[
        tw(
          `flex-row items-center h-20 my-4 mx-4 px-4 py-4 justify-between bg-white `,
        ),
        styles.cardShadow,
      ]}>
      <View style={[tw(`flex-row items-center`)]}>
        <TouchableOpacity onPress={navProfile}>
          <Image
            source={{uri: userImage}}
            style={[tw('rounded-full'), {width: 70, height: 70}]}
          />
        </TouchableOpacity>
        <View>
          <Text style={tw(`text-black font-bold text-lg mx-2`)}>
            {users?.username}
          </Text>
          <Text style={tw(`text-black font-medium mx-2`)}>
            {userData?.following?.length}{' '}
            {userData?.following?.length === 1 ? `follower` : `followers`}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handleToggleFollow}
        style={tw(
          `flex-row mx-6 items-center justify-center font-bold text-sm rounded text-black w-24 h-6 ${
            followingsss ? 'bg-blue-400' : 'bg-pink-400'
          }`,
        )}>
        <Text style={tw(`font-bold text-white`)}>
          {followingsss ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FollowCard;
const styles = StyleSheet.create({
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  image: {width: 300, height: 300},
});
