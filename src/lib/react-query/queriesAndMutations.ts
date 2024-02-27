import { INewUser } from "@/types"
import { useMutation } from "@tanstack/react-query"
import { createUserAccount, signInAccount, signOutAccount } from "../appwrite/api"


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