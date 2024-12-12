import {
  Text,
  View,
  Pressable,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { Redirect, Stack } from 'expo-router'
import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-expo'
import { FlashList } from '@shopify/flash-list'
import { Post } from '@/types'
import { fetchPosts, addPost } from '@/utils'

interface RenderItemProps {
  item: Post
}

export default function Page() {
  const { user } = useUser()
  const { signOut } = useAuth()

  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const getAllPosts = async () => {
      const allPostsFound = await fetchPosts()
      if (allPostsFound) {
        console.log('allPostsFound: ', allPostsFound)
        setPosts(allPostsFound)
      }
    }
    getAllPosts()
  }, [])

  const renderItem = useCallback(
    ({ item }: RenderItemProps) => (
      <View key={item.id} style={styles.postContainer}>
        <Text>
          {item.username}
          {'\n'}
          {'\n'}
          {item.content}
          {'\n'}
          {'\n'}
          {new Date(Date.parse(item.created_at)).toString()}
        </Text>
      </View>
    ),
    [posts]
  )

  const [inputText, setInputText] = useState<string>('')

  const handleSubmitPost = async () => {
    console.log('posts: ', posts)
    const newPostId = posts.length
    const newPost: Post = {
      id: newPostId,
      username: user!.username!,
      content: inputText,
      created_at: new Date(Date.now()).toISOString(),
    }
    console.log('newPost: ', newPost)
    console.log('posts: ', posts)
    const postAdded = await addPost(newPost)
    setInputText('')
    if (postAdded) {
      setPosts([...posts, postAdded])
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Message Board',
          headerTitleAlign: 'center',
        }}
      />
      <SignedIn>
        <Pressable onPress={() => signOut()} style={styles.button}>
          <Text>Logout</Text>
        </Pressable>

        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>Hello {user?.username} 🎉</Text>
        </View>

        <View style={styles.newPostContainer}>
          <TextInput
            value={inputText}
            placeholder='Enter new post content'
            multiline
            numberOfLines={4}
            onChangeText={setInputText}
            style={styles.inputField}
          ></TextInput>
          <Button
            onPress={handleSubmitPost}
            title='Submit New Post'
            disabled={!inputText.trim() || !user}
          />
        </View>
        <ScrollView style={styles.scroll}>
          <View style={styles.postListContainer}>
            <FlashList
              data={posts}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => (
                <View style={styles.itemSeparator} />
              )}
              removeClippedSubviews={true}
              estimatedItemSize={250}
            />
          </View>
        </ScrollView>
      </SignedIn>
      <SignedOut>
        <Redirect href='/login' />
      </SignedOut>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: 'rgb(244, 246, 249)',
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  newPostContainer: {
    marginBottom: 8,
  },
  inputField: {
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#6c47ff',
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    alignItems: 'flex-end',
    width: 'auto',
  },
  scroll: {
    marginRight: -16,
  },
  postListContainer: {
    flexBasis: '100%',
    borderTopWidth: 2,
    borderColor: 'rgb(244, 246, 249)',
    backgroundColor: 'rgb(244, 246, 249)',
    marginRight: 16,
  },
  itemSeparator: {
    height: 10,
    backgroundColor: 'rgb(244, 246, 249)',
  },
  postContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
})
