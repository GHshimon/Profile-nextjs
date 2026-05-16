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
            <h3>Hands-on First<span className="ja">現場主義</span></h3>
            <p>机上の理論より、実際の業務・作業・運用を重視。
              「現場で使えないDX」に価値はないという考えのもと、
              導入後も継続して使われる仕組みを作ります。</p>
            <div className="line">
              <span>業務フロー分析</span><span>Python</span><span>GAS / VBA</span>
            </div>
          </div>

          <div className="str reveal d1">
            <div className="num">02</div>
            <h3>One-on-One Craft<span className="ja">ハンドメイド対応</span></h3>
            <p>一人ひとりの課題に向き合い、オーダーメイドで対応。
              大量生産的なSaaSではなく、その現場に合わせて
              丁寧に作ることが、craft. の差別化ポイントです。</p>
            <div className="line">
              <span>要件ヒアリング</span><span>小規模開発</span><span>継続サポート</span>
            </div>
          </div>

          <div className="str reveal d2">
            <div className="num">03</div>
            <h3>Start Small, Improve Fast<span className="ja">小さく、すぐ作る</span></h3>
            <p>完成品を長期間かけて作るより、まず使えるものを
              小さく作り、改善する。AIを活用した開発で、
              着手から動くものまでのスピードが違います。</p>
            <div className="line">
              <span>Next.js</span><span>Supabase</span><span>Vercel</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
