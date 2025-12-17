import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PROJECTS, getProjectByPath } from './projects';

function ProjectSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentProject = getProjectByPath(location.pathname);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSelect = (project) => {
    setIsOpen(false);
    navigate(project.path);
  };

  const goToDashboard = () => {
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#111',
          border: '1px solid #222',
          borderRadius: '10px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '10px 14px',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          transition: 'all 0.2s ease',
          boxShadow: isOpen ? '0 0 0 2px rgba(99, 102, 241, 0.3)' : 'none',
        }}
        onMouseOver={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#333';
        }}
        onMouseOut={(e) => {
          if (!isOpen) e.currentTarget.style.borderColor = '#222';
        }}
      >
        <div style={{
          width: '22px',
          height: '22px',
          background: currentProject
            ? `linear-gradient(135deg, ${currentProject.color}40 0%, ${currentProject.color}20 100%)`
            : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
        }}>
          {currentProject?.icon || '⚡'}
        </div>
        <span style={{ letterSpacing: '-0.01em' }}>
          {currentProject?.name || 'nolimitjones'}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{
            marginLeft: '2px',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
          }}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
          />
        </svg>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          marginTop: '8px',
          background: '#111',
          border: '1px solid #222',
          borderRadius: '14px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset',
          minWidth: '260px',
          overflow: 'hidden',
          zIndex: 1000,
          animation: 'dropdownIn 0.2s ease',
        }}>
          <style>{`
            @keyframes dropdownIn {
              from { opacity: 0; transform: translateY(-8px) scale(0.96); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          {/* Dashboard link */}
          <button
            onClick={goToDashboard}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              padding: '14px 16px',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            <div style={{
              width: '28px',
              height: '28px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
            }}>
              ⚡
            </div>
            <div>
              <div style={{ fontWeight: 500 }}>All Projects</div>
              <div style={{ fontSize: '12px', opacity: 0.5, marginTop: '2px' }}>
                Back to dashboard
              </div>
            </div>
          </button>

          {/* Divider label */}
          <div style={{
            padding: '12px 16px 8px',
            fontSize: '11px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Tools
          </div>

          {/* Project list */}
          {PROJECTS.map(project => (
            <button
              key={project.id}
              onClick={() => handleSelect(project)}
              style={{
                width: '100%',
                background: currentProject?.id === project.id
                  ? `linear-gradient(90deg, ${project.color}15 0%, transparent 100%)`
                  : 'none',
                border: 'none',
                padding: '12px 16px',
                fontSize: '14px',
                color: currentProject?.id === project.id ? '#fff' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.15s ease',
                borderLeft: currentProject?.id === project.id
                  ? `2px solid ${project.color}`
                  : '2px solid transparent',
              }}
              onMouseOver={(e) => {
                if (currentProject?.id !== project.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseOut={(e) => {
                if (currentProject?.id !== project.id) {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                background: `linear-gradient(135deg, ${project.color}30 0%, ${project.color}10 100%)`,
                border: `1px solid ${project.color}40`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
              }}>
                {project.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{project.name}</div>
                <div style={{
                  fontSize: '12px',
                  opacity: 0.5,
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {project.description}
                </div>
              </div>
              {currentProject?.id === project.id && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: project.color,
                  borderRadius: '50%',
                  boxShadow: `0 0 8px ${project.color}`,
                }} />
              )}
            </button>
          ))}

          {/* Footer hint */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.25)',
          }}>
            <span style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '2px 5px',
              borderRadius: '4px',
              fontFamily: 'monospace',
            }}>
              esc
            </span>
            <span>to close</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSwitcher;
