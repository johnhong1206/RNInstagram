import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import tw from 'tailwind-rn';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StoryScreen = () => {
  const navigation = useNavigation();
  const {params} = useRoute();
  const {story} = params;
  const [stories, setStorires] = useState([]);
  const db = firestore();

  useEffect(() => {
    let unsubscribe;

    const fetchStories = () => {
      unsubscribe = db
        .collection('stories')
        .where('userId', '==', story)
        .onSnapshot(snapshot => {
          setStorires(
            snapshot?.docs.map(doc => ({
              id: doc?.id,
              ...doc?.data(),
            })),
          );
        });
    };

    fetchStories();
    return unsubscribe;
  }, [db, story]);

  console.log(stories);
  const navback = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[tw('w-full h-full bg-black flex-1 relative'), {opacity: 0.89}]}>
      <TouchableOpacity
        onPress={navback}
        style={tw('top-4 left-2 w-full h-24')}>
        <Ionicons
          onPress={navback}
          name="chevron-back-outline"
          color={'white'}
          size={26}
        />
      </TouchableOpacity>
      <FlatList
        horizontal
        style={tw('w-full')}
        data={stories}
        key={item => item.id}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={tw(`flex-1 items-center justify-center`)}>
            <Image style={[tw(``), styles.image]} source={{uri: item.image}} />
          </View>
        )}
      />
    </View>
  );
};

export default StoryScreen;
const styles = StyleSheet.create({
  image: {width: 400, height: 400, resizeMode: 'contain'},
});
