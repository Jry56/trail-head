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
      console.error('Unhandled UI error:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-2xl mb-2">Something went wrong.</h1>
          <p className="text-stone-800 mb-6 max-w-prose">
            That page hit an unexpected error. Try reloading -- if it keeps happening, let us know at{' '}
            <a href="mailto:hello@trailheadsupply.example.com">hello@trailheadsupply.example.com</a>.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-pine-700 text-white px-5 py-2.5 rounded hover:bg-pine-800"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
