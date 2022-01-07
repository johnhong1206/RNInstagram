import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from 'tailwind-rn';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const PostAction = ({docId, totalLikes, handleFocus}) => {
  const db = firestore();
  const {user} = useAuth();
  const userId = user?.uid;
  const [likes, setLikes] = useState(totalLikes);
  const [photoLikeSave, setPhotoLikeSave] = useState();

  useEffect(() => {
    db.collection('photos')
      .doc(docId)
      .onSnapshot(snapshot => setPhotoLikeSave(snapshot.data()));
  }, [db, user]);

  const handleToggleLiked = async () => {
    await db
      .collection('photos')
      .doc(docId)
      .update({
        likes: likesss
          ? firestore.FieldValue.arrayRemove(userId)
          : firestore.FieldValue.arrayUnion(userId),
      });
    setLikes(likes => (likesss ? likes - 1 : likes + 1));
  };

  const likesss = photoLikeSave?.likes?.includes(user?.uid);
  const savesssss = photoLikeSave?.save?.includes(user?.uid);

  const handleToggleSave = async () => {
    await db
      .collection('photos')
      .doc(docId)
      .update({
        save: savesssss
          ? firestore.FieldValue.arrayRemove(userId)
          : firestore.FieldValue.arrayUnion(userId),
      });

    await db
      .collection('users')
      .doc(userId)
      .update({
        savePhoto: savesssss
          ? firestore.FieldValue.arrayRemove(docId)
          : firestore.FieldValue.arrayUnion(docId),
      });
  };

  return (
    <View style={tw(`flex-col w-full justify-between px-2 py-1`)}>
      <View style={tw(`flex-row w-full justify-between`)}>
        {user && (
          <View style={tw(`flex-row items-center`)}>
            {!likesss && (
              <TouchableOpacity onPress={handleToggleLiked}>
                <Ionicons
                  name="heart-outline"
                  size={40}
                  color={'black'}
                  style={tw(`mx-2`)}
                />
              </TouchableOpacity>
            )}
            {likesss && (
              <TouchableOpacity onPress={handleToggleLiked}>
                <Ionicons
                  name="heart"
                  size={40}
                  color={'black'}
                  style={tw(`mx-2 text-red-400`)}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleFocus}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={40}
                color={'black'}
                style={tw(`mx-2`)}
              />
            </TouchableOpacity>

            {savesssss && (
              <TouchableOpacity onPress={handleToggleSave}>
                <Ionicons
                  name="bookmark"
                  color={'black'}
                  size={40}
                  onClick={handleToggleSave}
                  style={tw(`mx-2 text-blue-400`)}
                />
              </TouchableOpacity>
            )}
            {!savesssss && (
              <TouchableOpacity onPress={handleToggleSave}>
                <Ionicons
                  name="bookmark-outline"
                  size={40}
                  color={'black'}
                  onClick={handleToggleSave}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      handleToggleSave();
                    }
                  }}
                  style={tw(`mx-2`)}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
      <View style={tw(`px-3 py-0`)}>
        <Text style={tw(`text-black font-bold`)}>
          {likes === 1 ? `${likes} like` : `${likes} likes`}
        </Text>
      </View>
    </View>
  );
};

export default PostAction;
