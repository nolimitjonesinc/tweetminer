import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { PROJECTS } from './projects';

function Dashboard({ onLogout, userName }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient gradient orbs */}
      <div style={{
        position: 'fixed',
        top: '-20%',
        right: '-10%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-30%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
      }} />

      {/* Noise texture overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        opacity: 0.03,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{
        position: 'relative',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
          }}>
            ⚡
          </div>
          <span style={{
            fontSize: '15px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'rgba(255,255,255,0.9)',
          }}>
            nolimitjones
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
        }}>
          <span style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: '"SF Mono", Monaco, monospace',
            letterSpacing: '0.02em',
          }}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              cursor: 'pointer',
              padding: '8px 14px',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div style={{
        position: 'relative',
        padding: '80px 32px 60px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <p style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '12px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {greeting()}{userName ? `, ${userName}` : ''}
          </p>
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Your arsenal awaits.
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '500px',
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
          }}>
            Tools built for velocity. Pick one and ship something today.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <main style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 32px 100px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '20px',
        }}>
          {PROJECTS.map((project, index) => (
            <Link
              key={project.id}
              to={project.path}
              style={{
                textDecoration: 'none',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + index * 0.1}s`,
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '16px',
                  padding: '32px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = project.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px -20px ${project.color}40`;
                  e.currentTarget.querySelector('.glow').style.opacity = '1';
                  e.currentTarget.querySelector('.arrow').style.transform = 'translateX(4px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.querySelector('.glow').style.opacity = '0';
                  e.currentTarget.querySelector('.arrow').style.transform = 'translateX(0)';
                }}
              >
                {/* Card glow effect */}
                <div
                  className="glow"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                  }}
                />

                {/* Icon */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: `linear-gradient(135deg, ${project.color}20 0%, ${project.color}05 100%)`,
                  border: `1px solid ${project.color}30`,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '24px',
                }}>
                  {project.icon}
                </div>

                {/* Content */}
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '10px',
                  letterSpacing: '-0.02em',
                }}>
                  {project.name}
                </h3>
                <p style={{
                  fontSize: '15px',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.5,
                  marginBottom: '28px',
                }}>
                  {project.description}
                </p>

                {/* Launch button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: project.color,
                }}>
                  <span>Launch</span>
                  <span
                    className="arrow"
                    style={{
                      transition: 'transform 0.3s ease',
                      fontSize: '16px',
                    }}
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* Coming Soon Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)',
              border: '1px dashed rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '280px',
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + PROJECTS.length * 0.1}s`,
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.1)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '24px', opacity: 0.3 }}>✦</span>
            </div>
            <p style={{
              fontSize: '15px',
              color: 'rgba(255,255,255,0.3)',
              textAlign: 'center',
              marginBottom: '8px',
            }}>
              More tools in the works
            </p>
            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.2)',
              textAlign: 'center',
            }}>
              Building in public
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        textAlign: 'center',
        padding: '40px 32px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.02em',
        }}>
          <span style={{ opacity: 0.6 }}>©</span> {new Date().getFullYear()} nolimitjones
          <span style={{ margin: '0 12px', opacity: 0.3 }}>·</span>
          <span style={{ opacity: 0.6 }}>Ship fast, iterate faster</span>
        </p>
      </footer>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
