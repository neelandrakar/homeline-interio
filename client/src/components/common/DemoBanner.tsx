import React from 'react';
import { Sparkles, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemoBanner: React.FC = () => {
  return (
    <div className="bg-olive-800 text-olive-100 text-xs py-1.5 px-4 font-sans tracking-wide">
      <div className="max-w-site mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-olive-300 flex-shrink-0" />
          <span className="truncate">
            <strong className="text-white font-medium">Concept Demo by Nats LAB</strong> · Illustrative residential portfolio & AI lead engine for Homeline Interio
          </span>
        </div>
        <div className="flex items-center space-x-4 pl-3 flex-shrink-0">
          <Link
            to="/admin/login"
            className="inline-flex items-center text-olive-200 hover:text-white underline underline-offset-2 transition-colors"
          >
            <Shield className="w-3 h-3 mr-1" />
            Admin Demo
          </Link>
        </div>
      </div>
    </div>
  );
};
