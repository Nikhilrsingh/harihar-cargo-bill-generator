import React, { useState, useEffect, useRef } from 'react';

// Custom Searchable Dropdown with Scrollbar & MRU Priority
export function SearchableDropdown({ value, onChange, options, placeholder, onSelectExtra }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleSelect = (opt) => {
    setSearchTerm(opt);
    onChange(opt);
    if (onSelectExtra) onSelectExtra(opt);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        style={{
          width: '100%',
          padding: '6px 8px',
          fontSize: '0.8rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box'
        }}
      />
      {isOpen && filteredOptions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          maxHeight: '140px', // Shows ~3-4 items max
          overflowY: 'auto',
          backgroundColor: '#fff',
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1050,
          marginTop: '2px'
        }}>
          {filteredOptions.map((opt, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(opt)}
              style={{
                padding: '8px 10px',
                fontSize: '0.8rem',
                cursor: 'pointer',
                borderBottom: idx === filteredOptions.length - 1 ? 'none' : '1px solid #f1f5f9',
                backgroundColor: '#fff',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#e0f2fe'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Toast Notification Component
export function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgColor = type === 'error' ? '#ef4444' : type === 'info' ? '#3b82f6' : '#16a34a';

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: bgColor,
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
      fontWeight: 'bold',
      fontSize: '0.88rem',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'fadeIn 0.2s ease-in-out'
    }}>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        style={{ background: 'none', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
      >
        ✕
      </button>
    </div>
  );
}