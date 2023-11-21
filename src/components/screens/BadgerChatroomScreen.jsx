import { StyleSheet, Text, View } from "react-native";

function BadgerChatroomScreen(props) {
    return <View style={{ flex: 1 }}>
        <Text style={{margin: 100}}>This is a chatroom screen!</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerChatroomScreen;