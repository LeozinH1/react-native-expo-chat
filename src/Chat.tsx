import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState, useEffect } from "react";
import socket from "./utils/socket";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
import MessageComponent from "./components/MessageComponent";
import randomString from "./utils/randomString";
import { Audio } from "expo-av";

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
  me: boolean;
  id: string;
}

export default function Chat({ route, navigation }: any) {
  const [text, onChangeText] = React.useState("");
  const { localuser } = route.params;
  const [chatMessages, setChatMessages] = useState<IChatMessage[]>(
    [] as IChatMessage[]
  );
  const [sound, setSound] = React.useState<Audio.Sound>();

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/notify.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

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
    if (text.length > 0) {
      socket.emit("chat message", text, localuser);
      onChangeText("");
    }
  };

  useEffect(() => {
    socket.on("chat message", (message: string, username: string) => {
      if (username !== localuser) {
        playSound();
        // displayNotification(username, message);
      }

      const id = randomString(10);

      let new_message: IChatMessage = {
        username: username,
        message: message,
        me: username == localuser,
        id: id,
      };

      setChatMessages((messages) => [...messages, new_message]);
    });
  }, [socket]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#7159c1" />

      <Text style={styles.h1}>Olá {localuser}!</Text>

      {chatMessages && (
        <FlatList
          data={chatMessages}
          renderItem={({ item }) => (
            <MessageComponent
              message={item.message}
              username={item.username}
              me={item.me}
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
