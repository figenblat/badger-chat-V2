import { Alert, Button, StyleSheet, Text, View } from "react-native";

function BadgerLoginScreen(props) {
    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text>Hmmm... I should add inputs here!</Text>
        <Button color="crimson" title="Login" onPress={() => {
            Alert.alert("Hmmm...", "I should check the user's credentials first!");
            props.handleLogin("myusername", "mypassword")
        }} />
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerLoginScreen;