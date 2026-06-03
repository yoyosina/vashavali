export const colorizeImage = async (imageUrl) => {
  const token = import.meta.env.VITE_HF_TOKEN;
  if (!token) throw new Error('Hugging Face API token is missing');

  try {
    // 1. Fetch the original image as a Blob
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error('Failed to fetch original image');
    const imageBlob = await imageResponse.blob();

    // 2. Send to Hugging Face Inference API
    // Using a robust open-source image-to-image model for colorization or enhancement
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/jantic/DeOldify", 
      {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: imageBlob,
      }
    );

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      // If the model is loading, HF returns 503 with estimated_time.
      if (hfResponse.status === 503) {
        throw new Error('Model is currently loading. Please wait 30 seconds and try again.');
      }
      throw new Error(`API Error: ${errorText}`);
    }

    const resultBlob = await hfResponse.blob();
    // Convert blob to a local URL for previewing
    return URL.createObjectURL(resultBlob);

  } catch (err) {
    console.error("AI Colorization Error:", err);
    throw err;
  }
};
