import React, { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

function BadgerLoginScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleContinueAsGuest = () => {
    props.setIsGuest(true);
    props.setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
      <TextInput
        placeholder="Username"
        style={styles.input}
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      <Button
        color="crimson"
        title="Login"
        onPress={() => props.handleLogin(username, password)}
        disabled={!username || !password}
      />
      <Button
        color="grey"
        title="Signup"
        onPress={() => props.setIsRegistering(true)}
      />
      <Button
        color="blue"
        title="Continue As Guest"
        onPress={handleContinueAsGuest}
      />
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
  input: {
    width: "80%",
    borderBottomWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
});

export default BadgerLoginScreen;
