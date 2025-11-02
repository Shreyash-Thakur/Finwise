import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
export function NotFound() {
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-slate-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button>
            <HomeIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>;
}