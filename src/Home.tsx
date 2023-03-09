import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useState } from "react";
import socket from "./utils/socket";

import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Button,
} from "react-native";

import Modal from "react-native-modal";

export default function Home({ navigation }: any) {
  const [text, onChangeText] = React.useState("");
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const handleModal = () => setIsModalVisible(() => !isModalVisible);

  const join = async () => {
    if (text.length >= 3 && text.length <= 20) {
      await AsyncStorage.setItem("username", text);

      socket.emit("user join", text);

      navigation.push("Chat");
    } else {
      handleModal();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" backgroundColor="#7159c1" />

      <Text style={styles.h1}>SOCKET.IO CHAT</Text>

      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Digite seu nome..."
        placeholderTextColor="#5b5b5b"
      />

      <Pressable style={styles.button} onPress={join}>
        <Text style={styles.text}>Entrar</Text>
      </Pressable>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modal}>
          <Text style={styles.h2}>ERRO</Text>
          <Text>Seu nome precisa ter entre 3 e 20 caracteres!</Text>
          <Pressable style={styles.button} onPress={handleModal}>
            <Text style={styles.text}>Entendi</Text>
          </Pressable>
        </View>
      </Modal>
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

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 20,
  },

  text: {
    color: "#fff",
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

  h1: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    letterSpacing: 3,
  },

  h2: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
