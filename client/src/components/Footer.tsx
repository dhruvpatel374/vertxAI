const Footer = () => {
  return (
    <footer className="bg-base-200 py-8  ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Column 1: About VertxAI */}
          <div>
            <h4 className="text-lg font-semibold mb-4 tracking-widest">
              VertxAI
            </h4>
            <p className="text-base-content">
              © {new Date().getFullYear()} VertxAI. All rights reserved.
            </p>
            <p>
              Crafted with vision by{" "}
              <a
                href="https://www.linkedin.com/in/dhruv-patel-b5029b271"
                target="_blank"
                rel="noopener noreferrer"
                className=" hover:text-white transition-colors duration-300"
              >
                Dhruv Patel
              </a>
            </p>
          </div>

          {/* Column 3: Company & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="list-none">
              <li>
                <a href="/" className="text-base-content ">
                  About Us
                </a>
              </li>
              <li>
                <a href="/" className="text-base-content ">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/" className="text-base-content ">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/" className="text-base-content ">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
