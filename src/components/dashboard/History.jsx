import { useState, useEffect } from "react";
import {
  Clock,
  Code,
  CheckCircle,
  Trash2,
  FileSearch,
  RefreshCw,
  Sparkles,
  Minimize2,
  BarChart2,
  Image,
} from "lucide-react";

export default function History() {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Function to load history from localStorage
    const loadHistory = () => {
      setLoading(true);
      try {
        const storedHistory = JSON.parse(
          localStorage.getItem("codeHistory") || "[]"
        );
        setHistoryItems(storedHistory);
      } catch (error) {
        console.error("Error loading history:", error);
        setHistoryItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();

    const historyUpdateHandler = () => loadHistory();
    window.addEventListener("historyUpdated", historyUpdateHandler);

    return () => {
      window.removeEventListener("historyUpdated", historyUpdateHandler);
    };
  }, []);

  const filteredItems =
    filter === "all"
      ? historyItems
      : historyItems.filter((item) => item.type === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const deleteItem = (id) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));

    try {
      const storedHistory = JSON.parse(
        localStorage.getItem("codeHistory") || "[]"
      );
      const updatedHistory = storedHistory.filter((item) => item.id !== id);
      localStorage.setItem("codeHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Error deleting history item from localStorage:", error);
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard
      .writeText(content)
      .then(() => {
        console.log("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  const useAgain = (item) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("reusedSnippet", JSON.stringify(item));

      // Navigate to the appropriate page based on type
      if (item.type === "image") {
        window.location.href = "/dashboard/image";
      } else if (item.type === "explain") {
        window.location.href = "/dashboard/explain";
      } else if (item.type === "convert") {
        window.location.href = "/dashboard/convert";
      } else if (item.type === "bugfixer") {
        window.location.href = "/dashboard/bugfixer";
      } else if (item.type === "refactor") {
        window.location.href = "/dashboard/refactor";
      } else if (item.type === "minify") {
        window.location.href = "/dashboard/minify";
      } else if (item.type === "complexity") {
        window.location.href = "/dashboard/complexity";
      } else {
        window.location.href = "/dashboard/snippet";
      }
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "snippet":
        return <Code className="h-5 w-5 text-blue-500 mr-2" />;
      case "bugfixer":
        return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />;
      case "explain":
        return <FileSearch className="h-5 w-5 text-amber-500 mr-2" />;
      case "convert":
        return <RefreshCw className="h-5 w-5 text-purple-500 mr-2" />;
      case "refactor":
        return <Sparkles className="h-5 w-5 text-pink-500 mr-2" />;
      case "minify":
        return <Minimize2 className="h-5 w-5 text-indigo-500 mr-2" />;
      case "complexity":
        return <BarChart2 className="h-5 w-5 text-orange-500 mr-2" />;
      case "image":
        return <Image className="h-5 w-5 text-teal-500 mr-2" />;
      default:
        return <Code className="h-5 w-5 text-gray-500 mr-2" />;
    }
  };

  return (
    <div className="history-container">
      {/* Filter tabs */}
      <div className="flex mb-6 border-b overflow-x-auto pb-1">
        <button
          className={`px-3 py-2 font-medium whitespace-nowrap ${
            filter === "all"
              ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("all")}
        >
          All History
        </button>
        <button
          className={`px-3 py-2 font-medium whitespace-nowrap ${
            filter === "snippet"
              ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("snippet")}
        >
          Snippets
        </button>
        <button
          className={`px-3 py-2 font-medium whitespace-nowrap ${
            filter === "bugfixer"
              ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("bugfixer")}
        >
          Bug Fixes
        </button>
        <button
          className={`px-3 py-2 font-medium whitespace-nowrap ${
            filter === "explain"
              ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("explain")}
        >
          Explanations
        </button>
        <button
          className={`px-3 py-2 font-medium whitespace-nowrap ${
            filter === "convert"
              ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("convert")}
        >
          Conversions
        </button>
        <button
          className={`px-3 py-2 font-medium whitespace-nowrap ${
            filter === "refactor"
              ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("refactor")}
        >
          Refactoring
        </button>
        <button
          className={`px-3 py-2 font-medium whitespace-nowrap ${
            filter === "minify"
              ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("minify")}
        >
          Minify
        </button>
        <button
          className={`px-3 py-2 font-medium whitespace-nowrap ${
            filter === "complexity"
              ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("complexity")}
        >
          Complexity
        </button>
        <button
          className={`px-3 py-2 font-medium whitespace-nowrap ${
            filter === "image"
              ? "text-[#00ADB5] border-b-2 border-[#00ADB5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setFilter("image")}
        >
          Images
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ADB5]"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <Clock className="mx-auto h-12 w-12 mb-3 text-gray-400" />
          <h3 className="text-lg font-medium">No history items found</h3>
          <p>Items you work with will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {getIconForType(item.type)}
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {(item.type === "bugfixer" ||
                item.type === "explain" ||
                item.type === "convert") &&
                item.originalCode && (
                  <div className="mt-3 bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                    <div className="text-xs text-gray-500 mb-2">
                      {item.type === "explain"
                        ? "Original Code:"
                        : item.type === "convert"
                        ? `Original Code (before conversion to ${item.targetLanguage}):`
                        : "Original Code with Issues:"}
                    </div>
                    <pre className="text-gray-700 ">{item.originalCode}</pre>
                  </div>
                )}

              <div className="mt-3 bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
                {item.type === "bugfixer" && item.originalCode && (
                  <div className="text-xs text-gray-500 mb-2">Fixed Code:</div>
                )}
                {item.type === "explain" && item.originalCode && (
                  <div className="text-xs text-gray-500 mb-2">Explanation:</div>
                )}
                {item.type === "convert" && item.originalCode && (
                  <div className="text-xs text-gray-500 mb-2">
                    Converted Code ({item.targetLanguage}):
                  </div>
                )}
                {item.type === "image" && (
                  <div className="flex flex-col items-center">
                    <div className="text-xs text-gray-500 mb-2">
                      Generated Image:
                    </div>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="rounded-md max-h-40 object-contain mb-2"
                      />
                    )}
                    <div className="text-xs text-gray-700">{item.content}</div>
                  </div>
                )}
                {!item.type.includes("image") && (
                  <pre className="text-gray-700">{item.content}</pre>
                )}
              </div>

              <div className="mt-2 flex justify-end space-x-2">
                <button
                  onClick={() => copyToClipboard(item.content)}
                  className="text-xs text-gray-500 hover:underline"
                >
                  Copy
                </button>
                <button
                  onClick={() => useAgain(item)}
                  className="text-xs text-[#00ADB5] hover:underline"
                >
                  Use again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
