import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircleIcon } from 'lucide-react';
export function Footer() {
  return <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Disclaimer */}
        <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircleIcon className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning-900 mb-1">
                Educational Purpose Only
              </p>
              <p className="text-sm text-warning-700">
                FinWise is an educational prototype. Market data may be delayed
                or simulated. Not investment advice. Please consult with a
                qualified financial advisor before making any investment
                decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-slate-600 hover:text-primary-600">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/goals" className="text-sm text-slate-600 hover:text-primary-600">
                  Goals
                </Link>
              </li>
              <li>
                <Link to="/simulator" className="text-sm text-slate-600 hover:text-primary-600">
                  Simulator
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Markets
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/markets/funds" className="text-sm text-slate-600 hover:text-primary-600">
                  Mutual Funds
                </Link>
              </li>
              <li>
                <Link to="/markets/crypto" className="text-sm text-slate-600 hover:text-primary-600">
                  Cryptocurrency
                </Link>
              </li>
              <li>
                <Link to="/markets/stocks-in" className="text-sm text-slate-600 hover:text-primary-600">
                  Indian Stocks
                </Link>
              </li>
              <li>
                <Link to="/markets/watchlist" className="text-sm text-slate-600 hover:text-primary-600">
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="text-sm text-slate-600 hover:text-primary-600">
                  Market News
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-600 hover:text-primary-600">
                  Disclosures
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600 text-center">
            © {new Date().getFullYear()} FinWise. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
}