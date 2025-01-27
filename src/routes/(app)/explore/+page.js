export async function load({ url, fetch }) {
	const searchQuery = url.searchParams.get('search') || '';
	const res = await fetch('/api/all-posts', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ lastVisible: null }) // Initial load
	});

	if (!res.ok) {
		return { status: res.status, error: new Error('Data not found') };
	}

	const data = await res.json();

	return {
		posts: data.items,
		selectedPost: null,
		searchQuery
	};
}
