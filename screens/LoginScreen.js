import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Input } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      } else {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);
  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      alert(error)
    });
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#00ff00" style={{}} />
      </View>
    );
  } else {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar style="light" />
        <Image
          source={{
            uri: "https://logowik.com/content/uploads/images/signal-messenger-icon9117.jpg",
          }}
          style={{
            width: 200,
            height: 200,
            backgroundColor: "white",
            resizeMode: "contain",
          }}
        />
        <View style={styles.inputContainer}>
          <Input
            placeholder="Email"
            autoFocus
            type="email"
            inputContainerStyle={{}}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            placeholder="Password"
            type="password"
            secureTextEntry
            value={password}
            onSubmitEditing={signIn}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <Button
          containerStyle={styles.button}
          title={"Login"}
          onPress={signIn}
        />
        <Button
          containerStyle={[styles.button, {}]}
          title={"Register"}
          type="outline"
          onPress={() => navigation.navigate("Register")}
        />
        <View style={{ height: 40 }}></View>
      </KeyboardAvoidingView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    marginTop: 10,
  },
});

export default LoginScreen;
