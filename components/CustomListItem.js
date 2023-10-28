import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { ListItem, Avatar } from "@rneui/themed";
export default function CustomListItem({ id, chatName, enterChat }) {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    async function getMessagesForThisComponent() {
      const messagesQuery = query(
        collection(db, "chats", id, "messages"),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(messagesQuery);
      const newMessages = querySnapshot.docs.map((doc) => ({
        data: doc.data(),
      }));
      setChatMessages(newMessages);
      console.log(chatMessages)
    }
    getMessagesForThisComponent();
  }, [chatMessages]);
  return (
    <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName)}>
      <Avatar
        rounded
        source={{
          uri: chatMessages?.[0]?.data?.photoURL ||    "https://clipart-library.com/images_k/head-silhouette-png/head-silhouette-png-24.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title>{chatName}</ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0]?.data?.displayName} : {chatMessages?.[0]?.data?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
}

const styles = StyleSheet.create({});
