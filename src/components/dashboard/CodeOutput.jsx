export default function CodeOutput({ output, loading }) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!output) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-3">Result:</h3>
      <div className="bg-gray-900 text-white p-4 rounded-lg overflow-auto">
        <pre className="font-mono whitespace-pre-wrap">{output}</pre>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => navigator.clipboard.writeText(output)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
}
