export default function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="num">[ 01 ]</div>
          <h2>About <em>me.</em></h2>
        </div>

        <div className="about-grid">
          <div className="about-copy">
            <p className="reveal">
              はじめまして、<span className="hl">道地 志門</span>です。<br />
              大分大学 電気電子工学科を卒業後、ソニー・GM&amp;O での 8年間のソフトウェア開発を経て、
              現在はフリーランス（副業）のWebエンジニアとして活動しています。
            </p>
            <p className="reveal d1">
              得意領域は<span className="hl">WEBページ・WEBアプリの開発</span>、
              業務フローの改善を目的とした<span className="hl">DX推進</span>、
              そして<span className="hl">AI導入支援</span>。
              「作って終わり」ではなく、現場で使われ続けるものをつくることを大切にしています。
            </p>
            <p className="reveal d2">
              創造性の源泉はキャンプとAI研究。<br />
              焚き火の前で考えたアイデアが、翌朝のコミットになる。<br />
              そんな働き方をしています。
            </p>

            <div className="skill-row reveal d3">
              <span className="pill solid">Python</span>
              <span className="pill">VBA</span>
              <span className="pill">GAS</span>
              <span className="pill">HTML / CSS</span>
              <span className="pill violet">React / Next.js</span>
              <span className="pill">TypeScript</span>
              <span className="pill pink">Figma</span>
              <span className="pill">TouchDesigner</span>
            </div>
          </div>

          <div className="timeline reveal d2">
            <div className="tl-item">
              <div className="yr">2016 — GRADUATION</div>
              <h4>大分大学 工学部 電気電子工学科 卒</h4>
              <p>卒業研究テーマはAI。ハードウェアとソフトウェアの境界で学ぶ。</p>
            </div>
            <div className="tl-item">
              <div className="yr">2016 – 2024 / 8 YEARS</div>
              <h4>ソニーGM&amp;O 株式会社</h4>
              <p>設備制御設計（ロボット制御、電気設計）</p>
            </div>
            <div className="tl-item now">
              <div className="yr">2024 — NOW</div>
              <h4>株式会社アルバック</h4>
              <p>装置制御設計（本業）/ 社内DX・業務改善活動</p>
            </div>
            <div className="tl-item now">
              <div className="yr">2026 — NOW / SIDE WORK</div>
              <h4>Freelance — App Dev · DX · AI</h4>
              <p>WEBページ・アプリ開発から、DX推進・AI導入まで柔軟に対応。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
