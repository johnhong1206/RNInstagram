import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Header from '../../components/Header';
import tw from 'tailwind-rn';
import useAuth from '../../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useRoute} from '@react-navigation/native';

const ExploreScreen = () => {
  const {user} = useAuth();
  const [photoSnapshot, setPhotoSnapshot] = useState([]);
  const db = firestore();
  const navigation = useNavigation();
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    let unsubscribe;
    const fetchPhotos = () => {
      unsubscribe = db
        .collection('photos')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
          setPhotoSnapshot(
            snapshot?.docs.map(doc => ({
              id: doc?.id,
              ...doc?.data(),
            })),
          );
        });
    };
    fetchPhotos();
    return unsubscribe;
  }, [db]);
  const navImage = item => {
    navigation.navigate('Image', {item});
  };

  return (
    <SafeAreaView style={tw(`flex-1`)}>
      <Header />
      <View style={styles.galleryContainer}>
        <FlatList
          data={photoSnapshot}
          keyExtractor={item => item.id}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => navImage(item)}>
              <Image source={{uri: item?.image}} style={styles.galleryImage} />
            </TouchableOpacity>
          )}
        />
        <View style={tw(`pb-10`)} />
      </View>
    </SafeAreaView>
  );
};

export default ExploreScreen;
const styles = StyleSheet.create({
  galleryContainer: {
    alignItems: 'center',
  },
  galleryText: {},
  galleryImage: {
    height: 123,
    width: 123,
    margin: 2,
  },
});
