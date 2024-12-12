import { View, StyleSheet, TextInput, Button } from 'react-native'
import { useState } from 'react'
import { Stack } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'

export default function PwReset() {
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [successfulCreation, setSuccessfulCreation] = useState(false)
  const { signIn, setActive } = useSignIn()

  // Request a password reset code by email
  const onRequestReset = async () => {
    try {
      await signIn!.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      })
      setSuccessfulCreation(true)
    } catch (err: any) {
      alert(err.errors[0].message)
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // console.error(JSON.stringify(err, null, 2))
    }
  }

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      })
      console.log(result)
      alert('Password reset successfully')

      // Set the user session active, which will log in the user automatically
      await setActive!({ session: result.createdSessionId })
    } catch (err: any) {
      alert(err.errors[0].message)
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerBackVisible: !successfulCreation,
          title: 'Reset password',
          headerTitleAlign: 'center',
        }}
      />

      {!successfulCreation && (
        <>
          <TextInput
            autoCapitalize='none'
            value={emailAddress}
            placeholder="Enter email"
            // placeholder='emidac@gmail.com'
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
          <View style={styles.buttonLayout}>
            <Button
              title='Send Reset Email'
              onPress={onRequestReset}
              color={'#6c47ff'}
            />
          </View>
        </>
      )}

      {successfulCreation && (
        <>
          <View>
            <TextInput
              value={code}
              placeholder='Code...'
              onChangeText={setCode}
              style={styles.inputField}
            />
            <TextInput
              value={password}
              placeholder='New password'
              onChangeText={setPassword}
              secureTextEntry
              style={styles.inputField}
            />
          </View>
          <View style={styles.buttonLayout}>
            <Button
              title='Set new Password'
              onPress={onReset}
              color={'#6c47ff'}
            />
          </View>
        </>
      )}
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
})
