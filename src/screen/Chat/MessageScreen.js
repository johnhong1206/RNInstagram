import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
} from 'react-native';
import Header from '../../components/Header';
import firestore from '@react-native-firebase/firestore';
import useAuth from '../../hooks/useAuth';
import {useRoute} from '@react-navigation/native';
import tw from 'tailwind-rn';
import SenderMessage from '../../components/SenderMessage';
import ReceiverMessage from '../../components/ReceiverMessage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MessageScreen = () => {
  const db = firestore();
  const {user} = useAuth();
  const {params} = useRoute();
  const {id} = params;
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState([]);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const unsubscribe = db
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot =>
        setMessages(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })),
        ),
      );
    return unsubscribe;
  }, [db, id]);

  const sendMessage = () => {
    Keyboard.dismiss();
    db.collection('chats').doc(id).collection('messages').add({
      message: input,
      userId: user?.uid,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
    setInput('');
  };

  return (
    <SafeAreaView style={tw('flex-1')}>
      <Header goback />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
        style={tw('flex-1')}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <FlatList
              data={messages}
              ref={endOfMessagesRef}
              onContentSizeChange={() => endOfMessagesRef.current.scrollToEnd()}
              style={tw('pl-4')}
              keyExtractor={item => item.id}
              renderItem={({item}) =>
                item?.userId === user.uid ? (
                  <>
                    <SenderMessage key={item.id} messages={item} />
                    <View style={tw(`pb-2`)} />
                  </>
                ) : (
                  <>
                    <ReceiverMessage key={item.id} messages={item} />
                    <View style={tw(`pb-2`)} />
                  </>
                )
              }
            />
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View
        style={tw(
          ' flex-row justify-between items-center border-t border-gray-200 px-10 py-2',
        )}>
        <TextInput
          placeholderTextColor="#000000"
          style={tw('h-10 text-lg w-full text-black')}
          placeholder={`Send Message....`}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
          value={input}
        />
        <Ionicons onPress={sendMessage} name="send" size={34} color="#FF5864" />
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;
