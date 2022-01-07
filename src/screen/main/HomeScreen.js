import React, {useLayoutEffect, useRef, useState, useEffect} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import tw from 'tailwind-rn';
import Feeds from '../../components/Feeds';
import Header from '../../components/Header';
import useAuth from '../../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = () => {
  const {user} = useAuth();

  const [userData, setUserData] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [nouserPhoto, setNouserPhoto] = useState([]);
  const [myPhtoto, setMyphoto] = useState([]);
  const following = userData?.following;
  const [allphotos, setAllPhotos] = useState([]);

  const db = firestore();

  useEffect(() => {
    let unsubscribe;
    const fetchUserData = () => {
      unsubscribe = db
        .collection('users')
        .doc(user?.uid)
        .onSnapshot(snapshot => setUserData(snapshot.data()));
    };
    fetchUserData();
    return unsubscribe;
  }, [db, user]);

  useEffect(() => {
    let unsubscribe;

    const fetchPhotos = () => {
      if (user) {
        const followingUsers = following?.length > 0 ? following : ['no data'];
        unsubscribe = db
          .collection('photos')
          .where('userId', 'in', [...followingUsers])
          .onSnapshot(snapshot => {
            setPhoto(
              snapshot?.docs.map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
            );
          });
      } else {
        unsubscribe = db.collection('photos').onSnapshot(snapshot => {
          setNouserPhoto(
            snapshot?.docs.slice(0, 2).map(doc => ({
              id: doc?.id,
              ...doc?.data(),
            })),
          );
        });
      }
    };
    fetchPhotos();
    return unsubscribe;
  }, [db, following, user]);

  useEffect(() => {
    let unsubscribe;
    const fetchMyPhotos = () => {
      if (user) {
        unsubscribe = db
          .collection('photos')
          .where('userId', '==', user?.uid)
          .onSnapshot(snapshot => {
            setMyphoto(
              snapshot?.docs.map(doc => ({
                id: doc?.id,
                ...doc?.data(),
              })),
            );
          });
      } else {
        setMyphoto([]);
      }
    };
    fetchMyPhotos();
    return unsubscribe;
  }, [db, user]);

  useEffect(() => {
    const joinPhotos = () => {
      if (user) {
        let allphoto = [];
        allphoto.push(
          ...myPhtoto.sort((a, b) => b.timestamp - a.timestamp),
          ...photo.sort((a, b) => b.timestamp - a.timestamp),
        );
        setAllPhotos(allphoto);
      }
    };
    joinPhotos();
  }, [user, myPhtoto, photo]);

  return (
    <SafeAreaView style={tw(`flex-1`)}>
      <Header />
      <Feeds photo={!user ? nouserPhoto : allphotos} userData={userData} />
    </SafeAreaView>
  );
};

export default HomeScreen;
