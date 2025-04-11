import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Image, SafeAreaView } from 'react-native';
import { Ionicons, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

// Interface for our chat item
interface ChatItem {
  id: string;
  name: string;
  message: string;
  avatar: any;
}

export default function ChatScreen() {
  // Sample chat data
  const chatData: ChatItem[] = Array(9).fill(null).map((_, index) => ({
    id: index.toString(),
    name: 'Kashan Akram',
    message: 'How is the project going?',
    avatar: require('../../assets/images/avatar-placeholder.png')
  }));

  // Render chat item
  const renderChatItem = ({ item }: { item: ChatItem }) => (
    <TouchableOpacity style={styles.chatItem}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.chatMessage}>{item.message}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Messages"
          placeholderTextColor="#999"
        />
      </View>

      {/* Schedule Meeting Button */}
      <TouchableOpacity style={styles.scheduleButton}>
        <Text style={styles.scheduleButtonText}>Schedule Meeting</Text>
      </TouchableOpacity>

      {/* Chat List */}
      <FlatList
        data={chatData}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    paddingTop: 72,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 12,
    marginHorizontal: 16,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
    fontSize: 16,
  },
  scheduleButton: {
    backgroundColor: '#120C91',
    borderRadius: 8,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  chatList: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e1e1e1',
  },
  chatContent: {
    marginLeft: 12,
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 14,
    color: '#888',
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#120C91',
  },
  navText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeNavText: {
    color: '#120C91',
  },
});