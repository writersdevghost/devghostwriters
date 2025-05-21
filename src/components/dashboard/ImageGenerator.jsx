import { useState } from "react";
import { Image, Info } from "lucide-react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [size, setSize] = useState("512x512");
  const [style, setStyle] = useState("realistic");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  // Using environment variable instead of hardcoding the API key
  const apiKey = import.meta.env.PUBLIC_IMAGE_API_KEY;

  const model = "stabilityai/stable-diffusion-xl-base-1.0";

  const saveToHistory = (imageUrl, prompt, style, size) => {
    try {
      const id = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Create the history item
      const historyItem = {
        id,
        type: "image",
        title: prompt.length > 30 ? prompt.substring(0, 30) + "..." : prompt,
        content: `${prompt} (${style} style, ${size})`,
        timestamp: new Date().toISOString(),
        imageUrl: imageUrl,
        metadata: {
          prompt,
          style,
          size,
          model,
        },
      };

      // Get existing history
      const existingHistory = JSON.parse(
        localStorage.getItem("codeHistory") || "[]"
      );

      const updatedHistory = [historyItem, ...existingHistory];

      localStorage.setItem("codeHistory", JSON.stringify(updatedHistory));

      window.dispatchEvent(new Event("historyUpdated"));
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setImageUrl("");

    try {
      if (!apiKey) {
        throw new Error(
          "API key is not configured. Please check your environment variables."
        );
      }

      const fullPrompt = `${prompt}, ${style} style`;

      const [width, height] = size.split("x").map((num) => parseInt(num, 10));

      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: fullPrompt,
            parameters: {
              width: width,
              height: height,
              num_inference_steps: 30,
              guidance_scale: 7.5,
              negative_prompt: "low quality, blurry, distorted",
            },
          }),
        }
      );

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error(
            "Model is currently loading. Please try again in a moment."
          );
        } else {
          const errorText = await response.text();
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
      }

      const imageBlob = await response.blob();
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectUrl);

      saveToHistory(imageObjectUrl, prompt, style, size);
    } catch (error) {
      console.error("Error generating image:", error);
      setError(error.message || "Failed to generate image");

      if (import.meta.env.DEV) {
        const placeholderUrl = `/api/placeholder/${size.split("x")[0]}/${
          size.split("x")[1]
        }`;
        setImageUrl(placeholderUrl);

        saveToHistory(placeholderUrl, prompt, style, size);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#00ADB5] flex items-center">
          <Image className="mr-2 h-6 w-6" />
          Image Generator
        </h1>
        <button
          className="text-[#00ADB5] hover:text-[#00ADB5]/80"
          onClick={() => setShowPopup(true)}
        >
          <Info className="h-5 w-5" />
        </button>
      </div>

      {/* Info Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#222831] border border-[#00ADB5]/30 rounded-lg p-6 max-w-lg mx-auto shadow-lg shadow-[#00ADB5]/20">
            <h3 className="text-xl font-bold text-[#00ADB5] mb-3 flex items-center">
              <Image className="mr-2 h-5 w-5" />
              Image Generator
            </h3>
            <p className="text-[#EEEEEE] mb-4">
              Create beautiful AI-generated images with our tool. Simply
              describe what you want to see, choose your preferred style and
              size, and let our AI bring your vision to life. Perfect for
              creative projects, concept art, or visual inspiration.
            </p>
            <button
              className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/80 text-white py-2 rounded-md transition-colors"
              onClick={() => setShowPopup(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-[#17696e] mb-2" htmlFor="image-prompt">
            Image Description
          </label>
          <textarea
            id="image-prompt"
            className="w-full bg-[#393E46] text-[#EEEEEE] border border-[#00ADB5]/30 rounded-md p-3 h-32 font-mono focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50 resize-none"
            placeholder="Describe the image you want to generate..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[#17696e] mb-2">Size</label>
            <select
              className="w-full bg-[#393E46] text-[#EEEEEE] border border-[#00ADB5]/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="256x256">Small (256x256)</option>
              <option value="512x512">Medium (512x512)</option>
              <option value="768x768">Large (768x768)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#17696e] mb-2">Style</label>
            <select
              className="w-full bg-[#393E46] text-[#EEEEEE] border border-[#00ADB5]/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="realistic">Realistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="abstract">Abstract</option>
              <option value="sketch">Sketch</option>
              <option value="digital-art">Digital Art</option>
              <option value="oil-painting">Oil Painting</option>
              <option value="watercolor">Watercolor</option>
              <option value="anime">Anime</option>
              <option value="cinematic">Cinematic</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/80 disabled:bg-[#00ADB5]/50 text-white py-3 rounded-md flex items-center justify-center transition-colors"
        >
          {loading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <>
              Generate Image <Image className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-500 bg-red-100/10 p-4 rounded-md border border-red-500/30">
          <div className="font-medium mb-1">Error</div>
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-8 flex flex-col items-center justify-center p-10">
          <div className="animate-spin h-10 w-10 border-4 border-[#00ADB5] border-t-transparent rounded-full"></div>
          <p className="mt-4 text-[#EEEEEE]">Generating your image...</p>
        </div>
      ) : imageUrl ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#00ADB5] mb-4">
            Generated Image:
          </h2>
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="Generated from prompt"
              className="rounded-lg border border-[#00ADB5]/30 shadow-md max-w-full"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <a
              href={imageUrl}
              download="generated-image.png"
              className="bg-[#393E46] hover:bg-[#393E46]/80 text-[#EEEEEE] px-4 py-2 rounded-md transition-colors"
            >
              Download Image
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
