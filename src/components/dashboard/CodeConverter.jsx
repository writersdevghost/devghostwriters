import { useState } from "react";
import { Loader2, ArrowRight, RefreshCw, Info } from "lucide-react";

export default function CodeConverter() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("python");
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [inputCode, setInputCode] = useState("");

  const handleSubmit = async (code) => {
    if (!targetLanguage.trim()) {
      alert("Please specify a target language");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput("");

    try {
      const apiPrompt = `Convert this code to ${targetLanguage}. Return only the converted code without explanations or markdown formatting:\n\n${code}`;

      // Using Groq API
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
              {
                role: "system",
                content: `You are a code conversion expert. Convert code to ${targetLanguage} precisely and accurately.`,
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
      const convertedCode = data.choices[0].message.content.trim();

      setOutput(convertedCode);

      saveToHistory(code, convertedCode, targetLanguage);
    } catch (error) {
      console.error("API Error:", error);
      setError("Error processing request: " + error.message);

      setOutput(`// Failed to convert to ${targetLanguage}
// API connection error occurred
// Please check your API key and network connection and try again`);
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (originalCode, convertedCode, targetLanguage) => {
    try {
      const existingHistory = JSON.parse(
        localStorage.getItem("codeHistory") || "[]"
      );

      // Create a new history item
      const newHistoryItem = {
        id: Date.now().toString(), // Unique ID using timestamp
        type: "convert",
        title: `Code conversion to ${targetLanguage}`,
        originalCode: originalCode,
        content: convertedCode,
        timestamp: new Date().toISOString(),
        targetLanguage: targetLanguage,
      };

      const updatedHistory = [newHistoryItem, ...existingHistory];

      localStorage.setItem("codeHistory", JSON.stringify(updatedHistory));

      window.dispatchEvent(new Event("historyUpdated"));
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#00ADB5] flex items-center">
          <RefreshCw className="mr-2 h-6 w-6" />
          Code Converter
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
              <RefreshCw className="mr-2 h-5 w-5" />
              Code Converter
            </h3>
            <p className="text-[#EEEEEE] mb-4">
              Convert code to any programming language with our AI-powered code
              converter. Simply paste your source code, specify the target
              language, and get ready-to-use converted code in seconds.
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

      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1">
            <label
              className="block text-[#17696e]
 mb-2"
            >
              Target Language
            </label>
            <input
              type="text"
              className="w-full bg-[#393E46] text-[#EEEEEE] border border-[#00ADB5]/30 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              placeholder="Enter target language (e.g. Python, JavaScript, Java)"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-[#17696e] mb-2">Input Code</label>
        <textarea
          className="w-full bg-[#393E46] text-[#EEEEEE] border border-[#00ADB5]/30 rounded-md p-3 h-64 font-mono focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50"
          placeholder="Paste your code here..."
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          id="code-input"
        ></textarea>
      </div>

      <button
        onClick={() => {
          if (inputCode.trim()) {
            handleSubmit(inputCode);
          }
        }}
        disabled={loading || !inputCode.trim()}
        className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/80 disabled:bg-[#00ADB5]/50 text-white py-3 rounded-md flex items-center justify-center transition-colors"
      >
        {loading ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
        ) : (
          <>
            Convert to {targetLanguage} <RefreshCw className="ml-2 h-4 w-4" />
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 text-red-500 bg-red-100/10 p-4 rounded-md border border-red-500/30">
          <div className="font-medium mb-1">Error</div>
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center p-10">
          <div className="animate-spin h-10 w-10 border-4 border-[#00ADB5] border-t-transparent rounded-full"></div>
          <p className="mt-4 text-[#EEEEEE]">Converting your code...</p>
        </div>
      )}

      {output && !loading && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#00ADB5] mb-4">
            Converted Code ({targetLanguage})
          </h2>
          <div className="bg-[#2D333B] border border-[#00ADB5]/30 rounded-md p-4 text-[#EEEEEE] whitespace-pre-wrap font-mono overflow-x-auto">
            {output}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(output);
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
