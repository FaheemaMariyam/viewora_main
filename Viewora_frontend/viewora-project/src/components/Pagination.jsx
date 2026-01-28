export default function Pagination({ page, total, onPage }) {
  const totalPages = Math.ceil(total / 10);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-12 flex-wrap">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => onPage(i + 1)}
          className={`
            px-3 py-1.5 rounded-md text-sm font-medium transition
            ${
              page === i + 1
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white/80 text-gray-700 hover:bg-white"
            }
          `}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
