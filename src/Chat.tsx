import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "./utils/socket";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import MessageComponent from "./components/MessageComponent";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
} from "react-native";

interface IChatMessage {
  message: string;
  username: string;
  status: boolean;
  id: string;
}

export default function Chat({ navigation }: any) {
  const [user, setUser] = useState("");
  const [text, onChangeText] = React.useState("");
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>(
    [] as IChatMessage[]
  );

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

  const createChannelId = async () => {
    const channelId = await notifee.createChannel({
      id: "test",
      name: "chat",
      vibration: true,
      importance: AndroidImportance.HIGH,
    });

    return channelId;
  };

  const displayNotification = async (title: string, message: string) => {
    await notifee.requestPermission();

    const channelId = await createChannelId();

    await notifee.displayNotification({
      id: "7",
      title: title,
      body: message,
      android: {
        channelId,
      },
    });
  };

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log("Usuário descartou a notificação!");
          break;
        case EventType.ACTION_PRESS:
          console.log("Usuário tocou na notificação!", detail.notification);
      }
    });
  });

  useEffect(() => {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log("Usuário tocou na notificação", detail.notification);
      }
    });
  });

  const sendMessage = () => {
    socket.emit("chat message", text, user);
    onChangeText("");
  };

  useLayoutEffect(() => {
    getUsername();
  }, []);

  const makeid = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  useEffect(() => {
    socket.on("chat message", (message: string, username: string) => {
      // displayNotification(username, message);

      const id = makeid(10);

      if (username.toString() == user.toString()) {
        console.log("true");
      } else {
        console.log("false");
      }

      let new_message: IChatMessage = {
        username: username,
        message: message,
        status: username == user.toString(),
        id: id,
      };

      setChatMessages((messages) => [...messages, new_message]);
    });
  }, [socket]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#7159c1" />

      <Text style={styles.h1}>Olá {user}!</Text>

      {chatMessages && (
        <FlatList
          data={chatMessages}
          renderItem={({ item }) => (
            <MessageComponent
              message={item.message}
              username={item.username}
              status={item.status}
              id={item.id}
            />
          )}
          inverted
          contentContainerStyle={{ flexDirection: "column-reverse" }}
          style={styles.chat}
        />
      )}

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
    padding: 20,
  },

  chat: {
    width: "100%",
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
    width: "100%",
    borderRadius: 5,
  },

  button: {
    backgroundColor: "#7159c1",
    padding: 15,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
  },

  text: {
    color: "#fff",
  },
});
