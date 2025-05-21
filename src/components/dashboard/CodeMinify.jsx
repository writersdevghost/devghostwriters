import { useState } from "react";
import { Minimize2, ArrowRight, Info } from "lucide-react";

export default function CodeMinify() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [compressionRatio, setCompressionRatio] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Call to Groq API
      const apiPrompt = `Minify the following code without changing its functionality. Only return the minified code with no explanations or markdown:

${code}`;

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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", // Replace with your actual API key in production
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
              {
                role: "system",
                content:
                  "You are a code minification assistant. Return only the minified code with no explanations.",
              },
              { role: "user", content: apiPrompt },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const minifiedCode = data.choices[0].message.content.trim();
      setResult(minifiedCode);

      // Calculate compression ratio
      const originalSize = new Blob([code]).size;
      const minifiedSize = new Blob([minifiedCode]).size;
      const ratio = (
        ((originalSize - minifiedSize) / originalSize) *
        100
      ).toFixed(2);
      setCompressionRatio(ratio);

      const historyItem = {
        id: Date.now().toString(),
        type: "minify",
        title: `Code Minification (${ratio}% smaller)`,
        timestamp: new Date().toISOString(),
        originalCode: code,
        content: minifiedCode,
        compressionRatio: ratio,
      };

      try {
        const existingHistory = JSON.parse(
          localStorage.getItem("codeHistory") || "[]"
        );
        const updatedHistory = [historyItem, ...existingHistory];
        localStorage.setItem("codeHistory", JSON.stringify(updatedHistory));

        window.dispatchEvent(new Event("historyUpdated"));
      } catch (err) {
        console.error("Error saving to history:", err);
      }
    } catch (error) {
      console.error("Error minifying code:", error);
      setError("Error processing request: " + error.message);

      setResult(`// Error minifying code. 
// In a real application, this would be minified code.
// API Error: ${error.message}`);
      setCompressionRatio(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#00ADB5] flex items-center">
          <Minimize2 className="mr-2 h-6 w-6" />
          Code Minify
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
              <Minimize2 className="mr-2 h-5 w-5" />
              Code Minify
            </h3>
            <p className="text-[#EEEEEE] mb-4">
              Clean and compact code is essential, but doing it manually takes
              time. Our AI Code Minify tool intelligently analyzes your code and
              eliminates unnecessary characters, whitespace, and redundancies.
              This not only reduces file size and improves performance but also
              ensures your code stays efficient and production-ready. Spend less
              time optimizing and more time deploying.
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

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-[#17696e] mb-2" htmlFor="code">
            Paste your code here
          </label>
          <textarea
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-[#393E46] text-[#EEEEEE] border border-[#00ADB5]/30 rounded-md p-3 h-64 font-mono focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50"
            placeholder="// Paste your code here to minify it"
          ></textarea>
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
              Minify Code <Minimize2 className="ml-2 h-4 w-4" />
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

      {result && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#00ADB5] mb-4 flex items-center justify-between">
            <span>Minified Code</span>
            {compressionRatio && (
              <span className="text-sm bg-[#00ADB5]/20 text-[#00ADB5] px-3 py-1 rounded-full">
                {compressionRatio}% smaller
              </span>
            )}
          </h2>
          <div className="bg-[#2D333B] border border-[#00ADB5]/30 rounded-md p-4 text-[#EEEEEE] whitespace-pre-wrap font-mono overflow-x-auto">
            {result}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(result);
              }}
              className="bg-[#393E46] hover:bg-[#393E46]/80 text-[#EEEEEE] px-4 py-2 rounded-md transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
