import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/components/utils/supabase';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Please enter your email first");
            return;
        }

        setLoading(true);
        
        //not working as of rn
        
        // //check if this email exists
        // console.log(`Email: ${email}`);
        // const { data: user, error: userError } = await supabase
        //     .from('auth.users')
        //     .select('id')
        //     .eq('email', email)
        //     .single();

        // if (userError || !user) {
        //     setLoading(false);
        //     Alert.alert("Error", "This email is not registered");
        //     return;
        // }

        const { error } = await supabase.auth.resetPasswordForEmail(email);
        setLoading(false);

        if (error) {
            Alert.alert("Email is not valid");
        } else {
            Alert.alert(`Password reset link sent to: ${email}`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.herdUpTitle}>Herd Up</Text>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.description}>
                Enter your email address to receive a password reset link.
            </Text>

            <TextInput
                style = {styles.input}
                placeholder = "Enter your email"
                placeholderTextColor = "#888"
                value = {email}
                onChangeText = {setEmail}
                keyboardType = "email-address"
                autoCapitalize= "none"
            />

            <TouchableOpacity style = {styles.resetButton} onPress = {handleResetPassword} disabled={loading}>
                <Text style={styles.resetButtonText}>
                    {loading ? "Sending ..." : "Send Reset Link"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()} style = {styles.backButton}>
                <Text style = {styles.backButtonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        width: '100%',
        marginTop: 40,
    },
    herdUpTitle: {
        fontSize: 30,
        fontWeight: 800,
        color: 'black',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 600,
        color: 'black',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '90%',
        borderBottomWidth: 1.5,
        borderBottomColor: 'black',
        fontSize: 16,
        paddingVertical: 5,
        marginBottom: 20,
        color: 'black',
    },
    resetButton: {
        backgroundColor: 'black',
        paddingVertical: 15,
        width: '90%',
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 15,
    },
    resetButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 10,
    },
    backButtonText: {
        color: 'gray',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});