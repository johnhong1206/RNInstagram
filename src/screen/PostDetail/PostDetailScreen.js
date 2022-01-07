import React, {useRef} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Header from '../../components/Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import tw from 'tailwind-rn';
import PostHeader from '../../components/PostHeader';
import PostAction from '../../components/PostAction';
import PostFooter from '../../components/PostFooter';
import PostComments from '../../components/PostComments';

const PostDetailScreen = () => {
  const {params} = useRoute();
  const {item} = params;
  const navigation = useNavigation();

  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();

  const navImage = item => {
    navigation.navigate('Image', {item});
  };

  return (
    <View>
      <Header />
      <View
        style={[
          tw(
            `items-center justify-center border bg-white border-gray-200 mb-12 m-3 `,
          ),
          styles.cardShadow,
        ]}>
        <PostHeader
          username={item?.username}
          userDocId={item?.userId}
          timestamp={item?.timestamp?.toDate().getTime()}
        />
        <TouchableOpacity onPress={() => navImage(item)}>
          <Image
            source={{uri: item?.image}}
            alt={item?.caption}
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
        </TouchableOpacity>

        <PostAction
          docId={item?.id}
          totalLikes={item?.likes?.length}
          likedPhoto={item?.likes}
          save={item?.save}
          savedPhoto={item?.userSavedPhoto}
          handleFocus={handleFocus}
          item={item}
        />
        <PostFooter caption={item?.caption} username={item?.username} />
        <PostComments
          docId={item?.id}
          comments={item?.comments}
          posted={item?.dateCreated}
          commentInput={commentInput}
        />
      </View>
    </View>
  );
};

export default PostDetailScreen;
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
