import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';

const AddComment = ({docId, commentInput}) => {
  const db = firestore();
  const [comment, setComment] = useState('');
  const {user} = useAuth();
  const displayName = user?.displayName;

  const handleSubmitComment = event => {
    event.preventDefault();
    db.collection('photos').doc(docId).collection('comments').add({
      uid: user?.uid,
      displayName: displayName,
      comment: comment,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
  };

  return (
    <View style={tw(`border-t border-gray-200 w-full`)}>
      <View style={tw(`flex-row items-center justify-between px-2`)}>
        <TextInput
          placeholder={`${displayName} Add a comment`}
          placeholderTextColor="gray"
          style={[tw('')]}
          type="text"
          value={comment}
          onChangeText={text => setComment(text)}
          ref={commentInput}
        />
        <TouchableOpacity onPress={handleSubmitComment}>
          <Text
            style={tw(
              `text-blue-400 font-semibold ${!comment && 'opacity-50'}`,
            )}>
            Post
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddComment;
