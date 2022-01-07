import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import tw from 'tailwind-rn';
import logo from '../asset/logo.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useAuth from '../hooks/useAuth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/core';
import auth from '@react-native-firebase/auth';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({goback}) => {
  const {user} = useAuth();
  const navigation = useNavigation();

  const navLogin = () => {
    navigation.navigate('Login');
  };

  const navback = () => {
    navigation.goBack();
  };

  const authLogout = () => {
    if (user) {
      auth()
        .signOut()
        .then(() => console.log('User signed out!'));
    }
  };

  const navChat = () => {
    navigation.navigate('Chat');
  };

  return (
    <View
      style={[
        tw(
          `flex-row items-center  justify-between px-4 h-16 bg-white top-0 z-40 border-gray-100 mb-8`,
        ),
      ]}>
      {!goback ? (
        <Image
          source={logo}
          alt="logo"
          style={[tw(`mx-1 my-2 w-32`), {resizeMode: 'contain'}]}
        />
      ) : (
        <TouchableOpacity onPress={navback} style={[tw(`mx-1`)]}>
          <Ionicons
            onPress={navback}
            name="chevron-back-outline"
            color={'black'}
            size={26}
          />
        </TouchableOpacity>
      )}

      <View style={[tw(`flex-row items-center justify-between`)]}>
        {user && (
          <TouchableOpacity onPress={navChat} style={[tw(`mx-1`)]}>
            <Ionicons
              name={'chatbubble-ellipses-outline'}
              size={26}
              color={'#125688'}
              style={tw(`mx-2 `)}
            />
          </TouchableOpacity>
        )}

        {user ? (
          <TouchableOpacity onPress={authLogout} style={[tw(`mx-1`)]}>
            <MaterialCommunityIcons
              name="logout"
              color={'#125688'}
              size={26}
              style={[tw(`mx-1`)]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={navLogin} style={[tw(`mx-1`)]}>
            <MaterialCommunityIcons
              name="login"
              color={'#125688'}
              size={26}
              style={[tw(`mx-1`)]}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
