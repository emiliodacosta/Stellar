import { useSignIn } from '@clerk/clerk-expo'
import { Link, Stack, useRouter } from 'expo-router'
import {
  Text,
  TextInput,
  Button,
  View,
  StyleSheet,
  Pressable,
} from 'react-native'
import { useState, useCallback } from 'react'
import Spinner from 'react-native-loading-spinner-overlay'

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  // const [emailAddress, setEmailAddress] = useState('emidac@gmail.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle the submission of the sign-in form
  const onLoginPress = useCallback(async () => {
    if (!isLoaded) return
    setLoading(true)
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err: any) {
      alert(err.errors[0].message)
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // console.error(JSON.stringify(err, null, 2))
    } finally {
      setLoading(false)
    }
  }, [isLoaded, emailAddress, password])

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          title: 'Login',
          headerTitleAlign: 'center',
        }}
      />
      <Spinner visible={loading} />

      <TextInput
        autoCapitalize='none'
        value={emailAddress}
        placeholder='Enter email'
        // placeholder='emidac@gmail.com'
        onChangeText={setEmailAddress}
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
        <Button title='Login' onPress={onLoginPress} color={'#6c47ff'} />
      </View>

      <Pressable style={styles.button}>
        <Link push href='/reset' style={styles.link}>
          <Text>Forgot password?</Text>
        </Link>
      </Pressable>

      <Pressable style={styles.button}>
        <Link push href='/register' style={styles.link}>
          <Text>Don't have an account?{'\n'}Register</Text>
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
    padding: 4,
  },
  button: {
    margin: 8,
    alignItems: 'center',
  },
  link: {
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 5,
  },
})
