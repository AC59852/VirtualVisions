export async function load({ url, params, fetch }) {

	const res = await fetch('/api/user-followers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ uid: params.userID })
  });

	if (!res.ok) {
		return { status: res.status, error: new Error('Data not found') };
	}

	const data = await res.json();
	return {
    followers: data.followers
	};
}