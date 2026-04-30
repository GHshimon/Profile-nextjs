export default function Strengths() {
  return (
    <section className="strengths" id="strengths">
      <div className="str-glow a"></div>
      <div className="str-glow b"></div>
      <div className="str-glow c"></div>

      <div className="wrap">
        <div className="section-head reveal">
          <div className="num">[ 03 ]</div>
          <h2>What I&apos;m <em>good at.</em></h2>
        </div>

        <div className="str-grid">
          <div className="str reveal">
            <div className="num">01</div>
            <h3>Brand-first Engineering<span className="ja">ブランド起点で動くエンジニアリング</span></h3>
            <p>ロゴ・配色・モーションの整合性を、コンポーネント設計と CSS 変数で担保。
              ブランドガイドが「実装で破綻しない」ことを最初から前提に組みます。</p>
            <div className="line">
              <span>Design Tokens</span><span>Tailwind</span><span>Framer Motion</span>
            </div>
          </div>

          <div className="str reveal d1">
            <div className="num">02</div>
            <h3>UX from User Research<span className="ja">調査から始める UX 設計</span></h3>
            <p>業務系 8年・toC 2年の経験から、現場の言葉でユーザーを観察し、
              仮説を画面に落とし込む。Figma だけで終わらないリサーチ駆動。</p>
            <div className="line">
              <span>UX Research</span><span>Figma</span><span>Prototyping</span>
            </div>
          </div>

          <div className="str reveal d2">
            <div className="num">03</div>
            <h3>0→1 Speed<span className="ja">バイブコーディングで加速する開発</span></h3>
            <p>AIと対話しながらコードを生成するバイブコーディングを活用。
              従来の開発と比べてスピード感がまるで違います。</p>
            <div className="line">
              <span>Next.js</span><span>Supabase</span><span>Vercel</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
