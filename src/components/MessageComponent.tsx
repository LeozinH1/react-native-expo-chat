import { View, Text, StyleSheet } from "react-native";
import React, { useLayoutEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

interface ComponentProps {
  message: string;
  username: string;
  status: boolean;
  id: string;
}

const MessageComponent: React.FC<ComponentProps> = ({
  message,
  username,
  status,
  id,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.time}>04:20</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1b1b1b",
    marginBottom: 25,
    borderRadius: 5,
    padding: 10,
    position: "relative",
  },
  text: {
    color: "#fff",
  },
  username: {
    color: "#fff",
  },
  message: {
    color: "#fff",
    fontSize: 20,
  },
  time: {
    color: "#3f3f3f",
    position: "absolute",
    bottom: -18,
    right: 0,
  },
});

export default MessageComponent;
