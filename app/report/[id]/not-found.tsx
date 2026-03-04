import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-gray-600 text-sm mb-2">Report not found</p>
        <h1 className="text-3xl font-bold text-white mb-4">
          This report doesn&apos;t exist
        </h1>
        <p className="text-gray-400 mb-8">
          The report ID may be invalid or the scan may not have completed.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-colors"
        >
          Run a new scan
        </Link>
      </div>
    </main>
  );
}
