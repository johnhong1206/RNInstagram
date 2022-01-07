import React, {useEffect, useState, useLayoutEffect} from 'react';
import {View, Text, Image} from 'react-native';
import useAuth from '../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';
import tw from 'tailwind-rn';
import moment from 'moment';

const ReceiverMessage = ({key, messages}) => {
  const {user} = useAuth();
  const db = firestore();

  const [senderInfo, setSenderInfo] = useState([]);

  useLayoutEffect(() => {
    db.collection('users')
      .doc(messages?.userId)
      .get()
      .then(documentSnapshot => {
        if (!documentSnapshot.exists) {
          console.log('nodata');
        } else {
          //console.log('User data: ', documentSnapshot.data());
          setSenderInfo(documentSnapshot.data());
        }
      });
  }, [db, messages?.userId]);
  return (
    <>
      <View
        key={key}
        style={[
          {alignSelf: 'flex-start', marginLeft: 'auto'},
          tw(
            'bg-purple-400 rounded-lg rounded-bl-none px-5 py-3 mx-3 my-2 ml-14 relative',
          ),
        ]}>
        <Image
          source={{uri: senderInfo?.photoURL}}
          style={tw(`h-12 w-12 rounded-full absolute top-0 -left-14`)}
        />
        <Text style={tw('text-white')}>{messages?.message}</Text>
      </View>
      <Text style={tw('text-gray-400 text-xs absolute bottom-0 left-2')}>
        {messages.timestamp ? moment(messages.timestamp).format('LL') : '...'}
      </Text>
    </>
  );
};

export default ReceiverMessage;
