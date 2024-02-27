import { INewPost, INewUser } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost, createUserAccount, signInAccount, signOutAccount } from "../appwrite/api"


export const useCreateUserAccountMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  })
}

export const useSignAccountMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string, password: string }) => signInAccount(user),
  })
}

export const useSignOurAccountMutation = () => {
  return useMutation({
    mutationFn: signOutAccount,
  })
}


export const useCreatePostMutation = () => {

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        // queryKey: 'getRecentPosts'
      })
    },
  })
}