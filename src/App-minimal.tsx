import React from 'react';

// Minimal test version to diagnose black page issue
function App() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '2rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#fbbf24', fontSize: '3rem', marginBottom: '2rem' }}>
          🏴‍☠️ BLKOUT Liberation Platform
        </h1>

        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#34d399', marginBottom: '1rem' }}>Platform Status: LIVE</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6' }}>
            Community-owned liberation platform for Black queer communities
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            backgroundColor: '#374151',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #fbbf24'
          }}>
            <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>Creator Sovereignty</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399' }}>75%</p>
            <p>Minimum creator revenue share</p>
          </div>

          <div style={{
            backgroundColor: '#374151',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #34d399'
          }}>
            <h3 style={{ color: '#34d399', marginBottom: '1rem' }}>Democratic Governance</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>Active</p>
            <p>One member, one vote</p>
          </div>

          <div style={{
            backgroundColor: '#374151',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '2px solid #ec4899'
          }}>
            <h3 style={{ color: '#ec4899', marginBottom: '1rem' }}>Black Queer Joy</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>Celebrated</p>
            <p>Cultural authenticity</p>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#fbbf24', marginBottom: '1rem' }}>API Status</h3>
          <p style={{ color: '#34d399' }}>Backend: https://blkout-api.vercel.app ✅</p>
          <p style={{ color: '#34d399' }}>Frontend: https://blkout-platform.vercel.app ✅</p>
        </div>

        <div style={{
          backgroundColor: '#111827',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '2px solid #6366f1'
        }}>
          <h3 style={{ color: '#6366f1', marginBottom: '1rem' }}>Liberation Through Technology</h3>
          <p style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>
            "NOT EVERYTHING THAT IS FACED CAN BE CHANGED, BUT NOTHING CAN BE CHANGED UNTIL IT IS FACED."
          </p>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>— JAMES BALDWIN</p>
        </div>

        <footer style={{ marginTop: '3rem', color: '#6b7280' }}>
          <p>🏴‍☠️ BLKOUT Liberation Platform | Community Sovereignty | Democratic Governance</p>
        </footer>
      </div>
    </div>
  );
}

export default App;