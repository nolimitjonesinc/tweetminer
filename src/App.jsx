import { useState, useEffect } from 'react';

const MODES = {
  exploit: {
    label: 'Exploit',
    description: 'Find opportunities',
    color: '#10b981',
  },
  explain: {
    label: 'Explain',
    description: 'Break it down',
    color: '#3b82f6',
  },
  productize: {
    label: 'Productize',
    description: 'Make money',
    color: '#f59e0b',
  }
};

function LoginScreen({ onLogin, error }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(password);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 700,
          color: '#111',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          TweetMiner
        </h1>
        <p style={{
          fontSize: '15px',
          color: '#666',
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          Private tool. Enter your access code.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Access code"
            style={{
              width: '100%',
              background: '#fafafa',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              color: '#111',
              padding: '16px',
              fontSize: '16px',
              fontFamily: 'inherit',
              marginBottom: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
          {error && (
            <p style={{
              color: '#ef4444',
              fontSize: '14px',
              textAlign: 'center',
              marginBottom: '12px',
            }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              background: loading || !password ? '#e0e0e0' : '#111',
              border: 'none',
              borderRadius: '12px',
              color: loading || !password ? '#999' : '#fff',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Verifying...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

function TweetAnalyzer({ onLogout, initialTweet, initialReplies, sourceUrl }) {
  const [tweetContent, setTweetContent] = useState(initialTweet || '');
  const [topReplies, setTopReplies] = useState(initialReplies || '');
  const [selectedMode, setSelectedMode] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const analyze = async (mode) => {
    if (!tweetContent.trim()) return;

    setSelectedMode(mode);
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, tweetContent, topReplies }),
      });

      const data = await response.json();
      setResult(data.error ? `Error: ${data.error}` : data.result);
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setTweetContent('');
    setTopReplies('');
    setResult('');
    setSelectedMode(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #f0f0f0',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111', margin: 0 }}>
          TweetMiner
        </h1>
        <button
          onClick={onLogout}
          style={{
            background: 'none',
            border: 'none',
            color: '#666',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          Logout
        </button>
      </header>

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Source indicator */}
        {sourceUrl && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '14px',
            color: '#166534',
          }}>
            Imported from Twitter
          </div>
        )}

        {/* Tweet Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#111',
            marginBottom: '8px',
          }}>
            Tweet
          </label>
          <textarea
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="Paste tweet content here..."
            style={{
              width: '100%',
              minHeight: '140px',
              background: '#fafafa',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              color: '#111',
              padding: '16px',
              fontSize: '15px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              outline: 'none',
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Replies Input */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#111',
            marginBottom: '8px',
          }}>
            Replies <span style={{ fontWeight: 400, color: '#999' }}>(optional)</span>
          </label>
          <textarea
            value={topReplies}
            onChange={(e) => setTopReplies(e.target.value)}
            placeholder="Paste interesting replies or thread..."
            style={{
              width: '100%',
              minHeight: '100px',
              background: '#fafafa',
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              color: '#111',
              padding: '16px',
              fontSize: '15px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              outline: 'none',
              lineHeight: 1.6,
            }}
          />
        </div>

        {/* Mode Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '32px',
        }}>
          {Object.entries(MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => analyze(key)}
              disabled={loading || !tweetContent.trim()}
              style={{
                background: selectedMode === key ? mode.color : '#fafafa',
                border: selectedMode === key ? 'none' : '1px solid #e0e0e0',
                borderRadius: '12px',
                color: selectedMode === key ? '#fff' : '#111',
                padding: '20px 16px',
                cursor: loading || !tweetContent.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !tweetContent.trim() ? 0.5 : 1,
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>
                {mode.label}
              </div>
              <div style={{
                fontSize: '13px',
                color: selectedMode === key ? 'rgba(255,255,255,0.8)' : '#666',
              }}>
                {mode.description}
              </div>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '48px 20px',
            color: '#666',
          }}>
            <div style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '2px solid #e0e0e0',
              borderTopColor: MODES[selectedMode]?.color || '#111',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: '16px', fontSize: '14px' }}>Analyzing...</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div style={{
            background: '#fafafa',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e0e0e0',
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: MODES[selectedMode]?.color || '#111',
              }}>
                {MODES[selectedMode]?.label} Analysis
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={clearAll}
                  style={{
                    background: '#fff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    color: '#666',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                  }}
                >
                  Clear
                </button>
                <button
                  onClick={copyResult}
                  style={{
                    background: copied ? '#10b981' : '#111',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                  }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <div style={{
              fontSize: '15px',
              lineHeight: 1.8,
              color: '#333',
              whiteSpace: 'pre-wrap',
            }}>
              {result}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          marginTop: '64px',
          paddingTop: '24px',
          borderTop: '1px solid #f0f0f0',
          textAlign: 'center',
          fontSize: '13px',
          color: '#999',
        }}>
          Powered by Claude
        </footer>
      </main>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [urlParams, setUrlParams] = useState({ tweet: '', replies: '', source: '' });

  useEffect(() => {
    // Parse URL parameters (from extension)
    const params = new URLSearchParams(window.location.search);
    setUrlParams({
      tweet: params.get('tweet') || '',
      replies: params.get('replies') || '',
      source: params.get('source') || '',
    });

    // Clear URL params after reading (cleaner URL)
    if (params.has('tweet')) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Check if already authenticated
    const token = localStorage.getItem('tweetminer_auth');
    if (token) {
      verifyToken(token);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      if (data.valid) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('tweetminer_auth');
      }
    } catch (err) {
      localStorage.removeItem('tweetminer_auth');
    }
    setCheckingAuth(false);
  };

  const handleLogin = async (password) => {
    setLoginError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem('tweetminer_auth', data.token);
        setIsAuthenticated(true);
      } else {
        setLoginError('Invalid password');
      }
    } catch (err) {
      setLoginError('Connection error. Try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tweetminer_auth');
    setIsAuthenticated(false);
  };

  if (checkingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '15px',
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  return (
    <TweetAnalyzer
      onLogout={handleLogout}
      initialTweet={urlParams.tweet}
      initialReplies={urlParams.replies}
      sourceUrl={urlParams.source}
    />
  );
}

export default App;
