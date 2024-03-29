import { ID, Models, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from './config';

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

export async function signInAccount( user: { email: string, password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getCurrentAccount() {
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if(!currentUser) throw Error;
    return currentUser.documents[0];

  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function createPost(post: INewPost){
  try {

    const uploadedFile = await uploadFile(post.file[0]);

    if(!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);

    if(!fileUrl) { 
      deleteFile(uploadedFile.$id);
      throw Error
    };

    const tags = post.tags?.replace(/ /g,'').split(',') || [];
    
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    )

    if(!newPost) {
      deleteFile(uploadedFile.$id);
      throw Error;
    };

    return newPost;
    
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File): Promise<Models.File | null>{
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file,
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
    return null
  }
}

export async function getFilePreview(fileId: string) {
  try {
    const file = await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100
    )
    return file;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(
      appwriteConfig.storageId,
      fileId,
    )
    return { status: 'ok' };
  } catch (error) {
    console.log(error);
    return error;
  }
}
