<script>
  import { firestore, storage } from '$lib/firebase';
  import { collection, getDocs } from 'firebase/firestore';
  import { ref, getDownloadURL } from 'firebase/storage';

  let data = [];

  async function fetchData() {
    try {
      // Fetch documents from Firestore
      const querySnapshot = await getDocs(collection(firestore, 'posts'));
      const items = [];

      // Iterate over each document
      for (const doc of querySnapshot.docs) {
        const item = doc.data();
        const imagePath = item.path; // Assuming your image path field is 'imagePath'

        // Fetch the download URL if the imagePath exists
        if (imagePath) {
          try {
            const imageRef = ref(storage, imagePath);
            const url = await getDownloadURL(imageRef);
            item.imageUrl = url; // Add the image URL to the item
          } catch (error) {
            console.error('Error fetching image URL:', error);
            item.imageUrl = ''; // Set to empty if there's an error
          }
        }

        items.push(item);
      }

      // Update the data array
      data = items;
      console.log(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  fetchData();
</script>

<h1>Page</h1>

{#each data as item}
  <div>
    <h2>{item.title}</h2>
    {#if item.imageUrl}
      <img src={item.imageUrl} alt={item.title} style="width: 800px; height: 587px; object-fit: cover; object-position: center;" />
    {/if}
  </div>
{/each}