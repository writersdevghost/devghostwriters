import { useState } from "react";
import { Sparkles, ArrowRight, Info } from "lucide-react";

export default function RefactoringHints() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // API call
      const apiPrompt = `Analyze and suggest refactoring improvements for the following code. Focus on:
- Code structure and organization
- Performance optimizations
- Best practices
- Readability enhancements
- Potential bugs or edge cases

Here's the code:

${code}`;

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
                content:
                  "You are a code refactoring assistant. Provide detailed, actionable suggestions to improve the code quality, performance, and maintainability.",
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
      const refactoringHints = data.choices[0].message.content.trim();
      setResult(refactoringHints);

      const historyItem = {
        id: Date.now().toString(),
        type: "refactor",
        title: "Code Refactoring Hints",
        timestamp: new Date().toISOString(),
        originalCode: code,
        content: refactoringHints,
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
      console.error("Error getting refactoring hints:", error);
      setError("Error processing request: " + error.message);

      setResult(`// Error generating refactoring hints. 
// In a real application, this would contain detailed refactoring suggestions.
// API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#00ADB5] flex items-center">
          <Sparkles className="mr-2 h-6 w-6" />
          Refactoring Hints
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
              <Sparkles className="mr-2 h-5 w-5" />
              Refactoring Hints
            </h3>
            <p className="text-[#EEEEEE] mb-4">
              Writing code is one thing—writing great code is another. Our AI
              assistant reviews your existing code structure and suggests
              refactoring opportunities in real time. By detecting redundancies,
              inefficient patterns, or outdated syntax, this tool helps you
              implement best practices effortlessly. Improve maintainability and
              future-proof your projects without combing through every line
              manually.
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
            placeholder="// Paste your code here to get refactoring suggestions"
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
              Get Refactoring Hints <Sparkles className="ml-2 h-4 w-4" />
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
          <h2 className="text-xl font-bold text-[#00ADB5] mb-4">
            Refactoring Suggestions
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
