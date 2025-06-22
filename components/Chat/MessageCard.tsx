// components/chat/MessageCard.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import MessageImages from "./MessageImages";
import MessageFiles from "./MessageFiles";
import { AVATAR_PLACEHOLDER } from "@/lib/constants";
import { ChatMessage } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { SERVER } from "@/lib/axios";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { removeFiles } from "@/lib/supabase";
import * as Clipboard from "expo-clipboard";

const MessageCard = ({
  message,
  currentUserId,
}: {
  message: ChatMessage;
  currentUserId: string;
}) => {
  const isMe = message.senderId === currentUserId;

  const { data: user } = useQuery({
    queryKey: ["user", message.senderId],
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
    staleTime: 1000,
    queryFn: async () => {
      const { data } = await SERVER.get(`/users/get-by-id/${message.senderId}`);
      return data;
    },
  });

  const handleDeleteMessage = async () => {
    try {
      const fileUrls = message.content.files?.map((file) => file.url) || [];
      const imageUrls = message.content.images || [];
      const urls = [...fileUrls, ...imageUrls];
      if (urls.length) await removeFiles(urls);
      await deleteDoc(doc(db, "messages", message._id));
    } catch (error) {
      console.log(error);
    }
  };

  const copyToClipboard = async () => {
    if (!message.content.text) return;
    await Clipboard.setStringAsync(message.content.text);
  };

  return (
    <View style={[styles.row, isMe ? styles.rowMe : styles.rowOther]}>
      {!isMe && (
        <Image
          source={user?.avatar ? { uri: user.avatar } : AVATAR_PLACEHOLDER}
          style={styles.avatar}
        />
      )}
      <View
        style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
      >
        {!isMe && (
          <Text style={styles.sender}>{user?.name || message.senderId}</Text>
        )}
        {message.content.text && (
          <Text
            style={[styles.text, isMe ? styles.textMe : styles.textOther]}
            onLongPress={copyToClipboard}
          >
            {message.content.text}
          </Text>
        )}
        <MessageImages images={message.content.images} />
        <MessageFiles files={message.content.files} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginBottom: 12, alignItems: "flex-end" },
  rowMe: { justifyContent: "flex-end" },
  rowOther: { justifyContent: "flex-start" },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    backgroundColor: "#e1e1e1",
  },
  bubble: { maxWidth: "75%", padding: 12, borderRadius: 16 },
  bubbleMe: { backgroundColor: "#1a1464" },
  bubbleOther: { backgroundColor: "#fff" },
  sender: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
    color: "#5652cc",
  },
  text: { fontSize: 16 },
  textOther: { color: "#333" },
  textMe: { color: "#fff" },
});

export default MessageCard;
