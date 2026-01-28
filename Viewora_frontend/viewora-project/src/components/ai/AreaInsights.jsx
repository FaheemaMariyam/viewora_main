import AIChatBot from "./AIChatBot";

export default function AreaInsights() {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Market Intelligence & Insights
        </h2>
        <p className="text-gray-500">
          Powered by Viewora RAG for hyper-local real estate analysis.
        </p>
      </div>
      
      <AIChatBot />
    </div>
  );
}
