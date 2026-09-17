import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('Unhandled admin UI error:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-xl mb-2">Something went wrong.</h1>
          <p className="text-slate-500 mb-6">Reload the page. If it keeps happening, check the browser console.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-pine-700 text-white px-5 py-2.5 rounded hover:bg-pine-800"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
