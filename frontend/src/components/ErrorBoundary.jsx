import { Component } from 'react';
// Shows a readable message instead of a blank white page if something crashes
export default class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ padding: '3rem 1rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h2>Something went wrong</h2>
        <p style={{ color: '#7a6a5c', margin: '1rem 0' }}>{String(this.state.error.message || this.state.error)}</p>
        <button onClick={() => window.location.assign('/')} style={{ padding: '.7rem 1.4rem', borderRadius: 999, border: 0, background: '#d9902f', fontWeight: 600, cursor: 'pointer' }}>Go to Home</button>
      </div>
    );
  }
}
