import { json } from "@sveltejs/kit";
import { firestore, storage } from '$lib/firebase';
import { ref, getDownloadURL } from 'firebase/storage';
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc } from 'firebase/firestore';
import allGames from '$lib/games/all-games.json';

export async function POST({ request }) {
  const { uid } = await request.json();

  try {
    // Fetch the user's following list
    const userDoc = await getDoc(doc(firestore, 'users', uid));
    if (!userDoc.exists()) {
      return json({
        status: 404,
        body: { message: 'User not found' }
      });
    }

    const { following } = userDoc.data();
    if (!following || following.length === 0) return json({ posts: [] });

    // Build a query to fetch the most recent 15 posts
    const postsQuery = query(
      collection(firestore, 'posts'),
      where('account', 'in', following.map(ref => ref.id)), // Match posts by followed user IDs
      orderBy('createdAt', 'desc'), // Order by newest first
      limit(15) // Limit to 15 results
    );

    const postsSnapshot = await getDocs(postsQuery);

    async function fetchUserData(userId) {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      return userDoc.exists() ? userDoc.data() : null;
    }

    // Process the fetched posts
    const postsData = await Promise.all(
      postsSnapshot.docs.map(async (postDoc) => {
        const postData = postDoc.data();
        const { title, description, createdAt, likeCount, path, account, game: gameId } = postData;

        // Safely handle the createdAt field
        const createdAtDate = createdAt instanceof Date
          ? createdAt
          : createdAt?.toDate?.() || null;

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
        const game = allGames.find(game => game.id === gameId);

        const userData = await fetchUserData(account);

        return {
          id: postDoc.id,
          title,
          description,
          createdAt: createdAtDate,
          likeCount,
          path,
          account,
          imageUrl,
          game,
          photoURL: userData?.photoURL,
          displayName: userData?.displayName
        };
      })
    );

    return json({
        posts: postsData
    });
  } catch (e) {
      console.error('Error loading posts:', e);
      return json({
          status: 500,
          body: { message: e.message }
      });
  }
}
