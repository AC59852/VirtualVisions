import { json } from "@sveltejs/kit";
import { firestore, storage } from '$lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import allGames from '$lib/games/all-games.json'; // Import the JSON file

export async function POST({request}) {
    const { uid } = await request.json();

    console.log(uid)

    try {
        const userDoc = await getDoc(doc(firestore, 'users', uid));
        if (!userDoc.exists()) {
            return json({
                status: 404,
                body: { message: 'User not found' }
            });
        }

        const { following } = userDoc.data();
        if (!following || following.length === 0) return []; // If no one is followed, return an empty array

        // Fetch each followed user's data
        const followedUsersData = await Promise.all(
          following.map(async (followedUserRef) => {

              const followedUserDoc = await getDoc(followedUserRef);

              if (followedUserDoc.exists()) {
                  const followedUserData = followedUserDoc.data();
                  return {
                      uid: followedUserDoc.id,
                      displayName: followedUserData.displayName,
                      photoURL: followedUserData.photoURL,
                      postsRefs: followedUserData.posts || [], // Array of post references
                  };
              }
              return null;
          })
        );

        const validFollowedUsers = followedUsersData.filter(user => user.uid !== null);
        console.log("Fetched users:", validFollowedUsers); // Log final users array

        // Retrieve each post document for users who have posts and attach user data
        const postsData = await Promise.all(
          validFollowedUsers.flatMap(user => 
              (user.postsRefs && user.postsRefs.length > 0)
                  ? user.postsRefs.map(async (postRef) => {
                      if (!(postRef && postRef.constructor.name === 'DocumentReference')) {
                          console.error(`Invalid postRef in user ${user.uid}:`, postRef);
                          return null;
                      }
                      const postDoc = await getDoc(postRef);

                      if (postDoc.exists()) {
                        const postData = postDoc.data();

                        // process image
                        const imagePath = postDoc.data().path;
                        let imageUrl = '';

                        if (imagePath) {
                            try {
                                const imageRef = ref(storage, imagePath);
                                const url = await getDownloadURL(imageRef);
                                imageUrl = url;
                            } catch (error) {
                                console.error('Error fetching image URL:', error);
                                postDoc.data().imageUrl = '';
                            }
                        }

                        const gameId = postData.game; // Assuming `gameId` is in post data

                        const game = allGames.find(game => game.id === gameId);

                        return { 
                            id: postDoc.id, 
                            ...postDoc.data(), 
                            imageUrl,
                            game,
                            displayName: user.displayName,
                            photoURL: user.photoURL 
                        };
                      }
                      return null;
                  })
                  : []
          )
        );

        const validPosts = postsData.filter(post => post !== null);
        console.log("Fetched posts with user data:", validPosts);

        return json({ 
            posts: validPosts,
            // return the user displayName, photoURL, and uid
            user: {
                displayName: userDoc.data().displayName,
                photoURL: userDoc.data().photoURL,
                uid
            } 
        });
    }
    catch (e) {
        return json({
            status: 500,
            body: { message: e.message }
        });
    }
}