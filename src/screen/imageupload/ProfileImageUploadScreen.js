import React, {useState, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import tw from 'tailwind-rn';
import firestore from '@react-native-firebase/firestore';

import Header from '../../components/Header';
import useAuth from '../../hooks/useAuth';
import {useNavigation, useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';

const ProfileImageUploadScreen = () => {
  const {user} = useAuth();
  const db = firestore();

  const navigation = useNavigation();
  const {params} = useRoute();
  const {userData} = params;
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response);
        const source = {uri: response.assets[0].uri};
        console.log(source);
        setImage(source);
      }
    });
  };

  const cancelImg = () => {
    setImage(null);
  };

  const uploadImage = async () => {
    if (image === null) {
      false;
      selectImage();
    }

    const {uri} = image;
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);
    setTransferred(0);
    const task = storage().ref(`ProfileImages/${filename}`).putFile(uploadUri);
    // set progress state
    task.on('state_changed', snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000,
      );
    });
    try {
      await task.then(() => {
        storage()
          .ref(`ProfileImages/`)
          .child(filename)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            db.collection('users')
              .doc(user?.uid)
              .set(
                {
                  photoURL: url,
                },
                {merge: true},
              )
              .then(() => {
                navigation.goBack();
              });
          });
      });
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
    Alert.alert(
      'Photo uploaded!',
      'Your photo has been uploaded to Firebase Cloud Storage!',
    );
    setImage(null);
  };

  return (
    <View style={[tw('h-full bg-black'), {opacity: 0.89}]}>
      <Header goback />
      <View>
        <TouchableOpacity
          onPress={cancelImg}
          style={tw('flex-row mb-4 flex items-center justify-center mt-1')}>
          {image !== null ? (
            <Image source={{uri: image.uri}} style={styles.imageBox} />
          ) : null}
        </TouchableOpacity>
        {uploading && (
          <View
            style={tw('flex-row mb-4 flex items-center justify-center mt-1')}>
            <Text style={tw('text-white text-lg font-bold text-center')}>
              {transferred}%
            </Text>
          </View>
        )}
        <View style={tw('flex flex-row items-center justify-center p-4')}>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={selectImage}>
            <Text style={tw('text-center font-bold text-xl text-red-500')}>
              Pick Image
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw('bg-white p-4 rounded-3xl w-40 ml-2 mr-2')}
            onPress={uploadImage}>
            <Text
              style={tw(
                `text-center font-bold text-xl ${
                  image != null ? 'text-green-500' : 'text-gray-500'
                }`,
              )}>
              Upload
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileImageUploadScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#bbded6',
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center',
  },
  progressBarContainer: {
    marginTop: 20,
  },
  imageBox: {
    width: 300,
    height: 300,
  },
});
