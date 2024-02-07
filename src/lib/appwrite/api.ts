import { ID } from "appwrite";
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from './config';

export async function createUserAccount( user: INewUser ) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    )

    if(!newAccount) throw Error;
    const avatarURL = await avatars.getInitials(user.name);

    const newUser = await saveUserToDb({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarURL,
      username: user.username,
    })

    return newUser;
    
  } catch (error) {
    console.log(error);
    return error;
  }
}


export async function saveUserToDb( user: {
  accountId: string,
  email: string,
  name: string,
  imageUrl: URL,
  username?: string,
}) {
  try {

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user,
    )
    return newUser;

  } catch (error) {
    console.log(error);
    return error;
  }
}