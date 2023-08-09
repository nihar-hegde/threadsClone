"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import {Error} from 'mongoose';
import Thread from "../models/thread.model";

interface Params{
    userId:string,
    username:string,
    name:string,
    bio:string,
    image:string,
    path:string,

}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path
}:Params): Promise<void> {
  connectToDB();

 try {
    
    await User.findOneAndUpdate(
        { id: userId },
        { username: username.toLowerCase(), name, bio, image, onboarded: true },
        { upsert: true } // update and insert Useed to update if a specific value exist else create a new row
      );
    
      if (path === "/profile/edit") {
        revalidatePath(path); //revalidatePath allows you to revalidate data associated with a specific path. This is useful for scenarios where you want to update your cached data without waiting for a revalidation period to expire.
      }
 } catch (error:any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
 }
}

export async function fetchUser(userId:string) {
  try {
    connectToDB()
    return await User.findOne({id:userId})
    // .populate({
    //   path:'communities',
    //   model:Community
    // })
  } catch (error:any) {
    throw new Error(`Failed to fetch user: ${error.message}`)
  }
  
}

export async function fetchUserPosts(userId:string) {
  try {
    connectToDB();
    //TODO: find all the threads authored by the user with the givern userid

    //TODO: populate the community too.
    const threads = await User.findOne({id:userId})
    .populate({
      path:'threads',
      model:Thread,
      populate:{
        path:'children',
        model:Thread,
        populate:{
          path:'author',
          model:User,
          select:'name image id'
        }
      }
    })
    return threads;
  } catch (error:any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
  
}