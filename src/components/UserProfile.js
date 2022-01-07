import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import tw from 'tailwind-rn';
import useAuth from '../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const UserProfile = ({
  fullName,
  image,
  profileUsername,
  profileDocId,
  profileUserId,
  followers,
  following,
  photosCount,
  followingCount,
  followersCount,
  bios,
}) => {
  const db = firestore();

  const {user} = useAuth();
  const [userData, setUserData] = useState([]);
  const followingsss = userData?.following?.includes(profileDocId);
  const [editProfile, setEditProfile] = useState(false);
  const [biosupdate, setBiosupdate] = useState('');
  const navigation = useNavigation();
  const [chatSnapshot, setChatSnapshot] = useState([]);

  useEffect(() => {
    let unsubscribe;
    const fetchChat = () => {
      if (user) {
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
      }
    };
    fetchChat();
    return unsubscribe;
  }, [db, user]);

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

  const handleToggleFollow = async () => {
    await db
      .collection('users')
      .doc(user?.uid)
      .update({
        following: followingsss
          ? firestore.FieldValue.arrayRemove(profileDocId)
          : firestore.FieldValue.arrayUnion(profileDocId),
      });

    await db
      .collection('users')
      .doc(profileDocId)
      .update({
        followers: followingsss
          ? firestore.FieldValue.arrayRemove(user?.uid)
          : firestore.FieldValue.arrayUnion(user?.uid),
      });
  };

  const creteChat = () => {
    if (!user) alert('please Login');
    if (!profileDocId) return null;

    const chatExist = chatSnapshot?.find(
      chat => chat?.users.find(user => user === profileDocId)?.length > 0,
    );
    console.log('chatExist', !!chatExist);

    if (!chatExist && profileDocId !== user?.uid) {
      db.collection('chats')
        .add({
          users: [user?.uid, profileDocId],
          displayName: [userData?.username, profileUsername],
        })
        .then(() => {
          alert('chat room created');
          navigation.navigate('Chat');
        });
    } else {
      alert('chat room exists');

      //router.push("/chat");
    }
  };

  const togleEdit = () => {
    if (profileUsername !== userData?.username) {
      setEditProfile(false);
      alert('Your Are not the Auth user');
      router.push('/');
    } else {
      setEditProfile(true);
    }

    if (editProfile === true) {
      setEditProfile(false);
    }
  };

  const UpdateUserBios = e => {
    e.preventDefault();

    if (!biosupdate) {
      setEditProfile(false);
      return false;
    }
    db.collection('users')
      .doc(profileDocId)
      .set(
        {
          bios: biosupdate,
        },
        {merge: true},
      )
      .then(() => {
        setBiosupdate('');
        setEditProfile(false);
      });
  };

  const navUploadprofile = () => {
    navigation.navigate('ProfileImageUpload', {userData});
  };

  return (
    <View
      style={tw(
        `p-4 w-full flex items-center justify-center border-b-2 mb-2 border-gray-200`,
      )}>
      <View style={tw(`w-full flex flex-grow items-center justify-center`)}>
        {!editProfile ? (
          <Image
            source={{uri: image}}
            alt={profileUsername}
            style={[
              tw('rounded-full'),
              {width: 200, height: 200, resizeMode: 'cover'},
            ]}
          />
        ) : (
          <TouchableOpacity
            onPress={navUploadprofile}
            style={tw(`flex-col items-center justify-center`)}>
            <Ionicons
              name={'image-outline'}
              size={40}
              color={'black'}
              style={tw(`mx-2 text-pink-400`)}
            />
            <Text style={tw(`mx-1 font-bold text-black`)}>
              Upload Profile Image
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={tw(`flex-col items-center justify-center w-full`)}>
        <View style={tw(`flex-row items-center justify-center mt-6 w-full`)}>
          <Text style={tw(`text-xl font-bold text-black mx-2 mr-3`)}>
            {profileUsername}
          </Text>
          {user && user?.uid !== profileDocId && (
            <TouchableOpacity
              onPress={handleToggleFollow}
              style={tw(
                `flex-row mx-6 items-center justify-center font-bold text-sm rounded text-black w-24 h-6 ${
                  followingsss ? 'bg-blue-400' : 'bg-pink-400'
                }`,
              )}>
              <Text style={tw(`font-bold text-white`)}>
                {followingsss ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>
          )}
          {user && user?.uid !== profileDocId && (
            <TouchableOpacity onPress={creteChat}>
              <Ionicons
                name={'chatbubble-ellipses-outline'}
                size={26}
                color={'black'}
                style={tw(`mx-2 text-pink-400`)}
              />
            </TouchableOpacity>
          )}
          {user && user?.uid == profileDocId && (
            <TouchableOpacity onPress={togleEdit}>
              <Ionicons
                name={'create-outline'}
                size={26}
                color={'black'}
                style={tw(`mx-2 text-blue-500`)}
              />
            </TouchableOpacity>
          )}
        </View>
        {!editProfile && (
          <View style={tw(`flex-row items-center justify-center w-full mt-2`)}>
            <View style={tw(`flex-row items-center justify-center`)}>
              <Text style={tw(`mx-1 font-bold text-black`)}>
                {photosCount ? photosCount : '0'}
              </Text>
              <Text style={tw(`mx-1 font-bold text-black`)}>Photos</Text>
            </View>
            <View style={tw(`flex-row items-center justify-center`)}>
              <Text style={tw(`mx-1 font-bold text-black`)}>
                {followersCount}
              </Text>
              <Text style={tw(`mx-1 font-bold text-black`)}>
                {followersCount === 1 ? `follower` : `followers`}
              </Text>
            </View>
            <View style={tw(`flex-row items-center justify-center`)}>
              <Text style={tw(`mx-1 font-bold text-black`)}>
                {followingCount}
              </Text>
              <Text style={tw(`mx-1 font-bold text-black`)}>following</Text>
            </View>
          </View>
        )}
      </View>
      <View style={tw(`flex-row items-center justify-center w-full mt-3`)}>
        {!editProfile ? (
          <Text style={tw(`text-black font-medium text-lg`)}>{bios}</Text>
        ) : (
          <View style={tw(`flex-row items-center px-4`)}>
            <TextInput
              placeholderTextColor="#000000"
              style={[tw(`p-2 h-12 w-11/12 bg-white`), styles.cardShadow]}
              type="text"
              value={biosupdate}
              onChangeText={text => setBiosupdate(text)}
              onSubmitEditing={UpdateUserBios}
              placeholder={`Update Bios ${bios}`}
            />
            <TouchableOpacity onPress={UpdateUserBios} style={tw(``)}>
              <Ionicons
                name={'checkmark-circle-outline'}
                size={40}
                style={tw(`mx-2 text-blue-500`)}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default UserProfile;

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
});
