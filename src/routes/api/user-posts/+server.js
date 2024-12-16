import { json } from "@sveltejs/kit";
import { firestore, storage } from '$lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { doc, getDoc } from 'firebase/firestore';
import allGames from '$lib/games/all-games.json'; // Import the JSON file

export async function POST({ request }) {
    const { uid } = await request.json();

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

                            // Extract specific fields
                            const { title, description, createdAt, likeCount, path, account } = postData;

                            // Process image
                            let imageUrl = '';
                            if (path) {
                                try {
                                    const imageRef = ref(storage, path);
                                    imageUrl = await getDownloadURL(imageRef);
                                } catch (error) {
                                    console.error('Error fetching image URL:', error);
                                }
                            }

                            // Get game data
                            const gameId = postData.game; // Assuming `gameId` is in post data
                            const game = allGames.find(game => game.id === gameId);
                            return {
                                id: postDoc.id,
                                title,
                                description,
                                createdAt,
                                likeCount,
                                path,
                                account,
                                imageUrl,
                                game,
                                displayName: user.displayName,
                                photoURL: user.photoURL,
                            };
                        }
                        return null;
                    })
                    : []
            )
        );

        const validPosts = postsData
              .filter(post => post !== null)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            return json({
              posts: validPosts
            });
    }
    catch (e) {
        return json({
            status: 500,
            body: { message: e.message }
        });
    }
}