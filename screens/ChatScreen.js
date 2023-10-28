import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Avatar } from "@rneui/base";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Input } from "@rneui/themed";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  collection,
  addDoc,
  orderBy,
  query,
  getFirestore,
} from "firebase/firestore";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitleAlign: "left",
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              uri:  messages[0]?.data.photoURL ||  "https://clipart-library.com/images_k/head-silhouette-png/head-silhouette-png-24.png",
            }}
          />
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route?.params?.chatName}
          </Text>
        </View>
      ),
      headerLeft:
        Platform.OS == "ios"
          ? () => (
              <TouchableOpacity onPress={navigation?.goBack}>
                <AntDesign name="arrowleft" color={"white"} size={24} />
              </TouchableOpacity>
            )
          : () => <></>,
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color={"white"} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = async () => {
    Keyboard.dismiss();
    await addDoc(collection(db, "chats", route.params.id, "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    //await setDoc(
    /// doc(db, "chats", route.params.id, "messages", route.params.id),
    // {
    //  timestamp: serverTimestamp(),
    //  message: input,
    //  displayName: auth.currentUser.displayName,
    //  email: auth.currentUser.email,
    //  photoURL: auth.currentUser.photoURL,
    //}
    //);
    setInput("");
  };
  useLayoutEffect(() => {
    const getChats = async () => {
      const messagesRef = collection(db, "chats", route.params.id, "messages");
      const querySnapshot = await getDocs(messagesRef);
      const newMessages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setMessages(newMessages);
      //console.log(newMessages);
      // console.log(querySnapshot)
      //console.log('ref')
      //console.log(messagesRef)
      //const message = await getDocs(collection(db, 'chats'))
      // console.log(message)
      //const querySnapshot = await getDocs(q);
      // querySnapshot.docs.map((doc) =>
      //   setMessages({
      //    id: doc.id,
      //   data: doc.data(),
      //  })
      //  );
    };
    getChats();
  }, [route, messages]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <>
          <TouchableWithoutFeedback
            onPress={() => {
              if (Platform.OS === "ios") {
                Keyboard.dismiss();
              }
            }}
          >
            <>
              <ScrollView contentContainerStyle={{paddingTop: 15}}>
                {messages.map(({ id, data }) =>
                  data.email === auth.currentUser.email ? (
                    <View key={id} style={styles.receiver}>
                      <Avatar
                        source={{ uri: data.photoURL }}
                        rounded
                        containerStyle={{
                          position: 'absolute',
                          right: -5,
                          bottom: -15

                        }}
                       // position = {'absolute'}
                        size={30}
                        //bottom={-15}
                        //right={-5}
                      />
                      <Text style={styles.receiverText}>{data.message}</Text>
                    </View>
                  ) : (
                    <View key={id} style={styles.sender}>
                      <Avatar position="absolute" containerStyle={{
                        position: 'absolute',
                        bottom: -15,
                        left: -5
                      }}
                      size={30}
                      bottom={-15}
                      left={-5}/>
                      <Text style={styles.senderText}>{data.message}</Text>
                      <Text style={styles.senderName}>{data.displayName}</Text>
                    </View>
                  )
                )}
              </ScrollView>
              <View style={styles.footer}>
                <Input
                  placeholder="Signal Message"
                  containerStyle={styles.input}
                  value={input}
                  onSubmitEditing={sendMessage}
                  onChangeText={(text) => setInput(text)}
                  inputContainerStyle={{
                    borderBottomWidth: 0,
                    alignSelf: "center",
                  }}
                  textAlignVertical="center"
                />
                <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                  <Ionicons name="send" size={24} color={"#2B68E6"} />
                </TouchableOpacity>
              </View>
            </>
          </TouchableWithoutFeedback>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    width: "100%",
  },
  input: {
    bottom: 0,
    height: 45,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    borderRadius: 30,
    flex: 1,
  },
  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: 'white'
  },
  senderText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 10,
    marginBottom: 15
  },
  receiverText: {
    color: 'black',
    fontWeight: '500',
    marginLeft: 10
  }
});
