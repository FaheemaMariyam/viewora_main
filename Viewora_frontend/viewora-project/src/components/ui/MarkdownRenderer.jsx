import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none text-inherit overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-xl font-bold mb-2 text-brand-primary" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-lg font-semibold mb-2 mt-4 text-brand-primary border-b border-gray-100 pb-1" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-md font-semibold mb-1 mt-3" {...props} />,
          p: ({ node, ...props }) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc ml-5 mb-3 space-y-1" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal ml-5 mb-3 space-y-1" {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-brand-primary" {...props} />,
          // Table styling
          table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-gray-50" {...props} />,
          th: ({ node, ...props }) => <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" {...props} />,
          td: ({ node, ...props }) => <td className="px-3 py-2 text-xs border-t border-gray-100" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-gray-50/50 transition-colors" {...props} />,
          code: ({ node, inline, ...props }) => (
            <code 
              className={`${inline ? 'bg-gray-100 px-1 py-0.5 rounded text-red-500 font-medium' : 'block bg-gray-900 text-gray-100 p-3 rounded-lg my-2 overflow-x-auto'} font-mono text-xs`} 
              {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
