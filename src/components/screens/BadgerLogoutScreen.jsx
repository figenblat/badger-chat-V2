import React from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";

function BadgerLogoutScreen({ logoutHandler }) {
  const confirmLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () => {
            logoutHandler();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginTop: -100 }}>
        Are you sure you're done?
      </Text>
      <Text>Come back soon!</Text>
      <Text />
      <Button title="Logout" color="darkred" onPress={confirmLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default BadgerLogoutScreen;
