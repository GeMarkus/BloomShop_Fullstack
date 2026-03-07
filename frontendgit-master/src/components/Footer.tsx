const Footer: React.FC = () => (
  <footer className="border-t border-emerald-100/70 dark:border-gray-800 bg-white dark:bg-gray-950 backdrop-blur transition-colors duration-300">
    <div className="px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-600 dark:text-gray-300">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        
        <p className="text-gray-700 dark:text-gray-300">
          © <span>{new Date().getFullYear()}</span>{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            Bloom
          </span>{" "}
          — Minimal Plant Shop
        </p>

        <p className="opacity-80 text-gray-600 dark:text-gray-400">
          Web-Fullstack Develop
        </p>

      </div>
    </div>
  </footer>
);

export default Footer;