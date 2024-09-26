import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Getimage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch images from backend on component mount
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-data');
        console.log(response.data.data[0].data.data) // Adjust the URL as needed
        const imagesWithUrls = response.data.data.map((image) => {
            const byteArray = new Uint8Array(image.data.data); // Create a Uint8Array from the buffer data
            const blob = new Blob([byteArray], { type: image.contentType }); // Create a Blob
            return {
              ...image,
              imageUrl: URL.createObjectURL(blob) // Create a URL for the Blob
            };
          });
        console.log( "Image" + JSON.stringify(imagesWithUrls))
        setImages(imagesWithUrls);
      } catch (err) {
        setError(err);
        console.error('Error fetching images:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return <p>Loading images...</p>;
  }

  if (error) {
    return <p>Error loading images: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Image</th>
            <th className="border border-gray-300 p-2">Content Type</th>
          </tr>
        </thead>
        <tbody>
          {images.map((image) => (
            <tr key={image._id}>
              <td className="border border-gray-300 p-2">
                <img src={image.imageUrl} alt="Uploaded" className="max-w-xs" />
              </td>
              <td className="border border-gray-300 p-2">{image.contentType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Getimage;
