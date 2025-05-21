import { useState } from "react";
import { Bug, Loader2, Info } from "lucide-react";

export default function BugFixer() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [inputCode, setInputCode] = useState("");

  const handleSubmit = async (code) => {
    setLoading(true);
    setError(null);
    setDetails(null);

    try {
      const apiPrompt = `Fix the following code and explain what was wrong:\n\n${code}`;

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
                content: "You are a helpful code assistant.",
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
      setOutput(resultContent);

      try {
        const issuesSection = resultContent.match(
          /issues found|problems identified|bugs found/i
        );

        if (issuesSection) {
          const issues = [];
          const lines = resultContent.split("\n");

          let currentIssueIndex = 0;
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (
              line.match(/issue|problem|bug|error|warning/i) &&
              line.match(/line|at|in/i) &&
              !line.match(/^```|```$/)
            ) {
              const lineNumberMatch = line.match(
                /line\s+(\d+)|at\s+line\s+(\d+)/i
              );
              const lineNumber = lineNumberMatch
                ? lineNumberMatch[1] || lineNumberMatch[2]
                : currentIssueIndex + 1;

              const severity = line.toLowerCase().includes("error")
                ? "error"
                : "warning";

              issues.push({
                line: parseInt(lineNumber, 10),
                description: line.trim(),
                severity: severity,
              });

              currentIssueIndex++;
            }
          }

          if (issues.length > 0) {
            setDetails({ issues });
          }
        }
      } catch (parsingError) {
        console.warn("Could not parse issues from response:", parsingError);
      }

      saveToHistory(code, resultContent);
    } catch (err) {
      console.error("API Error:", err);
      setError("Error processing request: " + err.message);

      const fallbackResponse = `// Fallback bug fix mode
// In a real application, the API would analyze and fix your code
// Please check your code for common issues or try again later.`;

      setOutput(fallbackResponse);
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (inputCode, outputContent) => {
    try {
      // Create history item
      const historyItem = {
        id: "bugfix-" + Date.now(),
        type: "bugfixer",
        title: "Fixed Code Bug",
        timestamp: new Date().toISOString(),
        content: outputContent,
        originalCode: inputCode,
      };

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#00ADB5] flex items-center">
          <Bug className="mr-2 h-6 w-6" />
          Bug Fix Assistant
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
              <Bug className="mr-2 h-5 w-5" />
              Bug Fix Assistant
            </h3>
            <p className="text-[#EEEEEE] mb-4">
              Having trouble with buggy code? Our AI-powered bug fixer analyzes
              your code, identifies issues, and provides corrected versions with
              explanations of what went wrong. Simply paste your problematic
              code and get instant fixes.
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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputCode.trim()) {
            handleSubmit(inputCode);
          }
        }}
      >
        <div className="mb-4">
          <label className="block text-[#17696e] mb-2" htmlFor="code-bug-input">
            Paste your code with bugs here
          </label>
          <textarea
            id="code-bug-input"
            className="w-full bg-[#393E46] text-[#EEEEEE] border border-[#00ADB5]/30 rounded-md p-3 h-32 font-mono focus:outline-none focus:ring-2 focus:ring-[#00ADB5]/50"
            placeholder="Paste your code with bugs here..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
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
              Fix Bugs <Bug className="ml-2 h-4 w-4" />
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

      {loading && (
        <div className="mt-8 flex flex-col items-center justify-center p-10">
          <div className="animate-spin h-10 w-10 border-4 border-[#00ADB5] border-t-transparent rounded-full"></div>
          <p className="mt-4 text-[#EEEEEE]">
            Analyzing and fixing your code...
          </p>
        </div>
      )}

      {details && !loading && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#00ADB5] mb-4">
            Issues Found:
          </h2>
          <div className="bg-[#2D333B] border border-[#00ADB5]/30 rounded-md p-4">
            <ul className="space-y-2">
              {details.issues.map((issue, index) => (
                <li key={index} className="flex items-start">
                  <span
                    className={`inline-block w-2 h-2 mt-1.5 mr-2 rounded-full ${
                      issue.severity === "error"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  ></span>
                  <span className="text-[#EEEEEE]">
                    <strong>Line {issue.line}:</strong> {issue.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {output && !loading && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#00ADB5] mb-4">Fixed Code</h2>
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
