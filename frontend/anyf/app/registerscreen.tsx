import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const RegisterScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/register/', {
                email,
                password,
                confirmPassword
            });
            console.log('Registration response:', response.data);
            setMessage(response.data.message);
            Alert.alert('Success', 'Registration successful. Please log in.');
            router.replace('/loginscreen');
        } catch (error: any) {
            console.error('Registration error:', error.response?.data || error.message);
            setMessage('Error: ' + (error.response?.data.errors || error.message));
            Alert.alert('Registration Failed', message);
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
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <Button title="Register" onPress={handleRegister} />
            {message ? <Text>{message}</Text> : null}
            <Link href="/loginscreen" style={styles.loginText}>
                Already have an account? Login here
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
    loginText: {
        marginTop: 20,
        color: 'blue',
        textAlign: 'center'
    }
});

export default RegisterScreen;