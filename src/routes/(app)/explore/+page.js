export async function load({ url, params, fetch }) {
	const searchQuery = url.searchParams.get('search') || ''; // Get the 'search' query parameter
	const postID = params.postID || null;

	const res = await fetch('/api/all-posts');

	if (!res.ok) {
		return { status: res.status, error: new Error('Data not found') };
	}

	const data = await res.json();

	let selectedPost = null;

	if (postID) {
		selectedPost = data.posts.find(post => post.id === postID) || null;
	}

	return {
		posts: data,
		selectedPost,
		searchQuery // Include the search query in the returned data
	};
}