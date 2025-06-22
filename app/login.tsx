import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SERVER } from "@/lib/axios";
import { User } from "@/lib/types";
import { AxiosError } from "axios";
import { useAuth } from "@/providers/auth-provider";

export default function LoginScreen() {
  const { setUser } = useAuth();
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, val: string) => {
    setError("");
    setData({ ...data, [key]: val });
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await SERVER.post<User>("/users/login", {
        email: data.email,
        password: data.password,
      });
      if (response.status === 200) {
        console.log("Set-Cookies Header", response.headers["set-cookie"]);
        const token = response.headers?.["set-cookie"]
          ?.find((cookie) => cookie.includes("zyntro-session"))
          ?.split(";")[0]
          .split("=")[1];
        console.log("token", token);
        if (token) {
          await SecureStore.setItemAsync("zyntro-session", token);
          setUser(response.data);
          router.push("/(tabs)/profile");
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data.message);
        setError(error.response?.data.message || "Unable to login");
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../assets/images/zyntro-icon.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={data.email}
            onChangeText={(val) => handleChange("email", val)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={data.password}
            onChangeText={(val) => handleChange("password", val)}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>
              {loading ? "Please wait..." : "Login"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContainer}>
          <Text
            style={styles.footerText}
            onPress={() => Linking.openURL("https://zyntro.vercel.app")}
          >
            Don't have an account?{" "}
            <Text style={styles.signupText}>Sing up</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1464",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#777",
  },
  formContainer: {
    marginHorizontal: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderColor: "#e8e7ff",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#F0F2F5",
  },
  loginButton: {
    backgroundColor: "#1a1464",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotText: {
    color: "#5652CC",
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
  },
  footerContainer: {
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    color: "#777",
    fontSize: 14,
  },
  signupText: {
    color: "#1a1464",
    fontWeight: "bold",
  },
});
