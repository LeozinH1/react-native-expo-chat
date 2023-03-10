import { View, Text, StyleSheet } from "react-native";

import React from "react";

interface ComponentProps {
  message: string;
  username: string;
  me: boolean;
  id: string;
}

const MessageComponent: React.FC<ComponentProps> = ({
  message,
  username,
  me,
  id,
}) => {
  return (
    <View style={styles(me).container}>
      <Text style={styles().username}>{username}</Text>
      <Text style={styles().message}>{message}</Text>
      <Text style={styles(me).time}>04:20</Text>
    </View>
  );
};

const styles = (me?: boolean) =>
  StyleSheet.create({
    container: {
      backgroundColor: me ? "#222222" : "#7159c1",
      marginBottom: 25,
      borderRadius: 5,
      padding: 10,
      position: "relative",
      alignSelf: me ? "flex-end" : "flex-start",
      width: 200,
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
      right: me ? 0 : "auto",
    },
  });

export default MessageComponent;
