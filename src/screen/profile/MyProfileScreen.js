import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Header from '../../components/Header';
import {useNavigation, useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import UserProfile from '../../components/UserProfile';
import useAuth from '../../hooks/useAuth';
import tw from 'tailwind-rn';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MyProfileScreen = () => {
  const navigation = useNavigation();

  const {user} = useAuth();

  const userDocId = user?.uid;
  const db = firestore();
  const [profile, setProfile] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [savephoto, setSavePhoto] = useState([]);
  const [phase, setPhase] = useState('image');

  useEffect(() => {
    let unsubscribe;
    const fetchProfileData = () => {
      unsubscribe = db
        .collection('users')
        .doc(userDocId)
        .onSnapshot(snapshot => setProfile(snapshot.data()));
    };
    fetchProfileData();
    return unsubscribe;
  }, [db, userDocId]);

  useEffect(() => {
    let unsubscribe;
    const getPhotos = () => {
      unsubscribe = db
        .collection('photos')
        .where('userId', '==', userDocId)
        .onSnapshot(snapshot => setPhoto(snapshot.docs.map(doc => doc.data())));
    };
    getPhotos();
    return unsubscribe;
  }, [db, userDocId]);

  useEffect(() => {
    let unsubscribe;

    const fetchPhotos = () => {
      if (user) {
        unsubscribe = db
          .collection('photos')
          .where('save', 'array-contains', userDocId)
          .onSnapshot(snapshot => {
            setSavePhoto(
              snapshot?.docs.map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
            );
          });
      } else {
        setSavePhoto([]);
      }
    };
    fetchPhotos();
    return unsubscribe;
  }, [db, userDocId]);

  const navImage = item => {
    navigation.navigate('PostDetail', {item});
  };

  return (
    <View>
      <Header goback />
      <UserProfile
        key={profile?.userId}
        profileDocId={profile?.userId}
        profileUsername={profile?.username}
        image={profile?.photoURL}
        profileUserId={profile?.userId}
        fullName={profile?.fullName}
        followers={profile?.followers}
        followersCount={profile?.followers?.length}
        following={profile?.following}
        followingCount={profile?.following?.length}
        bios={profile?.bios}
        email={profile?.email}
        savePhoto={profile?.savePhoto}
        photosCount={photo?.length}
      />
      <View>
        <View style={tw('flex-row mb-4 flex justify-evenly mt-1')}>
          <Phase
            name={'image'}
            isActive={phase == 'image' ? true : false}
            setPhase={() => setPhase('image')}
            icon={'logo-instagram'}
          />
          <Phase
            name={'save'}
            isActive={phase == 'save' ? true : false}
            setPhase={() => setPhase('save')}
            icon={'bookmark-outline'}
          />
        </View>
        <View style={styles.galleryContainer}>
          <FlatList
            data={phase === 'Image' ? photo : savephoto}
            keyExtractor={item => item.id}
            numColumns={3}
            scrollEnabled={false}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => navImage(item)}>
                <Image
                  source={{uri: item?.image}}
                  style={styles.galleryImage}
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
};

export default MyProfileScreen;
const styles = StyleSheet.create({
  galleryContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  galleryText: {
    color: 'gray',
  },
  galleryImage: {
    height: 123,
    width: 123,
    margin: 2,
  },
});
const Phase = ({name, isActive, setPhase, icon}) => {
  return (
    <TouchableOpacity onPress={setPhase}>
      <View style={tw('flex flex-col items-center')}>
        <Text
          style={tw(
            `font-bold mb-1 ${isActive ? 'text-blue-400' : 'text-gray-300'}`,
          )}>
          {name}
        </Text>

        <Ionicons
          name={icon}
          size={16}
          color={'black'}
          style={tw(`mx-2 ${isActive ? 'text-blue-400' : 'text-gray-300'}`)}
        />
      </View>
    </TouchableOpacity>
  );
};
