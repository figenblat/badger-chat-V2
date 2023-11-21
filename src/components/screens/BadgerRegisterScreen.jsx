import { Alert, Button, StyleSheet, Text, View } from "react-native";

function BadgerRegisterScreen(props) {
    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text>Hmmm... I should add inputs here!</Text>
        <Button color="crimson" title="Signup" onPress={() => Alert.alert("Hmmm...", "This should do something!")} />
        <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;