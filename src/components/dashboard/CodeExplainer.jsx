import { useState } from "react";
import { FileSearch, Info } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

export default function CodeExplainer() {
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState("intermediate");
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [codeInput, setCodeInput] = useState("");

  const saveToHistory = (code, explanation) => {
    try {
      const historyData = JSON.parse(
        localStorage.getItem("codeHistory") || "[]"
      );

      const newHistoryItem = {
        id: uuidv4(),
        type: "explain",
        title: `Code Explanation (${level})`,
        timestamp: new Date().toISOString(),
        content: explanation,
        originalCode: code,
      };

      historyData.unshift(newHistoryItem);

      localStorage.setItem("codeHistory", JSON.stringify(historyData));

      window.dispatchEvent(new Event("historyUpdated"));
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  const handleSubmit = async (code) => {
    setLoading(true);
    setError(null);
    setExplanation("");

    try {
      const apiPrompt = `Explain this code in detail, with a ${level}-level explanation:\n\n${code}`;

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
                content: `You are a helpful code assistant. Provide ${level}-level explanations of code.`,
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
      const resultContent = data.choices[0].message.content.trim();

      let formattedExplanation = "";

      if (!resultContent.startsWith("#")) {
        formattedExplanation = `# ${
          level.charAt(0).toUpperCase() + level.slice(1)
        }-Level Explanation\n\n`;
      }

      formattedExplanation += resultContent;
      setExplanation(formattedExplanation);

      saveToHistory(code, formattedExplanation);
    } catch (err) {
      console.error("API Error:", err);
      setError("Error processing request: " + err.message);

      const fallbackExplanation = `# ${
        level.charAt(0).toUpperCase() + level.slice(1)
      }-Level Explanation (Fallback Mode)

Due to a connection issue, I couldn't analyze your code in detail.

In a real application, this would provide a detailed explanation of your code based on your selected level (${level}).

The explanation would include:
- Code structure and flow
- Key functions and their purposes
- Logic patterns and algorithms used
- Potential optimizations or issues

Please check your connection and try again later.`;

      setExplanation(fallbackExplanation);

      saveToHistory(code, fallbackExplanation);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#00ADB5] flex items-center">
          <FileSearch className="mr-2 h-6 w-6" />
          Code Explanation
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
              <FileSearch className="mr-2 h-5 w-5" />
              Code Explanation
            </h3>
            <p className="text-[#EEEEEE] mb-4">
              Need help understanding code? Our AI assistant breaks down complex
              code into clear, digestible explanations. Choose your expertise
              level - beginner, intermediate, or advanced - and get customized
              explanations that match your understanding.
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

      <div className="mb-4">
        <label className="block text-[#17696e] mb-2">Explanation Level</label>
        <div className="flex flex-wrap gap-3">
          {["beginner", "intermediate", "advanced"].map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="level"
                value={option}
                checked={level === option}
                onChange={() => setLevel(option)}
                className="mr-2 accent-[#00ADB5]"
              />
              <span className="capitalize text-[#17696e]">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const codeElement = document.getElementById("code-explain-input");
          if (codeElement && codeElement.value.trim()) {
            setCodeInput(codeElement.value);
            handleSubmit(codeElement.value);
          }
        }}
      >
        <div className="mb-4">
          <label
            className="block text-[#17696e] mb-2"
            htmlFor="code-explain-input"
          >
            Paste the code you want explained
          </label>
          <textarea
            id="code-explain-input"
            className="w-full bg-[#393E46] text-[#EEEEEE] border border-[#00ADB5]/30 rounded-md p-3 h-32 font-mono focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50"
            placeholder="Paste the code you want explained..."
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
              Explain Code <FileSearch className="ml-2 h-4 w-4" />
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
          <p className="mt-4 text-[#EEEEEE]">Analyzing your code...</p>
        </div>
      ) : explanation ? (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#00ADB5] mb-4">
            Explanation:
          </h2>
          <div className="bg-[#2D333B] border border-[#00ADB5]/30 rounded-md p-4 text-[#EEEEEE] whitespace-pre-wrap overflow-x-auto">
            {explanation.split("\n").map((line, i) => (
              <div key={i}>
                {line.startsWith("#") ? (
                  <h4 className="font-bold mt-0 text-[#00ADB5]">
                    {line.replace(/^#+\s+/, "")}
                  </h4>
                ) : line === "" ? (
                  <br />
                ) : (
                  <p className="my-2">{line}</p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(explanation);
              }}
              className="bg-[#393E46] hover:bg-[#393E46]/80 text-[#EEEEEE] px-4 py-2 rounded-md transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
