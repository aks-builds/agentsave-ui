const FRAMEWORKS = ["langchain", "langgraph", "autogen", "crewai", "smolagents", "raw"];

export default function AgentsPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">Agent Frameworks</h1>
      <p className="text-gray-400 mb-8">Token savings broken down by framework.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FRAMEWORKS.map((fw) => (
          <div key={fw} className="bg-gray-900 rounded-xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-blue-300 font-bold text-sm">
              {fw[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold capitalize">{fw}</p>
              <p className="text-gray-400 text-sm">No runs yet</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gray-900 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-2">How savings work</h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          AgentSave wraps your agent loop with a three-layer supervisor: a TF-IDF context filter drops
          low-relevance tool outputs, an early-exit detector stops iterations when returns diminish,
          and a budget gate enforces a graceful token ceiling. Together they reduce token spend by
          ~30% without degrading task success rate.
        </p>
      </div>
    </main>
  );
}
