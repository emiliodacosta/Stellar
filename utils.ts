import { Post } from './types'

const POSTS_API_URL = 'http://localhost:3000/posts'

export const fetchPosts = async () => {
  const res = await fetch(POSTS_API_URL)
  if (res.ok) {
    const resObj: Post[] = await res.json()
    return resObj
  } else {
    throw new Error(`HTTP error! Status: ${res.status}`)
  }
}

export const addPost = async (reqBody: Post) => {
  const res = await fetch(POSTS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reqBody),
  })
  if (res.ok) {
    const resObj: Post = await res.json()
    return resObj
  } else {
    throw new Error(`HTTP error! Status: ${res.status}`)
  }
}
