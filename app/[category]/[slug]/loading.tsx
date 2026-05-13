export default function ArticleLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      {/* Breadcrumbs */}
      <div className="flex gap-2 mb-6">
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cover image */}
          <div className="h-[400px] bg-gray-200 rounded-lg mb-6" />

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-6 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-100 rounded w-32" />
          </div>

          {/* Title */}
          <div className="h-8 bg-gray-200 rounded w-full mb-2" />
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4" />

          {/* Lead */}
          <div className="h-5 bg-gray-100 rounded w-full mb-2" />
          <div className="h-5 bg-gray-100 rounded w-4/5 mb-6" />

          {/* Content */}
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded w-full" />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-100 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
