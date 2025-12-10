import { useState, useEffect } from 'react';

const MODES = {
  exploit: {
    label: 'EXPLOIT',
    description: 'How can I capitalize on this?',
    icon: '⚡',
    color: '#00ff88',
  },
  explain: {
    label: 'EXPLAIN',
    description: 'How does this actually work?',
    icon: '🔍',
    color: '#00d4ff',
  },
  productize: {
    label: 'PRODUCTIZE',
    description: 'How do I make money from this?',
    icon: '💰',
    color: '#ffaa00',
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
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: "'SF Mono', 'Consolas', 'Monaco', monospace",
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{
          fontSize: '12px',
          fontWeight: 400,
          letterSpacing: '4px',
          color: '#555',
          marginBottom: '8px',
          textAlign: 'center',
        }}>
          NOLIMITJONES.COM
        </h1>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          background: 'linear-gradient(90deg, #00ff88, #00d4ff, #ffaa00)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          TWEETMINER
        </h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: '100%',
              background: '#111',
              border: '1px solid #333',
              color: '#e0e0e0',
              padding: '16px',
              fontSize: '16px',
              fontFamily: 'inherit',
              textAlign: 'center',
              letterSpacing: '4px',
              marginBottom: '16px',
            }}
            autoFocus
          />
          {error && (
            <p style={{
              color: '#ff4444',
              fontSize: '12px',
              textAlign: 'center',
              marginBottom: '16px',
            }}>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            style={{
              width: '100%',
              background: '#00ff8820',
              border: '2px solid #00ff88',
              color: '#00ff88',
              padding: '16px',
              fontSize: '14px',
              fontWeight: 700,
              letterSpacing: '2px',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              opacity: loading || !password ? 0.5 : 1,
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'VERIFYING...' : 'ENTER'}
          </button>
        </form>
      </div>
    </div>
  );
}

function TweetAnalyzer({ onLogout }) {
  const [tweetContent, setTweetContent] = useState('');
  const [topReplies, setTopReplies] = useState('');
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          tweetContent,
          topReplies,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setResult(`Error: ${data.error}`);
      } else {
        setResult(data.result);
      }
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
      background: '#0a0a0a',
      color: '#e0e0e0',
      fontFamily: "'SF Mono', 'Consolas', 'Monaco', monospace",
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          borderBottom: '1px solid #222',
          paddingBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: 400,
              letterSpacing: '4px',
              color: '#555'
            }}>
              NOLIMITJONES.COM
            </h1>
            <h2 style={{
              margin: '8px 0 0 0',
              fontSize: '24px',
              fontWeight: 700,
              background: 'linear-gradient(90deg, #00ff88, #00d4ff, #ffaa00)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              TWEETMINER
            </h2>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: '1px solid #333',
              color: '#666',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '11px',
              letterSpacing: '2px',
            }}
          >
            LOGOUT
          </button>
        </div>

        {/* Input Section */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '10px',
            letterSpacing: '2px',
            color: '#666',
            marginBottom: '8px'
          }}>
            PASTE TWEET CONTENT
          </label>
          <textarea
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="Paste the tweet text here..."
            style={{
              width: '100%',
              minHeight: '120px',
              background: '#0a0a0a',
              border: '1px solid #222',
              color: '#e0e0e0',
              padding: '16px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              lineHeight: 1.6
            }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontSize: '10px',
            letterSpacing: '2px',
            color: '#666',
            marginBottom: '8px'
          }}>
            TOP REPLIES / THREAD <span style={{ color: '#444' }}>(OPTIONAL)</span>
          </label>
          <textarea
            value={topReplies}
            onChange={(e) => setTopReplies(e.target.value)}
            placeholder="Paste interesting replies or thread continuation..."
            style={{
              width: '100%',
              minHeight: '80px',
              background: '#0a0a0a',
              border: '1px solid #222',
              color: '#e0e0e0',
              padding: '16px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box',
              lineHeight: 1.6
            }}
          />
        </div>

        {/* Mode Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '40px'
        }}>
          {Object.entries(MODES).map(([key, mode]) => (
            <button
              key={key}
              onClick={() => analyze(key)}
              disabled={loading || !tweetContent.trim()}
              style={{
                background: selectedMode === key ? mode.color + '15' : '#111',
                border: `2px solid ${selectedMode === key ? mode.color : '#222'}`,
                color: selectedMode === key ? mode.color : '#888',
                padding: '20px 16px',
                cursor: loading || !tweetContent.trim() ? 'not-allowed' : 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                opacity: loading || !tweetContent.trim() ? 0.5 : 1,
                fontFamily: 'inherit',
              }}
              onMouseOver={(e) => {
                if (!loading && tweetContent.trim()) {
                  e.currentTarget.style.borderColor = mode.color;
                  e.currentTarget.style.color = mode.color;
                  e.currentTarget.style.background = mode.color + '10';
                }
              }}
              onMouseOut={(e) => {
                if (selectedMode !== key) {
                  e.currentTarget.style.borderColor = '#222';
                  e.currentTarget.style.color = '#888';
                  e.currentTarget.style.background = '#111';
                }
              }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{mode.icon}</div>
              <div style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '2px',
                marginBottom: '4px'
              }}>
                {mode.label}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#555',
                fontWeight: 400
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
            padding: '60px 20px',
            color: '#666'
          }}>
            <div style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '2px solid #333',
              borderTopColor: MODES[selectedMode]?.color || '#00ff88',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: '16px', fontSize: '11px', letterSpacing: '2px' }}>
              ANALYZING...
            </p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div style={{
            background: '#111',
            border: `1px solid ${MODES[selectedMode]?.color || '#333'}`,
            padding: '24px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '16px',
              borderBottom: '1px solid #222',
              flexWrap: 'wrap',
              gap: '8px'
            }}>
              <span style={{
                fontSize: '10px',
                letterSpacing: '2px',
                color: MODES[selectedMode]?.color || '#666'
              }}>
                {MODES[selectedMode]?.icon} {MODES[selectedMode]?.label} ANALYSIS
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={clearAll}
                  style={{
                    background: 'none',
                    border: '1px solid #333',
                    color: '#666',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    fontFamily: 'inherit',
                  }}
                >
                  CLEAR
                </button>
                <button
                  onClick={copyResult}
                  style={{
                    background: copied ? '#00ff8820' : 'none',
                    border: `1px solid ${copied ? '#00ff88' : '#333'}`,
                    color: copied ? '#00ff88' : '#666',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    letterSpacing: '1px',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}
                >
                  {copied ? '✓ COPIED' : 'COPY'}
                </button>
              </div>
            </div>
            <div style={{
              fontSize: '14px',
              lineHeight: 1.8,
              color: '#ccc',
              whiteSpace: 'pre-wrap'
            }}>
              {result}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          marginTop: '60px',
          paddingTop: '20px',
          borderTop: '1px solid #222',
          textAlign: 'center',
          fontSize: '10px',
          color: '#333',
          letterSpacing: '2px'
        }}>
          POWERED BY CLAUDE API
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
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
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontFamily: "'SF Mono', monospace",
        fontSize: '12px',
        letterSpacing: '2px',
      }}>
        LOADING...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />;
  }

  return <TweetAnalyzer onLogout={handleLogout} />;
}

export default App;
