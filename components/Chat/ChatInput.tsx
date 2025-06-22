// components/chat/ChatInput.tsx
import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/providers/auth-provider";
import { useProject } from "@/providers/project-provider";
import { uploadFile } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

// helper to convert URI → File
async function uriToFile(
  uri: string,
  name: string,
  type: string
): Promise<File> {
  const resp = await fetch(uri);
  const blob = await resp.blob();
  return new File([blob], name, { type });
}

const ChatInput = () => {
  const { user } = useAuth();
  const { activeProject } = useProject();

  const [text, setText] = useState("");
  const [files, setFiles] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const [images, setImages] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const [inputHeight, setInputHeight] = useState(40);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled && result.assets.length) {
      const { uri } = result.assets[0];
      const name = uri.split("/").pop()!;
      const type = "image/" + name.split(".").pop();
      setImages((prev) => [...prev, { uri, name, type }]);
    }
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
    });

    // new API: use `canceled` + `assets[]`
    if (!result.canceled) {
      // first (and only) asset
      const asset = result.assets[0];
      setFiles((prev) => [
        ...prev,
        {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || "application/octet-stream",
        },
      ]);
    }
  };

  const handleSend = async () => {
    if (!text.trim() && files.length + images.length === 0) return;
    try {
      setLoading(true);

      // turn URIs into real File objects
      const fileObjs = await Promise.all(
        files.map((f) => uriToFile(f.uri, f.name, f.type))
      );
      const imageObjs = await Promise.all(
        images.map((i) => uriToFile(i.uri, i.name, i.type))
      );

      // upload via your supabase util
      const uploadedFiles = await Promise.all(fileObjs.map(uploadFile));
      const uploadedImages = await Promise.all(imageObjs.map(uploadFile));

      // build Firestore payload
      const payload: any = {
        content: { text: text || undefined },
        senderId: user?._id,
        projectId: activeProject?._id,
        timestamp: serverTimestamp(),
      };
      if (uploadedFiles.length) {
        payload.content.files = uploadedFiles.map((url, i) => ({
          name: fileObjs[i].name,
          url,
        }));
      }
      if (uploadedImages.length) {
        payload.content.images = uploadedImages;
      }

      await addDoc(collection(db, "messages"), payload);

      // reset
      setText("");
      setFiles([]);
      setImages([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setInputHeight(40);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
        <Ionicons name="image-outline" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickFile} style={styles.iconButton}>
        <Ionicons name="attach-outline" size={24} />
      </TouchableOpacity>
      <TextInput
        style={[styles.input, { height: inputHeight }]}
        multiline={true}
        placeholder="Type a message…"
        value={text}
        onChangeText={setText}
        onContentSizeChange={(
          e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
        ) => {
          setInputHeight(Math.max(60, e.nativeEvent.contentSize.height));
        }}
      />
      <TouchableOpacity
        onPress={handleSend}
        style={styles.sendButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Ionicons name="send-outline" size={15} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 8,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#e8e7ff",
  },
  iconButton: { padding: 8 },
  input: {
    flex: 1,
    marginHorizontal: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F2F5",
    borderRadius: 8,
    textAlignVertical: "top", // important for multiline on Android
  },
  sendButton: {
    backgroundColor: "#1a1464",
    padding: 12,
    borderRadius: 8,
  },
});

export default ChatInput;
