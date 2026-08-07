export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold mb-4">Mori Prep Verification</h1>
        <p className="text-gray-600 mb-4">
          This page is used for Google OAuth verification purposes.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Home Page: <a href="/" className="text-blue-600 hover:underline">https://moriprep.xyz</a></p>
          <p>Privacy Policy: <a href="/privacy" className="text-blue-600 hover:underline">https://moriprep.xyz/privacy</a></p>
          <p>Terms of Service: <a href="/terms" className="text-blue-600 hover:underline">https://moriprep.xyz/terms</a></p>
        </div>
      </div>
    </div>
  );
}
