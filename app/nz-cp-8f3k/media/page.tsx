import { getMediaFiles } from '@/lib/queries'
import { MediaGallery } from './MediaGallery'

export default async function MediaPage() {
  const files = await getMediaFiles()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Медиатека</h1>
        <span className="text-sm text-gray-500">{files.length} файлов</span>
      </div>

      <MediaGallery files={files} />
    </div>
  )
}
