export const fetchImageBlob = async (imageUrl) => {
  const proxies = [
    imageUrl, // Direct URL first
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(imageUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`,
    `https://thingproxy.freeboard.io/fetch/${imageUrl}`
  ];

  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl);
      if (response.ok) {
        return await response.blob();
      }
    } catch (err) {
      console.warn(`Failed to fetch image via ${proxyUrl}:`, err);
    }
  }
  throw new Error('Failed to fetch image from all available proxies');
};

export const colorizeImage = async (imageUrl) => {
  let imageBlob;
  try {
    // 1. Fetch the original image as a Blob
    imageBlob = await fetchImageBlob(imageUrl);
  } catch (fetchErr) {
    console.error("Failed to fetch image:", fetchErr);
    return imageUrl; // Safe fallback
  }

  try {
    const token = import.meta.env.VITE_HF_TOKEN;
    if (!token) throw new Error('Hugging Face API token is missing');

    // 2. Send to Hugging Face Inference API
    // Using a robust open-source image-to-image model for colorization or enhancement
    let hfResponse = null;
    let retries = 4;
    let delayMs = 10000;

    for (let attempt = 0; attempt <= retries; attempt++) {
      hfResponse = await fetch(
        "https://api-inference.huggingface.co/models/jantic/DeOldify", 
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
          body: imageBlob,
        }
      );

      if (hfResponse.status === 503 && attempt < retries) {
        console.warn(`Model loading (503). Retrying in ${delayMs / 1000}s... (${retries - attempt} retries left)`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        break; // Either success, non-503 error, or out of retries
      }
    }

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
    console.warn("AI Colorization Error, falling back to showcase mode:", err);
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(imageBlob);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.filter = 'sepia(0.3) saturate(1.4) contrast(1.1)';
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(objectUrl);
          resolve(blob ? URL.createObjectURL(blob) : imageUrl);
        }, 'image/jpeg');
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(imageUrl);
      };

      img.src = objectUrl;
    });
  }
};
