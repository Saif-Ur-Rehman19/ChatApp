import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import CustomListItem from "../components/CustomListItem";
import { Avatar } from "@rneui/themed";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  useEffect(() => {
    try {
      const chatsRef = collection(db, "chats");
      onSnapshot(chatsRef, (querySnapshot) => {
        const firestoreChats = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setChats(firestoreChats);
      });
    } catch (error) {
      alert(error.message)
    }
   
  }, []);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Signal",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerLeft: () => (
        <View style={{}}>
          <TouchableOpacity activeOpacity={0.5} onPress={logout}>
            <Avatar
              rounded
              source={{
                uri: auth?.currentUser?.photoURL,
              }}
              style={{
                width: 33,
                height: 33,
                marginRight: Platform.OS == "android" ? 25 : 0,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 20,
            width: 80,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color={"black"} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate("AddChat")}
          >
            <SimpleLineIcons name="pencil" size={24} color={"black"} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const logout = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        alert(error);
      });
  };

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id: id,
      chatName: chatName
    })
  }
  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({id, data: {chatName}}) => (
          <>
          <CustomListItem key={id} id={id} chatName={chatName} enterChat={enterChat}/>
         </>
          
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    height: '100%',
  }
})
export default HomeScreen;
