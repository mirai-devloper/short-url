import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="main">
      <div className="container">
        <div className="not-found-wrapper">
          <div className="not-found-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="url(#nfGrad)" strokeWidth="1.5"/>
              <path d="M16 16s-1.5-2-4-2-4 2-4 2" stroke="url(#nfGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="9" y1="9" x2="9.01" y2="9" stroke="url(#nfGrad)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="15" y1="9" x2="15.01" y2="9" stroke="url(#nfGrad)" strokeWidth="2" strokeLinecap="round"/>
              <defs>
                <linearGradient id="nfGrad" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#818cf8"/>
                  <stop offset="1" stopColor="#f472b6"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">ページが見つかりません</h2>
          <p className="not-found-description">
            この短縮URLは存在しないか、有効期限が切れています。
          </p>
          <Link href="/" className="not-found-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="12 19 5 12 12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            トップに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
