import React, {useLayoutEffect, useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import tw from 'tailwind-rn';
import Header from '../../components/Header';
import firestore from '@react-native-firebase/firestore';
import useAuth from '../../hooks/useAuth';
import FollowCard from '../../components/FollowCard';

const FollowingScreen = () => {
  const db = firestore();
  const {user} = useAuth();

  const [phase, setPhase] = useState('Following');
  const [userData, setUserData] = useState([]);
  const [followingprofiles, setFollowingProfiles] = useState([]);
  const [followersprofiles, setFollowersProfiles] = useState([]);
  const [suggestionProfile, setSuggestionProfile] = useState([]);
  const followingUsers =
    userData?.following?.length > 0 ? userData?.following : ['no data'];

  const followers =
    userData?.followers?.length > 0 ? userData?.followers : ['no data'];

  useLayoutEffect(() => {
    let unsubscribe;
    const fetchUserData = () => {
      unsubscribe = db
        .collection('users')
        .doc(user?.uid)
        .onSnapshot(snapshot => setUserData(snapshot.data()));
    };
    fetchUserData();
    return unsubscribe;
  }, [db, user]);

  useEffect(() => {
    let unsubscribe;

    const fetchSuggestions = () => {
      if (phase === 'Suggestion' && followingUsers === []) {
        unsubscribe = db
          .collection('users')
          .where('userId', '!=', user?.uid)
          .onSnapshot(snapshot => {
            setSuggestionProfile(
              snapshot?.docs.map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
            );
          });
      }
      if (phase === 'Suggestion' && followingUsers.length > 0) {
        unsubscribe = db
          .collection('users')
          .where('userId', 'not-in', [...followingUsers, user?.uid])
          .onSnapshot(snapshot => {
            setSuggestionProfile(
              snapshot?.docs.map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
            );
          });
      }
    };
    fetchSuggestions();
    return unsubscribe;
  }, [db, followingUsers, phase]);

  useEffect(() => {
    let unsubscribe;
    const fetchFollowing = () => {
      if (phase === 'Following' && followingUsers !== []) {
        db.collection('users')
          .where('userId', 'in', [...followingUsers])
          .onSnapshot(snapshot => {
            setFollowingProfiles(
              snapshot?.docs.map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
            );
          });
      }
    };
    fetchFollowing();
    return unsubscribe;
  }, [db, followingUsers, phase]);

  useEffect(() => {
    let unsubscribe;
    const fetchFollower = () => {
      if (phase === 'Follower' && followers !== []) {
        db.collection('users')
          .where('userId', 'in', [...followers])
          .onSnapshot(snapshot => {
            setFollowersProfiles(
              snapshot?.docs.map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
            );
          });
      }
    };
    fetchFollower();
    return unsubscribe;
  }, [db, followers, phase]);

  return (
    <SafeAreaView style={tw(`flex-1`)}>
      <Header />
      <View style={tw('flex-row mb-4 flex justify-evenly mt-1')}>
        <Phase
          name={'Suggestion'}
          isActive={phase == 'Suggestion' ? true : false}
          setPhase={() => setPhase('Suggestion')}
        />
        <Phase
          name={'Following'}
          isActive={phase == 'Following' ? true : false}
          setPhase={() => setPhase('Following')}
        />
        <Phase
          name={'Follower'}
          isActive={phase == 'Follower' ? true : false}
          setPhase={() => setPhase('Follower')}
        />
      </View>
      <View style={tw('flex-1')}>
        <FlatList
          style={tw('flex-1 h-full w-full')}
          data={
            (phase === 'Suggestion' && suggestionProfile) ||
            (phase === 'Following' && followingprofiles) ||
            (phase === 'Follower' && followersprofiles)
          }
          keyExtractor={item => item.id}
          renderItem={({item}) => <FollowCard users={item} id={item?.id} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default FollowingScreen;
const Phase = ({name, isActive, setPhase, icon}) => {
  return (
    <TouchableOpacity onPress={setPhase}>
      <View style={tw('flex flex-col items-center')}>
        <Text
          style={tw(
            `font-bold mb-1  ${
              isActive
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-300'
            }`,
          )}>
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
