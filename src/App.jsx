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

const DEFAULT_PROFILE = {
  name: '',
  role: '',
  focus: '',
  goals: '',
  skills: '',
  constraints: '',
  style: 'direct',
};

const PROFILE_FIELDS = [
  { key: 'name', label: 'What should we call you?', placeholder: 'e.g., Alex', type: 'input' },
  { key: 'role', label: 'What do you do?', placeholder: 'e.g., Solo founder, developer, marketer, creator', type: 'input' },
  { key: 'focus', label: 'What are you building or working on?', placeholder: 'e.g., SaaS tools for freelancers, mobile games, content business', type: 'textarea' },
  { key: 'goals', label: 'What opportunities are you looking for?', placeholder: 'e.g., Product ideas, market gaps, partnership opportunities, content angles', type: 'textarea' },
  { key: 'skills', label: 'What are you good at?', placeholder: 'e.g., Product design, coding, marketing, writing, sales', type: 'input' },
  { key: 'constraints', label: 'What are your limitations?', placeholder: 'e.g., Limited time, small budget, no technical skills, solo operator', type: 'input' },
];

const STYLE_OPTIONS = [
  { value: 'direct', label: 'Direct & concise' },
  { value: 'detailed', label: 'Detailed & thorough' },
  { value: 'casual', label: 'Casual & conversational' },
];

