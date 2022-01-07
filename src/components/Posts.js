import React, {useRef} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import tw from 'tailwind-rn';
import PostAction from './PostAction';
import PostComments from './PostComments';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';

const Posts = ({post, key, id}) => {
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();

  return (
    <View
      key={key}
      style={[
        tw(
          `items-center justify-center border bg-white border-gray-200 mb-12 m-3 `,
        ),
        styles.cardShadow,
      ]}>
      <PostHeader
        username={post?.username}
        userDocId={post?.userId}
        timestamp={post?.timestamp?.toDate().getTime()}
      />
      <Image
        source={{uri: post?.image}}
        alt={post?.caption}
        height={480}
        width={720}
        quality="50"
        style={[
          tw(``),
          {
            height: 300,
            width: 300,
            margin: 2,
            resizeMode: 'contain',
          },
        ]}
      />
      <PostAction
        docId={post?.id}
        totalLikes={post?.likes?.length}
        likedPhoto={post?.likes}
        save={post?.save}
        savedPhoto={post?.userSavedPhoto}
        handleFocus={handleFocus}
        post={post}
      />
      <PostFooter caption={post?.caption} username={post?.username} />
      <PostComments
        docId={post?.id}
        comments={post?.comments}
        posted={post?.dateCreated}
        commentInput={commentInput}
      />
    </View>
  );
};

export default Posts;
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
