import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './FilmPreloader.css';

const DURATION_MS = 1000;

export default function FilmPreloader() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  const restartTimer = useCallback(() => {
    setVisible(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setVisible(false), DURATION_MS);
  }, []);

  useLayoutEffect(() => {
    restartTimer();
    return () => {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [location.key, restartTimer]);

  useEffect(() => {
    function handleInternalNavigation(event) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const link = event.target instanceof Element
        ? event.target.closest('a[href]')
        : null;
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      if (
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search &&
        destination.hash &&
        destination.hash !== window.location.hash
      ) {
        return;
      }

      restartTimer();
    }

    document.addEventListener('click', handleInternalNavigation, true);
    return () => document.removeEventListener('click', handleInternalNavigation, true);
  }, [restartTimer]);

  useLayoutEffect(() => {
    if (!visible) return undefined;

    const rootOverflow = document.documentElement.style.overflow;
    const bodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    return () => {
      document.documentElement.style.overflow = rootOverflow;
      document.body.style.overflow = bodyOverflow;
    };
  }, [location.key, visible]);

  if (!visible) return null;

  return (
    <div key={location.key} className="film-preloader" aria-hidden="true">
      <div className="film-preloader__content">
        <div className="film-preloader__reel-wrap">
          <span className="film-preloader__spark" />
          <svg
            className="film-preloader__reel"
            viewBox="0 0 160 160"
            role="presentation"
          >
            <circle cx="80" cy="80" r="73" fill="#F7EBDD" />
            <circle cx="80" cy="80" r="69" fill="none" stroke="#EFAE43" strokeWidth="1.5" />
            <g fill="#000000">
              <circle cx="80" cy="43" r="12" />
              <circle cx="115" cy="68" r="12" />
              <circle cx="102" cy="109" r="12" />
              <circle cx="58" cy="109" r="12" />
              <circle cx="45" cy="68" r="12" />
              <circle cx="80" cy="80" r="15" />
            </g>
            <circle cx="80" cy="80" r="7" fill="#EFAE43" />
          </svg>
        </div>
        <div className="film-preloader__strip" aria-hidden="true">
          <span />
        </div>
        <p className="film-preloader__wordmark">EXCEL MEDIA</p>
        <p className="film-preloader__tagline">EVERY FRAME HAS A STORY.</p>
      </div>
    </div>
  );
}

export class FilmPreloaderErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('Film preloader disabled after an error:', error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
