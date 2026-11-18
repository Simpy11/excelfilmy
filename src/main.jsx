import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import FilmPreloader, { FilmPreloaderErrorBoundary } from './FilmPreloader.jsx';
import './style.css';
import './banner-images.css';

class AppErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('Excel Media page failed to render:', error);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <main
        role="alert"
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeContent: 'center',
          gap: '1rem',
          padding: '2rem',
          background: '#F7EBDD',
          color: '#193326',
          textAlign: 'center',
        }}
      >
        <h1>This page could not be displayed.</h1>
        <p>Refresh the page to try again.</p>
        <button onClick={() => window.location.reload()}>Refresh page</button>
      </main>
    );
  }
}

function SiteRoot() {
  return (
    <BrowserRouter>
      <>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
        <FilmPreloaderErrorBoundary>
          <FilmPreloader />
        </FilmPreloaderErrorBoundary>
      </>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteRoot />
  </React.StrictMode>,
);

