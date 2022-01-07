import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import useAuth from '../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';
import tw from 'tailwind-rn';
import ChatRow from './ChatRow';

const ChatList = () => {
  const {user} = useAuth();
  const [userData, setUserData] = useState([]);
  const [chatSnapshot, setChatSnapshot] = useState([]);
  const db = firestore();

  useEffect(() => {
    if (user) {
      db.collection('users')
        .doc(user?.uid)
        .get()
        .then(documentSnapshot => {
          if (!documentSnapshot.exists) {
          } else {
            //console.log('User data: ', documentSnapshot.data());
            setUserData(documentSnapshot.data());
          }
        });
    }
  }, [db, user]);

  useEffect(() => {
    let unsubscribe;
    const fetchChat = () => {
      unsubscribe = db
        .collection('chats')
        .where('users', 'array-contains', user?.uid)
        .onSnapshot(snapshot =>
          setChatSnapshot(
            snapshot?.docs.map(doc => ({
              id: doc?.id,
              ...doc?.data(),
            })),
          ),
        );
    };
    fetchChat();
    return unsubscribe;
  }, [db, user]);

  return chatSnapshot?.length > 0 ? (
    <FlatList
      style={tw('h-full')}
      data={chatSnapshot}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <ChatRow
          id={item.id}
          users={item?.users}
          displayName={item?.displayName}
        />
      )}
    />
  ) : (
    <View>
      <Text style={tw('text-lg font-semibold text-black')}>
        No Matches at the moment
      </Text>
    </View>
  );
};

export default ChatList;
