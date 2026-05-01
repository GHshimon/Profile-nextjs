export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="deco s1" style={{ top: '10%', left: '6%', right: 'auto' }}>
        <svg viewBox="0 0 200 200">
          <path
            fill="oklch(0.92 0.22 128)"
            d="M44,-60C56,-48,62,-32,66,-15C70,2,72,21,63,34C53,47,33,55,15,60C-3,65,-19,67,-35,60C-51,53,-66,38,-71,20C-76,1,-71,-21,-60,-37C-49,-53,-31,-63,-13,-67C5,-72,23,-71,44,-60Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>
      <div className="deco s2" style={{ top: '20%', bottom: 'auto', right: '8%', left: 'auto' }}>
        <svg viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="55" fill="oklch(0.62 0.22 295)" />
        </svg>
      </div>

      <div className="wrap">
        <h2 className="reveal">
          Let&apos;s <em>build</em><br />
          <span className="blk">something pop.</span>
        </h2>
        <p className="lead reveal d1">
          ブランディングのリブートも、新規プロダクトの立ち上げも。<br />
          まずは 30分のカジュアル相談から、お気軽にどうぞ。
        </p>

        <div className="contact-links">
          <a className="clink reveal d2" href="mailto:hello@shimon-dev.com">
            <span className="ico">✉</span>
            hello@shimon-dev.com
            <span className="arr">→</span>
          </a>
          <a
            className="clink reveal d3"
            href="https://github.com/GHshimon"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ico">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
              </svg>
            </span>
            github.com/GHshimon
            <span className="arr">→</span>
          </a>
          <a
            className="clink reveal d4"
            href="https://x.com/shimon_dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="ico">𝕏</span>
            @shimon_dev
            <span className="arr">→</span>
          </a>
        </div>

        <footer>
          <span>© 2026 SHIMON DOUCHI</span>
          <span>MADE WITH ☕ + ✦ IN TOKYO</span>
        </footer>
      </div>
    </section>
  )
}