const PLATFORMS = [
  { value: 'twitter', label: 'Twitter/X', icon: '𝕏' },
  { value: 'reddit', label: 'Reddit', icon: 'R' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { value: 'hackernews', label: 'Hacker News', icon: 'Y' },
  { value: 'youtube', label: 'YouTube', icon: '▶' },
  { value: 'other', label: 'Other', icon: '...' },
];

const MAX_HISTORY_ITEMS = 50;

function saveToHistory(entry) {
  const history = JSON.parse(localStorage.getItem('tweetminer_history') || '[]');
  history.unshift({ ...entry, id: Date.now(), timestamp: new Date().toISOString() });
  if (history.length > MAX_HISTORY_ITEMS) history.pop();
  localStorage.setItem('tweetminer_history', JSON.stringify(history));
  return history;
}

function getHistory() {
  return JSON.parse(localStorage.getItem('tweetminer_history') || '[]');
}

function deleteFromHistory(id) {
  const history = getHistory().filter(item => item.id !== id);
  localStorage.setItem('tweetminer_history', JSON.stringify(history));
  return history;
}

function clearHistory() {
  localStorage.setItem('tweetminer_history', '[]');
  return [];
}

function HistoryModal({ onClose, onSelect }) {
  const [history, setHistory] = useState(getHistory());

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setHistory(deleteFromHistory(id));
  };

  const handleClearAll = () => {
    if (confirm('Clear all history?')) {
      setHistory(clearHistory());
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111', margin: 0 }}>
            History
          </h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                }}
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: '#999',
                cursor: 'pointer',
                padding: '4px',
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
        </div>

        <div style={{ overflow: 'auto', flex: 1 }}>
          {history.length === 0 ? (
            <div style={{
              padding: '48px 24px',
              textAlign: 'center',
              color: '#999',
              fontSize: '14px',
            }}>
              No saved analyses yet
            </div>
          ) : (
            history.map(item => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                style={{
                  padding: '16px 24px',
                  borderBottom: '1px solid #f5f5f5',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#fafafa'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px',
                    }}>
                      <span style={{
                        background: MODES[item.mode]?.color || '#666',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}>
                        {item.mode}
                      </span>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#64748b',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                      }}>
                        {PLATFORMS.find(p => p.value === item.platform)?.label || 'Other'}
                      </span>
                      <span style={{ color: '#999', fontSize: '12px' }}>
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#333',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.content.slice(0, 100)}{item.content.length > 100 ? '...' : ''}
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#ccc',
                      fontSize: '18px',
                      cursor: 'pointer',
                      padding: '4px',
                      lineHeight: 1,
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#ccc'}
                  >
                    &times;
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSetup({ onSave, initialProfile }) {
  const [profile, setProfile] = useState(initialProfile || DEFAULT_PROFILE);

  const updateField = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(profile);
  };

  const isValid = profile.name && profile.role && profile.goals;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 20px',
    }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
          Set up your profile
        </h1>
        <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
          This helps TweetMiner find opportunities tailored to you.
        </p>

        <form onSubmit={handleSubmit}>
          {PROFILE_FIELDS.map(field => (
            <div key={field.key} style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#111',
                marginBottom: '8px',
              }}>
                {field.label}
                {['name', 'role', 'goals'].includes(field.key) && (
                  <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                )}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={profile[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    background: '#fafafa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    color: '#111',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    outline: 'none',
                    lineHeight: 1.5,
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={profile[field.key]}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    background: '#fafafa',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    color: '#111',
                    padding: '14px 16px',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              )}
            </div>
          ))}

          <div style={{ marginBottom: '32px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 600,
              color: '#111',
              marginBottom: '8px',
            }}>
              How do you want insights delivered?
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {STYLE_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateField('style', option.value)}
                  style={{
                    background: profile.style === option.value ? '#111' : '#fafafa',
                    border: profile.style === option.value ? 'none' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    color: profile.style === option.value ? '#fff' : '#666',
                    padding: '10px 16px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid}
            style={{
              width: '100%',
              background: isValid ? '#111' : '#e0e0e0',
              border: 'none',
              borderRadius: '12px',
              color: isValid ? '#fff' : '#999',
              padding: '16px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isValid ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
            }}
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}

function ProfileModal({ profile, onSave, onClose }) {
  const [editedProfile, setEditedProfile] = useState(profile);

  const updateField = (key, value) => {
    setEditedProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(editedProfile);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '24px',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111', margin: 0 }}>
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: '#999',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            &times;
          </button>
        </div>

        {PROFILE_FIELDS.map(field => (
          <div key={field.key} style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#111',
              marginBottom: '6px',
            }}>
              {field.label}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                value={editedProfile[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  minHeight: '70px',
                  background: '#fafafa',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  color: '#111',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            ) : (
              <input
                type="text"
                value={editedProfile[field.key]}
                onChange={(e) => updateField(field.key, e.target.value)}
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  background: '#fafafa',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  color: '#111',
                  padding: '12px 14px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            )}
          </div>
        ))}

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#111',
            marginBottom: '6px',
          }}>
            Insight style
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {STYLE_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => updateField('style', option.value)}
                style={{
                  background: editedProfile.style === option.value ? '#111' : '#fafafa',
                  border: editedProfile.style === option.value ? 'none' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  color: editedProfile.style === option.value ? '#fff' : '#666',
                  padding: '8px 14px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: '#fafafa',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              color: '#666',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              background: '#111',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              padding: '14px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

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

function TweetAnalyzer({ onLogout, initialTweet, initialReplies, sourceUrl, initialPlatform, profile, onEditProfile }) {
  const [tweetContent, setTweetContent] = useState(initialTweet || '');
  const [topReplies, setTopReplies] = useState(initialReplies || '');
  const [platform, setPlatform] = useState(initialPlatform || 'twitter');
  const [selectedMode, setSelectedMode] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const analyze = async (mode) => {
    if (!tweetContent.trim()) return;

    setSelectedMode(mode);
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, tweetContent, topReplies, profile, platform }),
      });

      const data = await response.json();
      const analysisResult = data.error ? `Error: ${data.error}` : data.result;
      setResult(analysisResult);

      // Save to history on successful analysis
      if (!data.error) {
        saveToHistory({
          mode,
          platform,
          content: tweetContent,
          replies: topReplies,
          result: analysisResult,
        });
      }
    } catch (err) {
      setResult(`Error: ${err.message}`);
    }

    setLoading(false);
  };

  const loadFromHistory = (item) => {
    setTweetContent(item.content);
    setTopReplies(item.replies || '');
    setPlatform(item.platform);
    setSelectedMode(item.mode);
    setResult(item.result);
    setShowHistoryModal(false);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportAsMarkdown = () => {
    const platformLabel = PLATFORMS.find(p => p.value === platform)?.label || 'Other';
    const modeLabel = MODES[selectedMode]?.label || selectedMode;
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const markdown = `# ${modeLabel} Analysis

**Date:** ${date}
**Platform:** ${platformLabel}
**Analyzed by:** TweetMiner

---

## Original Content

${tweetContent}

${topReplies ? `## Comments/Replies

${topReplies}

` : ''}---

## Analysis

${result}

---
*Generated with TweetMiner*
`;

    navigator.clipboard.writeText(markdown);
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
      {showProfileModal && (
        <ProfileModal
          profile={profile}
          onSave={onEditProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showHistoryModal && (
        <HistoryModal
          onClose={() => setShowHistoryModal(false)}
          onSelect={loadFromHistory}
        />
      )}

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
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setShowHistoryModal(true)}
            style={{
              background: '#fafafa',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              color: '#666',
              fontSize: '13px',
              cursor: 'pointer',
              padding: '8px 12px',
              fontFamily: 'inherit',
            }}
          >
            History
          </button>
          <button
            onClick={() => setShowProfileModal(true)}
            style={{
              background: '#fafafa',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              color: '#666',
              fontSize: '13px',
              cursor: 'pointer',
              padding: '8px 12px',
              fontFamily: 'inherit',
            }}
          >
            {profile.name || 'Profile'}
          </button>
          <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#999',
              fontSize: '13px',
              cursor: 'pointer',
              padding: '8px',
            }}
          >
            Logout
          </button>
        </div>
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
            Imported from {PLATFORMS.find(p => p.value === platform)?.label || 'extension'}
          </div>
        )}

        {/* Platform Selector */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#111',
            marginBottom: '8px',
          }}>
            Source
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {PLATFORMS.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPlatform(p.value)}
                style={{
                  background: platform === p.value ? '#111' : '#fafafa',
                  border: platform === p.value ? 'none' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  color: platform === p.value ? '#fff' : '#666',
                  padding: '8px 14px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontWeight: 700 }}>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#111',
            marginBottom: '8px',
          }}>
            Content
          </label>
          <textarea
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder={platform === 'reddit' ? 'Paste Reddit post here...' : platform === 'youtube' ? 'Paste video title/description here...' : platform === 'linkedin' ? 'Paste LinkedIn post here...' : platform === 'hackernews' ? 'Paste HN post here...' : 'Paste content here...'}
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

        {/* Comments Input */}
        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 600,
            color: '#111',
            marginBottom: '8px',
          }}>
            Comments / Replies <span style={{ fontWeight: 400, color: '#999' }}>(optional)</span>
          </label>
          <textarea
            value={topReplies}
            onChange={(e) => setTopReplies(e.target.value)}
            placeholder="Paste replies, comments, or thread..."
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
                    background: copied ? '#10b981' : '#fff',
                    border: copied ? 'none' : '1px solid #e0e0e0',
                    borderRadius: '8px',
                    color: copied ? '#fff' : '#666',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                  }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={exportAsMarkdown}
                  style={{
                    background: '#111',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                  }}
                >
                  Export MD
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
  const [urlParams, setUrlParams] = useState({ tweet: '', replies: '', source: '', platform: '' });
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    // Parse URL parameters (from extension)
    const params = new URLSearchParams(window.location.search);
    setUrlParams({
      tweet: params.get('tweet') || '',
      replies: params.get('replies') || '',
      source: params.get('source') || '',
      platform: params.get('platform') || '',
    });

    // Clear URL params after reading (cleaner URL)
    if (params.has('tweet')) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    // Load profile from localStorage
    const savedProfile = localStorage.getItem('tweetminer_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        setProfile(null);
      }
    }
    setProfileLoaded(true);

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

  const handleSaveProfile = (newProfile) => {
    setProfile(newProfile);
    localStorage.setItem('tweetminer_profile', JSON.stringify(newProfile));
  };

  if (checkingAuth || !profileLoaded) {
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

  // Show profile setup if no profile exists
  if (!profile || !profile.name) {
    return <ProfileSetup onSave={handleSaveProfile} initialProfile={profile} />;
  }

  return (
    <TweetAnalyzer
      onLogout={handleLogout}
      initialTweet={urlParams.tweet}
      initialReplies={urlParams.replies}
      sourceUrl={urlParams.source}
      initialPlatform={urlParams.platform}
      profile={profile}
      onEditProfile={handleSaveProfile}
    />
  );
}

export default App;
