import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
}

export default class AdminErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              Une erreur est survenue
            </h1>
            <p className="text-sm text-slate-500 mb-6">
              Le tableau de bord a rencontré une erreur inattendue.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="admin-btn-primary"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
