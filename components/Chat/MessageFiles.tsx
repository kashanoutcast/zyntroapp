// components/chat/MessageFiles.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MessageFiles = ({
  files,
}: {
  files?: { name: string; url: string }[];
}) => {
  if (!files) return null;
  return (
    <View style={styles.container}>
      {files.map((f, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.file}
          onPress={() => Linking.openURL(f.url)}
        >
          <Ionicons name="document-outline" size={20} style={styles.icon} />
          <Text style={styles.name} numberOfLines={1}>
            {f.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  file: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  icon: { marginRight: 6 },
  name: { flexShrink: 1, fontSize: 14, color: "#555" },
});

export default MessageFiles;
