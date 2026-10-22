import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <span className="font-serif text-7xl sm:text-8xl text-olive-700/40 block font-light">
          404
        </span>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl text-charcoal-900 font-semibold">
            Page Not Found
          </h1>
          <p className="text-sm text-charcoal-600 leading-relaxed font-sans">
            The space or architectural concept you are looking for does not exist or may have been relocated.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-olive-700 hover:bg-olive-800 text-white text-xs uppercase tracking-wider font-semibold rounded-lg shadow-soft transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center px-6 py-3 bg-white hover:bg-base-surface text-charcoal-800 border border-base-border text-xs uppercase tracking-wider font-semibold rounded-lg transition-colors"
          >
            <Compass className="w-4 h-4 mr-2" />
            <span>Explore Designs</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
