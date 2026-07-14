// JSON-LD 構造化データを埋め込むためのコンポーネント。
// Next.js 公式ガイドに従い、ネイティブ <script> で出力し、
// XSS 対策として "<" をエスケープする。
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  )
}
