import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Entypo,
  Feather,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/providers/auth-provider";
import { AVATAR_PLACEHOLDER } from "@/lib/constants";

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = () => {
    router.push("/login");
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  console.log(user.image);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with Logout */}
        <View style={styles.header}>
          <View style={styles.spacer} />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <FontAwesome name="sign-out" size={16} color="#333" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={user?.image ? { uri: user?.image } : AVATAR_PLACEHOLDER}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{user?.name}</Text>
          <Text style={styles.profileTitle}>{user?.occupation}</Text>
          <View style={styles.badgeContainer}>
            <FontAwesome name="star" size={14} color="#5652CC" />
            <Text style={styles.badgeText}>1600</Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <FontAwesome5 name="user-tie" size={14} color="#333" />
            </View>
            <Text style={styles.infoText}>{user?.occupation}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <FontAwesome name="star" size={14} color="#333" />
            </View>
            <Text style={styles.infoText}>1600</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <FontAwesome5 name="medal" size={14} color="#333" />
            </View>
            <Text style={styles.infoText}>4th</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <MaterialIcons name="email" size={14} color="#333" />
            </View>
            <Text style={styles.infoText}>{user?.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoIconContainer}>
              <FontAwesome name="phone" size={14} color="#333" />
            </View>
            <Text style={styles.infoText}>
              {new Date(user?.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Working With Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Working with</Text>

          <View style={styles.teamMemberItem}>
            <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.teamMemberImage}
            />
            <Text style={styles.teamMemberName}>Zohaib Murtaza</Text>
          </View>

          <View style={styles.teamMemberItem}>
            <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.teamMemberImage}
            />
            <Text style={styles.teamMemberName}>Alia Tabassum</Text>
          </View>

          <View style={styles.teamMemberItem}>
            <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.teamMemberImage}
            />
            <Text style={styles.teamMemberName}>Alia Tabassum</Text>
          </View>

          <View style={styles.teamMemberItem}>
            <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.teamMemberImage}
            />
            <Text style={styles.teamMemberName}>Maryam Yousaf</Text>
          </View>

          <View style={styles.teamMemberItem}>
            <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.teamMemberImage}
            />
            <Text style={styles.teamMemberName}>Maryam Yousaf</Text>
          </View>

          <View style={styles.teamMemberItem}>
            <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.teamMemberImage}
            />
            <Text style={styles.teamMemberName}>Maryam Yousaf</Text>
          </View>

          <View style={styles.teamMemberItem}>
            <Image
              source={require("../../assets/images/avatar-placeholder.png")}
              style={styles.teamMemberImage}
            />
            <Text style={styles.teamMemberName}>Maryam Yousaf</Text>
          </View>
        </View>

        {/* Projects Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Projects</Text>

          <View style={styles.projectItem}>
            <Text style={styles.projectName}>Atlas Mobile Banking App</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: "65%", backgroundColor: "#4b43c9" },
                ]}
              />
              <View style={styles.progressBarBackground} />
            </View>
            <Text style={styles.progressText}>65% Complete</Text>
          </View>

          <View style={styles.projectItem}>
            <Text style={styles.projectName}>BankX WebApp</Text>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: "65%", backgroundColor: "#4b43c9" },
                ]}
              />
              <View style={styles.progressBarBackground} />
            </View>
            <Text style={styles.progressText}>65% Complete</Text>
          </View>

          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View More</Text>
            <Feather name="chevron-down" size={16} color="#777" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingTop: 72,
  },
  scrollContainer: {
    paddingBottom: 90,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  spacer: {
    width: 70,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginLeft: 5,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eaeaea",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  profileTitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textTransform: "capitalize",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f1fa",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 14,
    color: "#5652CC",
    marginLeft: 5,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  infoIconContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  teamMemberItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  teamMemberImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eaeaea",
  },
  teamMemberName: {
    fontSize: 14,
    color: "#333",
    marginLeft: 12,
  },
  projectItem: {
    marginBottom: 16,
  },
  projectName: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#eaeaea",
    overflow: "hidden",
    position: "relative",
    marginBottom: 4,
  },
  progressBar: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    borderRadius: 4,
  },
  progressBarBackground: {
    position: "absolute",
    right: 0,
    top: 0,
    height: "100%",
    width: "35%",
    backgroundColor: "#eaeaea",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: "#777",
    marginRight: 4,
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFF",
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EAEAEA",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#5652CC",
  },
  navText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  activeNavText: {
    color: "#5652CC",
  },
});
