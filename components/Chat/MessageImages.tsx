// components/chat/MessageImages.tsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";

const MessageImages = ({ images }: { images?: string[] }) => {
  if (!images) return null;

  console.log("🚀 ~ MessageImages ~ images:", images);
  return (
    <View style={styles.container}>
      {images.map((uri, idx) =>
        uri ? <Image key={idx} source={{ uri }} style={styles.image} /> : null
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  image: { width: "100%", aspectRatio: 1, borderRadius: 8, margin: "1%" },
});

export default MessageImages;
