export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="h-7 bg-gray-200 rounded w-40" />
        <div className="h-9 bg-gray-200 rounded w-32" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-100">
            <div className="h-48 bg-gray-200" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-5 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-100 rounded w-24" />
              </div>
              <div className="h-5 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
