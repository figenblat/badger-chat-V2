import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import { Modal, TextInput, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

function BadgerChatroomScreen({ route }) {
  const { chatroomName, isGuest } = route.params;
  const [isGuestUser, setIsGuestUser] = useState(isGuest);
  const [chatroomMessages, setChatroomMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [shouldFetchMessages, setShouldFetchMessages] = useState(true);
  const scrollViewRef = useRef(null);

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState(null);

  useEffect(() => {
    async function retrieveUsername() {
      const storedUsername = await SecureStore.getItemAsync("username");
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        setIsGuestUser(true);
      }
    }
    retrieveUsername();
  }, []);

  useEffect(() => {
    if (shouldFetchMessages) {
      async function fetchChatroomMessages() {
        try {
          const response = await fetch(
            `https://cs571.org/api/f23/hw9/messages?chatroom=${chatroomName}&page=${currentPage}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "X-CS571-ID":
                  "bid_3f77594611bcb68f84c6e1f3737d970485ae9f189cd52bfdbf356cbb114bbe6b",
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            setChatroomMessages(data.messages);
          } else {
            console.error("Error fetching messages:", data.msg);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
      fetchChatroomMessages();
      setShouldFetchMessages(false);
    }
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [chatroomName, currentPage, shouldFetchMessages]);

  const handleCreatePost = async () => {
    if (!postTitle || !postContent) {
      Alert.alert(
        "Incomplete Information",
        "Please fill out both the post title, as well as the post content."
      );
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(
        `https://cs571.org/api/f23/hw9/messages?chatroom=${chatroomName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CS571-ID":
              "bid_3f77594611bcb68f84c6e1f3737d970485ae9f189cd52bfdbf356cbb114bbe6b",
          },
          body: JSON.stringify({
            title: postTitle,
            content: postContent,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsModalVisible(false);
        setPostTitle("");
        setPostContent("");
        setShouldFetchMessages(true);
        Alert.alert("Success", "Your post was successfully created.");

        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
      } else {
        if (response.status === 400) {
          console.error("Error creating post:", data.msg);
          Alert.alert("Invalid Request", data.msg);
        } else if (response.status === 401) {
          console.error("Authentication error:", data.msg);
          Alert.alert("Authentication Error", data.msg);
        } else if (response.status === 404) {
          console.error("Chatroom not found:", data.msg);
          Alert.alert("Chatroom Not Found", data.msg);
        } else if (response.status === 413) {
          console.error("Post too long:", data.msg);
          Alert.alert("Post Length Exceeded", data.msg);
        } else {
          console.error("Error creating post:", data.msg);
          Alert.alert("Error", "Failed to create post. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await fetch(
        `https://cs571.org/api/f23/hw9/messages?id=${postId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CS571-ID":
              "bid_3f77594611bcb68f84c6e1f3737d970485ae9f189cd52bfdbf356cbb114bbe6b",
          },
        }
      );

      if (response.ok) {
        setChatroomMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== postId)
        );
        Alert.alert("Success", "Your post was successfully deleted.");
      } else {
        const responseData = await response.json();
        if (response.status === 401) {
          Alert.alert("Authentication Error", responseData.msg);
        } else if (response.status === 404) {
          Alert.alert("Error", responseData.msg);
        } else {
          Alert.alert("Error", "Failed to delete post. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Alert.alert("Error", "Failed to delete post. Please try again.");
    }
  };

  const fetchUserId = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!token) {
        return null;
      }

      const response = await fetch("https://cs571.org/api/f23/hw9/whoami", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-CS571-ID":
            "bid_3f77594611bcb68f84c6e1f3737d970485ae9f189cd52bfdbf356cbb114bbe6b",
        },
      });

      const data = await response.json();

      if (response.ok && data.isLoggedIn) {
        const userId = data.user.id;
        const username = data.user.username;
        console.log(userId);
        return { userId, username };
      } else {
        Alert.alert("Not Logged In", "Please log in first.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchUserId();
      setUserId(userData?.userId);
      setUsername(userData?.username);
    };

    fetchUser();
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      setShouldFetchMessages(true);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      setShouldFetchMessages(true);
    }
  };

  const isCurrentUserOwner = (messagePoster) => {
    return messagePoster === username;
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      ref={scrollViewRef}
    >
      <Text style={{ margin: 10, fontSize: 20 }}>{chatroomName}</Text>
      {chatroomMessages.length === 0 ? (
        <Text>No posts available!</Text>
      ) : (
        chatroomMessages.map((message) => (
          <View key={message.id} style={styles.messageContainer}>
            <BadgerChatMessage
              title={message.title}
              poster={message.poster}
              content={message.content}
              created={message.created}
            />
            {isCurrentUserOwner(message.poster) && (
              <TouchableOpacity onPress={() => handleDeletePost(message.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}
      <View style={styles.paginationWrapper}>
        <View style={styles.pageNumberContainer}>
          <Text style={styles.pageNumberText}>Page {currentPage}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.pageButton, styles.halfWidthButton]}
            onPress={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <Text
              style={[
                styles.pageButtonText,
                { color: currentPage === 1 ? "#D8D8D8" : "black" },
              ]}
            >
              PREVIOUS PAGE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pageButton, styles.halfWidthButton]}
            onPress={handleNextPage}
            disabled={currentPage === totalPages}
          >
            <Text
              style={[
                styles.pageButtonText,
                { color: currentPage === 4 ? "#D8D8D8" : "black" },
              ]}
            >
              NEXT PAGE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <TextInput
              style={[styles.inputField, styles.postTitleInput]}
              placeholder="Post Title"
              placeholderTextColor={"gray"}
              value={postTitle}
              onChangeText={setPostTitle}
            />
            <TextInput
              style={[styles.inputField, { height: 150 }]}
              placeholder="Post Content"
              placeholderTextColor={"gray"}
              multiline
              value={postContent}
              onChangeText={setPostContent}
            />
            <Button
              title="Create Post"
              onPress={handleCreatePost}
              disabled={!postTitle || !postContent}
            />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
      <View style={styles.newPostButton}>
        {!isGuestUser && (
          <Button
            title="New Post"
            color="#FFFFFF"
            onPress={() => setIsModalVisible(true)}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEA",
    padding: 5,
  },
  messageContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 5,
    paddingBottom: 5,
  },
  paginationWrapper: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
  },
  pageNumberContainer: {
    marginBottom: 10,
  },
  pageNumberText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  pageButton: {
    borderRadius: 5,
    paddingVertical: 10,
    bottom: 10,
  },
  halfWidthButton: {
    width: "48%",
  },
  pageButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 40,
    color: "black",
  },
  newPostButton: {
    backgroundColor: "crimson",
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    bottom: 30,
  },
  deleteButtonContainer: {
    width: 70,
    marginTop: 8,
    alignItems: "center",
  },
  deleteButton: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BadgerChatroomScreen;
