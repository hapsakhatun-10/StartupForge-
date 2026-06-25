import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token")
      if (authToken) {
        localStorage.setItem("bearer_token", authToken)
      }
    },
  },
})

export const { signIn, signUp, signOut, useSession, updateUser } = authClient
