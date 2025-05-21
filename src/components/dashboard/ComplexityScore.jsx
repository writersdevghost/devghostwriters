import { useState } from "react";
import { BarChart2, ArrowRight, Info } from "lucide-react";

export default function ComplexityScore() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Call to Groq API
      const apiPrompt = `Analyze the complexity of the following code and provide:
1. An overall score from 0-100
2. A readability score from 0-100
3. A maintainability score from 0-100
4. 4-6 detailed metrics (like cyclomatic complexity, nesting depth, etc.) with their values
5. 3-5 improvement suggestions

Format the response as a valid JSON object with these fields:
{
  "overallScore": number,
  "readabilityScore": number,
  "maintainabilityScore": number,
  "metrics": [{"name": string, "value": string}],
  "suggestions": [string]
}

The code to analyze:

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
                  "You are a code analysis assistant that provides detailed complexity analysis in JSON format.",
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

      const jsonMatch = resultContent.match(/```json\n([\s\S]*)\n```/) ||
        resultContent.match(/```([\s\S]*)```/) || [null, resultContent];

      const jsonStr = jsonMatch[1] || resultContent;
      const parsedResult = JSON.parse(jsonStr);

      setResult(parsedResult);

      saveToHistory(parsedResult, code);
    } catch (error) {
      console.error("Error analyzing code complexity:", error);
      setError("Error processing request: " + error.message);

      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = (analysisResult, originalCode) => {
    try {
      // Create a history item
      const historyItem = {
        id: "complexity_" + Date.now(),
        type: "complexity",
        title: "Complexity Analysis",
        content: JSON.stringify(analysisResult),
        originalCode: originalCode,
        timestamp: new Date().toISOString(),
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

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreDescription = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#00ADB5] flex items-center">
          <BarChart2 className="mr-2 h-6 w-6" />
          Complexity Score
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
              <BarChart2 className="mr-2 h-5 w-5" />
              Complexity Score
            </h3>
            <p className="text-[#EEEEEE] mb-4">
              Not all code is created equal—and now, you'll know why. Our
              Complexity Score uses AI to analyze your code for readability,
              maintainability, and logic flow. The result? A visual score that
              helps you identify problem areas, improve quality, and prioritize
              where to clean things up. Think of it as your smart, always-on
              code reviewer.
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
            placeholder="// Paste your code here to analyze its complexity"
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
              Analyze Complexity <BarChart2 className="ml-2 h-4 w-4" />
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
            Complexity Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2D333B] border border-[#00ADB5]/30 rounded-md p-4">
              <h3 className="text-[#EEEEEE] text-lg mb-2">Overall Score</h3>
              <div className="flex items-end">
                <span
                  className={`text-4xl font-bold ${getScoreColor(
                    result.overallScore
                  )}`}
                >
                  {result.overallScore}
                </span>
                <span className="text-[#EEEEEE]/70 ml-2 mb-1">/100</span>
              </div>
              <p className="text-[#EEEEEE]/70 mt-2">
                {getScoreDescription(result.overallScore)}
              </p>
            </div>

            <div className="bg-[#2D333B] border border-[#00ADB5]/30 rounded-md p-4">
              <h3 className="text-[#EEEEEE] text-lg mb-2">Readability</h3>
              <div className="flex items-end">
                <span
                  className={`text-4xl font-bold ${getScoreColor(
                    result.readabilityScore
                  )}`}
                >
                  {result.readabilityScore}
                </span>
                <span className="text-[#EEEEEE]/70 ml-2 mb-1">/100</span>
              </div>
              <div className="w-full bg-[#393E46] rounded-full h-2 mt-3">
                <div
                  className="bg-[#00ADB5] h-2 rounded-full"
                  style={{ width: `${result.readabilityScore}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-[#2D333B] border border-[#00ADB5]/30 rounded-md p-4">
              <h3 className="text-[#EEEEEE] text-lg mb-2">Maintainability</h3>
              <div className="flex items-end">
                <span
                  className={`text-4xl font-bold ${getScoreColor(
                    result.maintainabilityScore
                  )}`}
                >
                  {result.maintainabilityScore}
                </span>
                <span className="text-[#EEEEEE]/70 ml-2 mb-1">/100</span>
              </div>
              <div className="w-full bg-[#393E46] rounded-full h-2 mt-3">
                <div
                  className="bg-[#00ADB5] h-2 rounded-full"
                  style={{ width: `${result.maintainabilityScore}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-[#2D333B] border border-[#00ADB5]/30 rounded-md p-4 mb-6">
            <h3 className="text-[#EEEEEE] text-lg mb-3">Detailed Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {result.metrics.map((metric, index) => (
                <div key={index} className="bg-[#393E46] p-3 rounded-md">
                  <p className="text-[#EEEEEE]/70 text-sm">{metric.name}</p>
                  <p className="text-[#EEEEEE] font-bold mt-1">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#2D333B] border border-[#00ADB5]/30 rounded-md p-4">
            <h3 className="text-[#EEEEEE] text-lg mb-3">
              Improvement Suggestions
            </h3>
            <ul className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="text-[#EEEEEE]">
                  <div className="flex items-start">
                    <div className="bg-[#00ADB5]/20 text-[#00ADB5] w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p>{suggestion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
