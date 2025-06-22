// components/chat/ChatScreen.tsx
import React, { useRef, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "@/providers/auth-provider";
import { useProject } from "@/providers/project-provider";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import ChatInput from "@/components/Chat/ChatInput";
import MessageCard from "@/components/Chat/MessageCard";
import { ChatMessage } from "@/lib/types";

const ChatScreen = () => {
  const { user } = useAuth();
  const { activeProject } = useProject();
  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  const messagesQuery = activeProject?._id
    ? query(
        collection(db, "messages"),
        where("projectId", "==", activeProject._id),
        orderBy("timestamp", "asc")
      )
    : null;

  const [messages, messagesLoading] = useCollection(messagesQuery);

  const messagesDocs: ChatMessage[] =
    messages?.docs.map((doc) => {
      return {
        ...doc.data(),
        _id: doc.id,
      } as ChatMessage;
    }) || [];

  useEffect(() => {
    if (messagesDocs.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messagesDocs.length]);

  if (!user?._id || !activeProject?._id || messagesLoading)
    return <ActivityIndicator size="large" />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <SafeAreaView style={styles.listContainer}>
        <FlatList
          ref={flatListRef}
          data={messagesDocs}
          renderItem={({ item }) => (
            <MessageCard message={item} currentUserId={user?._id} />
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.messagesContainer}
        />
      </SafeAreaView>
      <ChatInput />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },
  listContainer: { flex: 1 },
  messagesContainer: { padding: 16, paddingBottom: 80 },
});

export default ChatScreen;
