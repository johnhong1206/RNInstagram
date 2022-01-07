import React, {useLayoutEffect, useRef, useState, useEffect} from 'react';
import {View, Image, Text} from 'react-native';
import ImageUpload from '../imageupload/ImageUpload';
import tw from 'tailwind-rn';
import firestore from '@react-native-firebase/firestore';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import HomeScreen from './HomeScreen';
import ProfileScreen from '../profile/ProfileScreen';
import useAuth from '../../hooks/useAuth';
import MyProfileScreen from '../profile/MyProfileScreen';
import ExploreScreen from '../Explore/ExploreScreen';
import FollowingScreen from '../follow/FollowingScreen';
const Tab = createMaterialBottomTabNavigator();

const MainScreen = () => {
  const [userData, setUserData] = useState([]);
  const db = firestore();
  const {user} = useAuth();
  const userImage = userData?.photoURL;

  useLayoutEffect(() => {
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
  }, [db, user]);

  return (
    <Tab.Navigator
      initialRouteName="Check In"
      activeColor="blue"
      inactiveColor="black"
      labeled={false}
      barStyle={{
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.8,
        shadowRadius: 1.41,
        elevation: 2,
      }}>
      <>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',

            title: 'Home',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="home" color={'#125688'} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ExploreScreen}
          options={{
            tabBarLabel: 'Explore',

            title: 'Explore',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="compass"
                color={'#125688'}
                size={26}
              />
            ),
          }}
        />
        {user && (
          <Tab.Screen
            name="ImageUpload"
            component={ImageUpload}
            options={{
              tabBarLabel: 'Post',

              title: 'Post',
              tabBarIcon: ({color}) => (
                <View style={tw(`flex-row items-center justify-center`)}>
                  <MaterialCommunityIcons
                    name="instagram"
                    color={'#125688'}
                    size={26}
                  />
                </View>
              ),
            }}
          />
        )}
        {user && (
          <Tab.Screen
            name="Following"
            component={FollowingScreen}
            options={{
              tabBarLabel: 'Following',

              title: 'Following',
              tabBarIcon: ({color}) => (
                <MaterialCommunityIcons
                  name="account-group-outline"
                  color={'#125688'}
                  size={26}
                />
              ),
            }}
          />
        )}
        {user && (
          <Tab.Screen
            name="MyProfile"
            component={MyProfileScreen}
            options={{
              tabBarLabel: 'MyProfile',

              title: 'MyProfile',
              tabBarIcon: ({color}) => (
                <View style={tw(`flex-row items-center justify-center`)}>
                  <Image
                    source={{uri: userImage}}
                    style={[tw('rounded-full'), {width: 30, height: 30}]}
                  />
                </View>
              ),
            }}
          />
        )}
      </>
    </Tab.Navigator>
  );
};

export default MainScreen;
