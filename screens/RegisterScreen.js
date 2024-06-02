import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Dimensions,
  Platform,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, Input } from "@rneui/base";
import { Text } from "@rneui/themed";
import { db, auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const width = Dimensions.get("screen").width;

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({});
  }, [navigation]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const register = async () => {
    try {
      // Create user with email and password
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, {
        displayName: name,
        photoURL: imageUrl || "https://image.flaticon.com/icons/png/512/147/147144.png", // Example photoURL from Flaticon
      });
    } catch (error) {
      alert(error.message);
    }

    //.then((authUser) => {
    //  authUser.user.displayName = name
    // authUser.user.photoURL = imageUrl || "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser-avatar_6596121&psig=AOvVaw2eq8w2X4KMC74a_tIifwZX&ust=1697473883773000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNjpwZe9-IEDFQAAAAAdAAAAABAD"
    //photoURL:
    // imageUrl ||
    //"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser-avatar_6596121&psig=AOvVaw2eq8w2X4KMC74a_tIifwZX&ust=1697473883773000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCNjpwZe9-IEDFQAAAAAdAAAAABAD",
    //console.log(authUser.user.photoURL)
    //console.log(authUser.user.displayName)
    //})
    //.catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : ""}
      style={styles.container}
    >
      <StatusBar style="light" />
      <Text h4 style={{ marginBottom: 50 }}>
        Create an account to continue
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autoFocus
          value={name}
          type="text"
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <View style={{ flexDirection: "row" }}>
          <Input
            placeholder="Profile avatar (optional)"
            type="text"
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
            onSubmitEditing={register}
          />
          <TouchableOpacity
            style={{
              left: 300,
              right: 0,
              top: 0,
              bottom: 0,
              position: "absolute",
            }}
            onPress={pickImage}
          >
            <MaterialCommunityIcons
              name="image-filter-center-focus-strong"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Button
        raised
        onPress={register}
        title={"Register"}
        containerStyle={styles.button}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 10,
  },
  inputContainer: {
    width: width * 0.8,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});

export default RegisterScreen;
