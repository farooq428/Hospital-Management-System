import React from 'react';

const Footer = () => {
    // Determine the current year dynamically
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-teal-700 mt-12 w-full">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 text-center text-teal-200">
                
                {/* Footer Content */}
                <p className="text-sm">
                    &copy; {currentYear} EasyCare Hospital System. All rights reserved.
                </p>
                <div className="flex justify-center space-x-4 mt-1 text-xs">
                    <a href="/privacy" className="hover:text-white transition duration-150">Privacy Policy</a>
                    <span className="text-teal-400">|</span>
                    <a href="/terms" className="hover:text-white transition duration-150">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;