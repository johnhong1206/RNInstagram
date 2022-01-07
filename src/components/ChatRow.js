import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
} from 'react-native';
import tw from 'tailwind-rn';
import firestore from '@react-native-firebase/firestore';
import useAuth from '../hooks/useAuth';
import getRecipientUid from '../utils/getRecipientUid';
import {useNavigation} from '@react-navigation/core';

const ChatRow = ({id, users}) => {
  const navigation = useNavigation();

  const {user} = useAuth();
  const db = firestore();
  const [lastMessage, setLastMessage] = useState('');
  const [recipientSnapShot, setRecipientSnapShot] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    db.collection('users')
      .where('userId', '==', getRecipientUid(users, user))
      .onSnapshot(snapshot =>
        setRecipientSnapShot(
          snapshot?.docs.map(doc => ({
            id: doc?.id,
            ...doc?.data(),
          })),
        ),
      );
  }, [db]);

  const navMessage = () => {
    navigation.navigate('Message', {id});
  };
  const recipient = recipientSnapShot[0];
  useEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot =>
        setLastMessage(snapshot.docs[0]?.data()?.message),
      );
    return unsubscribe;
  }, [db, id]);

  return (
    <TouchableOpacity
      onPress={navMessage}
      style={[
        tw(`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`),
        styles.cardShadow,
      ]}>
      <Image
        style={tw('rounded-full h-16 w-16 mr-4')}
        source={{uri: recipient?.photoURL}}
      />
      <View>
        <Text style={tw('text-2xl font-semibold text-black')}>
          {recipient?.username}
        </Text>
        <Text style={tw('text-lg font-semibold text-gray-500')}>
          {lastMessage || 'Say Hi...'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRow;
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
});
