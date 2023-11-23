import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

function BadgerRegisterScreen(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const handleSignup = () => {
    if (password !== repeatPassword) {
      Alert.alert("Passwords don't match");
    } else {
      props.handleSignup(username, password);
    }
  };
  const handleCancel = () => {
    props.setIsRegistering(false);
    props.setIsGuest(false);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
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
      <TextInput
        placeholder="Repeat Password"
        style={styles.input}
        onChangeText={(text) => setRepeatPassword(text)}
        value={repeatPassword}
        secureTextEntry={true}
      />
      <Button
        color="crimson"
        title="Signup"
        onPress={handleSignup}
        disabled={!username || !password || !repeatPassword}
      />
      <Button color="grey" title="Nevermind!" onPress={handleCancel} />
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

export default BadgerRegisterScreen;
