import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "./utils/socket";
import notifee, { AndroidImportance } from "@notifee/react-native";

export default function Chat({ navigation }: any) {
  const [user, setUser] = useState("");
  const [text, onChangeText] = React.useState("");

  const getUsername = async () => {
    try {
      const value = await AsyncStorage.getItem("username");
      if (value !== null) {
        setUser(value);
      }
    } catch (e) {
      console.error("Error while loading username!");
    }
  };

  const displayNotification = async (title: string, message: string) => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: "test",
      name: "chat",
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      id: "7",
      title: title,
      body: message,
      android: {
        channelId,
      },
    });
  };

  const sendMessage = () => {
    socket.emit("chat message", text, user);
    onChangeText("");
  };

  useLayoutEffect(() => {
    getUsername();
  }, []);

  useEffect(() => {
    socket.on("chat message", (message: string, username: string) => {
      // if (user != username) {
      //   displayNotification(username, message);
      //   console.log(username + ": " + message);
      // }

      console.log(message);
    });
  }, [socket]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#7159c1" />

      <Text style={styles.h1}>{user}</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Write your message here..."
        placeholderTextColor="#5b5b5b"
      />

      <Pressable style={styles.button} onPress={sendMessage}>
        <Text style={styles.text}>Enviar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0e0e0e",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  h1: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    letterSpacing: 3,
  },

  input: {
    color: "#fff",
    backgroundColor: "#121212",
    padding: 10,
    borderWidth: 1,
    height: 50,
    width: 300,
    borderRadius: 5,
  },

  button: {
    backgroundColor: "#7159c1",
    padding: 10,
    width: 100,
    alignItems: "center",
    borderRadius: 5,
  },

  text: {
    color: "#fff",
  },
});
