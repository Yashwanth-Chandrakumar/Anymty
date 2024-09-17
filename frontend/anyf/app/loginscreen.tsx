import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const storeUserInfo = async (userInfo: { token: string, username: string ,refresh:string}) => {
        try {
            const userJson = JSON.stringify(userInfo);
            await AsyncStorage.setItem('userInfo', userJson);
        } catch (error) {
            console.log('Error storing user info:', error);
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://anymty.onrender.com/login/', {
                email,
                password
            });
    
            console.log('Response:', response);
    
            // Check if token and username are present
            if (response.data.refresh && response.data.username) {
                await storeUserInfo({ token: response.data.access, username: response.data.username, refresh:response.data.refresh });
                console.log("routing to home")
                router.replace("/(tabs)/home");
            } else {
                console.log('Token or username missing in response');
            }
            
            setMessage(response.data.message);
        } catch (error: any) {
            console.error('Login Error:', error);
            setMessage('Error: ' + (error.response?.data.message || error.message));
        }
    };
    

    return (
        <View style={styles.container}>
            <TextInput
            style={styles.input}
                
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
            {message ? <Text>{message}</Text> : null}
            <Link href="/registerscreen" style={styles.registerText}>
                Don't have an account? Register here
            </Link>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 10
    },
    registerText: {
        marginTop: 20,
        color: 'blue',
        textAlign: 'center'
    }
});

export default LoginScreen;