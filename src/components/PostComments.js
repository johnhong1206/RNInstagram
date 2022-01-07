import React, {useState, useEffect} from 'react';
import {View, Text, Touchable, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import AddComment from './AddComment';

const PostComments = ({docId, commentInput}) => {
  const {user} = useAuth();

  const db = firestore();
  const [comments, setComments] = useState([]);
  const [commentsSlice, setCommentsSlice] = useState(2);
  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 2);
  };

  useEffect(() => {
    let unsubscribe;

    const fetchComment = () => {
      unsubscribe = db
        .collection('photos')
        .doc(docId)
        .collection('comments')
        .onSnapshot(snapshot => {
          setComments(
            snapshot?.docs.map(doc => ({
              id: doc?.id,
              ...doc?.data(),
            })),
          );
        });
    };
    fetchComment();
    return unsubscribe;
  }, [db, docId]);

  return (
    <View style={tw(`w-full`)}>
      <View style={tw(`p-4 pt-1 pb-4 w-full`)}>
        {comments?.slice(0, commentsSlice).map(item => (
          <View key={item.id} style={tw(`flex-row items-center`)}>
            <Text style={tw(`text-black font-semibold mr-2`)}>
              {item.displayName}
            </Text>
            <Text style={tw(`text-black`)}>{item.comment}</Text>
          </View>
        ))}
        {comments?.length >= 2 && commentsSlice < comments?.length && (
          <TouchableOpacity onPress={showNextComments}>
            <Text style={tw(`text-sm text-gray-400 my-2`)}>
              View More Comments
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {user && (
        <AddComment
          docId={docId}
          comments={comments}
          setComments={setComments}
          commentInput={commentInput}
        />
      )}
    </View>
  );
};

export default PostComments;
