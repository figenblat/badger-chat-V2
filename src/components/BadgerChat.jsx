import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import BadgerChatroomScreen from "./screens/BadgerChatroomScreen";
import BadgerRegisterScreen from "./screens/BadgerRegisterScreen";
import BadgerLoginScreen from "./screens/BadgerLoginScreen";
import BadgerLandingScreen from "./screens/BadgerLandingScreen";
import BadgerLogoutScreen from "./screens/BadgerLogoutScreen";
import { Alert } from "react-native";
import BadgerConversionScreen from "./screens/BadgerConversionScreen";

const ChatDrawer = createDrawerNavigator();

export default function BadgerChat() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const response = await fetch(
          "https://cs571.org/api/f23/hw9/chatrooms",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "X-CS571-ID":
                "bid_3f77594611bcb68f84c6e1f3737d970485ae9f189cd52bfdbf356cbb114bbe6b",
            },
          }
        );

        if (response.ok) {
          const chatroomsData = await response.json();
          setChatrooms(chatroomsData);
        }
      } catch (error) {
        console.error("Error fetching chatrooms:", error);
      }
    };

    fetchChatrooms();
  }, []);

  async function handleLogin(username, password) {
    try {
      const response = await fetch("https://cs571.org/api/f23/hw9/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID":
            "bid_3f77594611bcb68f84c6e1f3737d970485ae9f189cd52bfdbf356cbb114bbe6b",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const { token } = await response.json();

        await SecureStore.setItemAsync("userToken", token);
        await SecureStore.setItemAsync("username", username);

        setIsLoggedIn(true);
        setIsGuest(false);
      } else if (response.status === 401 || response.status === 400) {
        console.error("Login failed:", response.status);
        Alert.alert(
          "Incorrect login",
          "Please check your username and password."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Error occurred. Please try again.");
    }
  }

  const handleSignup = async (username, password) => {
    try {
      const response = await fetch("https://cs571.org/api/f23/hw9/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CS571-ID":
            "bid_3f77594611bcb68f84c6e1f3737d970485ae9f189cd52bfdbf356cbb114bbe6b",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const responseData = await response.json();

        const { token } = responseData;
        await SecureStore.setItemAsync("userToken", token);

        setIsLoggedIn(true);
        setIsGuest(false);
      } else {
        const errorData = await response.json();
        if (response.status === 409) {
          console.error("User already exists:", errorData.msg);
          Alert.alert("User already exists");
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const logoutHandler = async () => {
    try {
      await SecureStore.deleteItemAsync("userToken");

      setIsLoggedIn(false);
      setIsRegistering(false);
    } catch (error) {
      console.error("Error occurred during logout:", error);
    }
  };

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map((chatroom) => (
            <ChatDrawer.Screen
              key={chatroom}
              name={chatroom}
              component={BadgerChatroomScreen}
              initialParams={{ chatroomName: chatroom, isGuest: false }}
            />
          ))}
          <ChatDrawer.Screen
            name="Logout"
            options={{
              drawerLabelStyle: {
                color: "red",
              },
            }}
          >
            {(props) => (
              <BadgerLogoutScreen {...props} logoutHandler={logoutHandler} />
            )}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isGuest) {
    if (isRegistering) {
      return (
        <BadgerRegisterScreen
          handleSignup={handleSignup}
          setIsRegistering={setIsRegistering}
          setIsGuest={setIsGuest}
        />
      );
    }
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {chatrooms.map((chatroom) => (
            <ChatDrawer.Screen
              key={chatroom}
              name={chatroom}
              component={BadgerChatroomScreen}
              initialParams={{ chatroomName: chatroom, isGuest: true }}
            />
          ))}
          <ChatDrawer.Screen
            name="Signup"
            options={{
              drawerLabelStyle: {
                color: "red",
              },
            }}
          >
            {(props) => (
              <BadgerConversionScreen
                {...props}
                setIsRegistering={setIsRegistering}
              />
            )}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return (
      <BadgerRegisterScreen
        handleSignup={handleSignup}
        setIsRegistering={setIsRegistering}
        setIsGuest={setIsGuest}
      />
    );
  } else {
    return (
      <BadgerLoginScreen
        handleLogin={handleLogin}
        setIsRegistering={setIsRegistering}
        setIsGuest={setIsGuest}
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }
}
