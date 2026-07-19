import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught rendering exception:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('theme'); // Reset custom state triggers
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6 transition-colors duration-200 font-sans">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="p-4 bg-rose-500/10 dark:bg-rose-500/5 border border-rose-500/20 text-rose-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto shadow-sm">
              <ShieldAlert className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <span className="font-mono text-xs text-rose-500 font-bold tracking-widest uppercase">Error 500</span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900 dark:text-white tracking-tight">
                Render Interruption
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                An unexpected layout rendering exception was caught by the NetVentures self-healing schema wrapper. Static indices remain secured.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl text-left">
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Exception Trace</p>
                <p className="text-xs font-mono text-rose-500 mt-1 break-all select-all font-medium">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer hover:opacity-90 inline-flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reload Page
              </button>
              <button 
                onClick={this.handleReset}
                className="px-5 py-2.5 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900"
              >
                Return to home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
