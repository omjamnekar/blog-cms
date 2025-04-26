import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-primary-600">
              BlogCMS
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              A simple blog content management system
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-6">
            <Link to="/" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
              Dashboard
            </Link>
            <Link to="/create-post" className="text-gray-500 hover:text-gray-700 mb-2 sm:mb-0">
              Create Post
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} BlogCMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;