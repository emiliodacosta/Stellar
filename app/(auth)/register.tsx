import { useState } from 'react'
import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  Pressable,
} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, Stack, useRouter } from 'expo-router'
import Spinner from 'react-native-loading-spinner-overlay'

export default function RegisterScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle submission of sign-up form
  const onRegisterPress = async () => {
    if (!isLoaded) return
    setLoading(true)
    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        username,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err: any) {
      alert(err.errors[0].message)
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // console.error(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return
    setLoading(true)

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err: any) {
      alert(err.errors[0].message)
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // console.error(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Verify your email',
          }}
        />
        <Spinner visible={loading} />

        <TextInput
          value={code}
          placeholder='Enter your verification code'
          onChangeText={setCode}
          style={styles.inputField}
        />
        <Button title='Verify' onPress={onVerifyPress} color={'#6c47ff'} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: 'Register',
          headerTitleAlign: 'center',
        }}
      />
      <Spinner visible={loading} />

      <TextInput
        value={emailAddress}
        autoCapitalize='none'
        placeholder='Enter email'
        onChangeText={setEmailAddress}
        style={styles.inputField}
      />
      <TextInput
        value={username}
        autoCapitalize='none'
        placeholder='Enter username'
        onChangeText={setUsername}
        style={styles.inputField}
      />
      <TextInput
        value={password}
        placeholder='Enter password'
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.inputField}
      />
      <View style={styles.buttonLayout}>
        <Button title='Register' onPress={onRegisterPress} color={'#6c47ff'} />
      </View>

      <Pressable style={styles.button}>
        <Link push href='/login' style={styles.link}>
          <Text>Have an account?{'\n'}Login</Text>
        </Link>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  buttonLayout: {
    alignItems: 'center',
  },
  button: {
    margin: 8,
    alignItems: 'center',
  },
  link: {
    textAlign: 'center',
  },
})
