import { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [activePath, setActivePath] = useState("/");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebar, setIsSidebar] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeIcon, setActiveIcon] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const navbarRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const links = [
    { name: "Home", href: "/", icon: "home" },
    { name: "Contact Us", href: "/contactus", icon: "mail" },
    { name: "Blog", href: "/blog", icon: "document" },
    { name: "Pricing", href: "/pricing", icon: "dollar" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }

      if (window.innerWidth < 640 && isSidebar) {
        setIsSidebar(false);
        setIsExpanded(false);
      }
    };

    setActivePath(window.location.pathname);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen, isSidebar]);

  useEffect(() => {
    const handleScroll = () => {
      const shouldEnableSidebar = windowWidth >= 640;

      if (window.scrollY > 50 && !isSidebar && shouldEnableSidebar) {
        setIsScrolled(true);
        setIsAnimating(true);
        setIsSidebar(true);

        setTimeout(() => {
          setIsAnimating(false);
        }, 1000);
      } else if (window.scrollY <= 50 && isSidebar) {
        setIsSidebar(false);
        setIsExpanded(false);
        setIsScrolled(false);
      } else if (window.scrollY > 50 && !shouldEnableSidebar) {
        setIsScrolled(true);
      } else if (window.scrollY <= 50 && !shouldEnableSidebar) {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSidebar, windowWidth]);

  const isActive = (path) => {
    if (path === "/" && activePath === "/") {
      return true;
    }
    return path !== "/" && activePath.startsWith(path);
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "home":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case "mail":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case "document":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "dollar":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "thunder":
        return (
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const AnimationIndicator = () => {
    if (!isAnimating) return null;

    return (
      <div className="fixed z-60 pointer-events-none">
        <div className="bg-teal-500 w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-navbar-transition"></div>
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobileMenuOpen &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  if (!isSidebar) {
    return (
      <>
        <nav
          ref={navbarRef}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolled
              ? "h-12 sm:h-14 shadow-md bg-[#222831] bg-opacity-95"
              : "h-14 sm:h-16 overflow-hidden"
          }`}
        >
          {!isScrolled && (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#222831] to-transparent"></div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#393E46] to-transparent opacity-50"></div>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ADB5] to-transparent opacity-10"></div>
            </>
          )}

          <div className="max-w-7xl mx-auto px-3 sm:px-4 h-full">
            <div className="flex items-center justify-center h-full relative z-20">
              <div className="flex items-center justify-center">
                <a href="/" className="flex items-center mr-3 md:mr-6">
                  <img
                    src={logo.src}
                    alt="Logo"
                    className="h-20 sm:h-20 w-auto object-contain"
                  />
                </a>

                <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8">
                  {links.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className={`font-medium uppercase text-sm lg:text-base transition-all duration-300 relative menu-item ${
                        isActive(link.href)
                          ? "text-teal-400"
                          : "text-gray-100 hover:text-teal-300"
                      }`}
                      onMouseEnter={() => setActiveHover(link.name)}
                      onMouseLeave={() => setActiveHover(null)}
                    >
                      {link.name}

                      {isActive(link.href) && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-teal-400 rounded-full"></span>
                      )}

                      <span className="menu-glow"></span>
                      <span className="menu-fill-effect"></span>
                      <span className="menu-border-left"></span>
                      <span className="menu-border-top"></span>
                      <span className="menu-border-right"></span>
                      <span className="menu-border-bottom"></span>
                    </a>
                  ))}

                  <a
                    href="/signin"
                    className="ml-2 lg:ml-4 px-3 lg:px-4 py-1.5 lg:py-2 bg-teal-500 text-white text-xs lg:text-sm rounded-md hover:bg-teal-600 transition-colors whitespace-nowrap flex items-center relative overflow-hidden font-medium button-item"
                  >
                    <svg
                      className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Login
                    <span className="button-pulse"></span>
                    <span className="button-shine"></span>
                  </a>
                </div>
              </div>

              <div className="md:hidden absolute right-0">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-teal-400 focus:outline-none"
                  aria-expanded={isMobileMenuOpen}
                >
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    {isMobileMenuOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 left-0 right-0 mt-12 sm:mt-14 md:hidden bg-[#222831] shadow-lg max-h-[80vh] overflow-y-auto z-40 ${
              isScrolled ? "block" : "block"
            }`}
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm sm:text-base font-medium relative overflow-hidden mobile-menu-item ${
                    isActive(link.href)
                      ? "text-teal-400 bg-[#393E46]"
                      : "text-gray-100 hover:text-teal-300 hover:bg-[#393E46]/50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{getIcon(link.icon)}</span>
                  {link.name}
                  <span className="mobile-menu-highlight"></span>
                  <span className="mobile-menu-glow"></span>
                </a>
              ))}
              <a
                href="/signin"
                className="flex items-center px-3 py-2 rounded-md text-sm sm:text-base font-medium bg-teal-500 text-white hover:bg-teal-600 relative overflow-hidden mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">{getIcon("thunder")}</span>
                Login
                <span className="mobile-button-pulse"></span>
                <span className="mobile-button-shine"></span>
              </a>
            </div>
          </div>
        )}

        <style jsx>{`
          /* Desktop menu item styles */
          .menu-item {
            position: relative;
            overflow: hidden;
            padding: 0.25rem 0.5rem;
            z-index: 1;
          }

          /* Fill effect from bottom */
          .menu-fill-effect {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 0;
            background-color: rgba(45, 212, 191, 0.1);
            transition: height 0.4s cubic-bezier(0.19, 1, 0.22, 1);
            pointer-events: none;
            z-index: -1;
            border-radius: 4px;
          }

          .menu-item:hover .menu-fill-effect {
            height: 100%;
          }

          /* Glowing effect */
          .menu-glow {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 4px;
            opacity: 0;
            background: radial-gradient(
              circle at center,
              rgba(45, 212, 191, 0.3) 0%,
              rgba(45, 212, 191, 0) 70%
            );
            transition: opacity 0.4s ease;
            pointer-events: none;
            z-index: -2;
          }

          .menu-item:hover .menu-glow {
            opacity: 1;
          }

          /* Border animations */
          .menu-border-left,
          .menu-border-top,
          .menu-border-right,
          .menu-border-bottom {
            position: absolute;
            background-color: rgba(45, 212, 191, 0.5);
            transition: transform 0.3s ease;
            pointer-events: none;
          }

          .menu-border-left {
            left: 0;
            top: 0;
            width: 1px;
            height: 100%;
            transform: scaleY(0);
            transform-origin: top;
          }

          .menu-border-top {
            left: 0;
            top: 0;
            width: 100%;
            height: 1px;
            transform: scaleX(0);
            transform-origin: left;
          }

          .menu-border-right {
            right: 0;
            top: 0;
            width: 1px;
            height: 100%;
            transform: scaleY(0);
            transform-origin: bottom;
          }

          .menu-border-bottom {
            left: 0;
            bottom: 0;
            width: 100%;
            height: 1px;
            transform: scaleX(0);
            transform-origin: right;
          }

          .menu-item:hover .menu-border-left {
            transform: scaleY(1);
            transition-delay: 0s;
          }

          .menu-item:hover .menu-border-top {
            transform: scaleX(1);
            transition-delay: 0.1s;
          }

          .menu-item:hover .menu-border-right {
            transform: scaleY(1);
            transition-delay: 0.2s;
          }

          .menu-item:hover .menu-border-bottom {
            transform: scaleX(1);
            transition-delay: 0.3s;
          }

          /* Login button styles */
          .button-item {
            overflow: hidden;
            position: relative;
            z-index: 1;
          }

          /* Button shine effect */
          .button-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            transform: skewX(-25deg);
            transition: all 0.8s ease;
            pointer-events: none;
          }

          .button-item:hover .button-shine {
            left: 150%;
            transition: all 0.8s ease;
          }

          /* Button pulse effect */
          .button-pulse {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(13, 148, 136, 0.3);
            border-radius: 4px;
            opacity: 0;
            transform: scale(1);
            pointer-events: none;
          }

          .button-item:hover .button-pulse {
            animation: buttonPulse 1.5s ease-out infinite;
          }

          @keyframes buttonPulse {
            0% {
              opacity: 0.2;
              transform: scale(0.95);
            }
            70% {
              opacity: 0;
              transform: scale(1.05);
            }
            100% {
              opacity: 0;
              transform: scale(1.05);
            }
          }

          /* Mobile menu item effects */
          .mobile-menu-item {
            position: relative;
            overflow: hidden;
            z-index: 1;
          }

          .mobile-menu-highlight {
            position: absolute;
            top: 0;
            left: 0;
            width: 0;
            height: 100%;
            background: linear-gradient(
              to right,
              rgba(45, 212, 191, 0.15),
              rgba(28, 193, 172, 0.05)
            );
            transition: width 0.3s ease-out;
            z-index: -1;
            pointer-events: none;
          }

          .mobile-menu-item:hover .mobile-menu-highlight {
            width: 100%;
          }

          .mobile-menu-glow {
            position: absolute;
            width: 30px;
            height: 100%;
            top: 0;
            left: -30px;
            background: linear-gradient(
              to right,
              rgba(45, 212, 191, 0),
              rgba(45, 212, 191, 0.3),
              rgba(45, 212, 191, 0)
            );
            z-index: -1;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease-out;
          }

          .mobile-menu-item:hover .mobile-menu-glow {
            opacity: 1;
            animation: glowSweep 1.5s ease-in-out infinite;
          }

          @keyframes glowSweep {
            0% {
              left: -30px;
            }
            100% {
              left: 110%;
            }
          }

          /* Mobile login button effects */
          .mobile-menu-button {
            position: relative;
            overflow: hidden;
            z-index: 1;
          }

          .mobile-button-pulse {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(13, 148, 136, 0.5);
            opacity: 0;
            transform: scale(1);
            pointer-events: none;
          }

          .mobile-button-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
              to right,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.3) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            transform: skewX(-25deg);
            transition: all 0.8s ease;
            pointer-events: none;
          }

          .mobile-menu-button:hover .mobile-button-shine {
            left: 150%;
            transition: all 0.8s ease;
          }

          .mobile-menu-button:hover .mobile-button-pulse {
            animation: mobileButtonPulse 1.5s ease-out infinite;
          }

          @keyframes mobileButtonPulse {
            0% {
              opacity: 0.2;
              transform: scale(0.95);
            }
            70% {
              opacity: 0;
              transform: scale(1.05);
            }
            100% {
              opacity: 0;
              transform: scale(1.05);
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <AnimationIndicator />

      <div
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 z-50 ${
          isExpanded ? "hidden" : "block"
        } transition-all duration-500 ${
          isAnimating ? "animate-appear-from-top" : ""
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onClick={() => setIsExpanded(true)}
      >
        <button
          className="bg-teal-500 text-white rounded-r-md shadow-md hover:bg-teal-600 transition-all duration-300 flex items-center justify-center sidebar-toggle"
          style={{ padding: "0.8rem 0.4rem" }}
          aria-label="Expand menu"
        >
          <span className="text-2xl sm:text-3xl font-bold">»</span>

          <span className="sidebar-toggle-pulse"></span>
        </button>
      </div>

      <nav
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 bg-[#222831] shadow-md rounded-r-lg z-50 transition-all duration-500 ${
          isExpanded
            ? "opacity-100 visible translate-x-0"
            : "opacity-0 invisible -translate-x-full"
        }`}
        onMouseLeave={() => {
          setIsExpanded(false);
          setActiveIcon(null);
        }}
      >
        <div className="py-2 sm:py-3 px-1">
          <ul className="space-y-3 sm:space-y-5">
            {links.map((link) => (
              <li key={link.name} className="relative">
                <a
                  href={link.href}
                  className={`flex items-center justify-center p-1.5 sm:p-2 transition-colors rounded-md font-medium sidebar-icon ${
                    isActive(link.href)
                      ? "text-teal-400"
                      : "text-gray-100 hover:text-teal-300 hover:bg-[#393E46]/50"
                  }`}
                  title={link.name}
                  onMouseEnter={() => setActiveIcon(link.name)}
                  onMouseLeave={() => setActiveIcon(null)}
                  onClick={() => {
                    if (windowWidth < 1024) {
                      setIsExpanded(false);
                      setActiveIcon(null);
                    }
                  }}
                >
                  <span className="inline-flex items-center justify-center">
                    {getIcon(link.icon)}
                  </span>

                  {activeIcon === link.name && (
                    <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 rounded whitespace-nowrap font-medium tooltip">
                      {link.name}

                      <span className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-800"></span>
                    </div>
                  )}

                  <span className="sidebar-icon-glow"></span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 sm:mt-5 pt-1 sm:pt-2 flex justify-center">
            <a
              href="/signin"
              className="p-1.5 sm:p-2 text-teal-400 hover:text-teal-300 hover:bg-[#393E46]/50 rounded-md transition-colors font-medium sidebar-icon"
              title="Login"
              onMouseEnter={() => setActiveIcon("login")}
              onMouseLeave={() => setActiveIcon(null)}
              onClick={() => {
                if (windowWidth < 1024) {
                  setIsExpanded(false);
                  setActiveIcon(null);
                }
              }}
            >
              {getIcon("thunder")}

              {activeIcon === "login" && (
                <div className="absolute left-full ml-2 bg-gray-800 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 rounded whitespace-nowrap font-medium tooltip">
                  Login
                  <span className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-gray-800"></span>
                </div>
              )}

              <span className="sidebar-icon-glow"></span>
            </a>
          </div>
        </div>
      </nav>

      <style jsx>{`
        /* Sidebar animations */
        @keyframes navbarTransition {
          0% {
            top: 12px;
            left: 50%;
            transform: translateX(-50%);
          }
          100% {
            top: 50%;
            left: 0;
            transform: translate(0, -50%);
          }
        }

        @media (min-width: 640px) {
          @keyframes navbarTransition {
            0% {
              top: 14px;
              left: 50%;
              transform: translateX(-50%);
            }
            100% {
              top: 50%;
              left: 0;
              transform: translate(0, -50%);
            }
          }
        }

        @keyframes appearFromTop {
          0% {
            opacity: 0;
            top: 0;
            transform: translateY(-100%);
          }
          20% {
            opacity: 1;
            top: 7px;
            transform: translateY(0);
          }
          100% {
            opacity: 1;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .animate-navbar-transition {
          animation: navbarTransition 1s ease-in-out forwards;
        }

        .animate-appear-from-top {
          animation: appearFromTop 0.8s ease-in-out forwards;
        }

        /* Sidebar toggle button effect */
        .sidebar-toggle {
          position: relative;
          overflow: hidden;
        }

        .sidebar-toggle-pulse {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255, 255, 255, 0.2);
          opacity: 0;
          transform: scale(0.95);
          pointer-events: none;
        }

        .sidebar-toggle:hover .sidebar-toggle-pulse {
          animation: sidebarTogglePulse 1.5s ease-out infinite;
        }

        @keyframes sidebarTogglePulse {
          0% {
            opacity: 0.3;
            transform: scale(0.95);
          }
          70% {
            opacity: 0;
            transform: scale(1.05);
          }
          100% {
            opacity: 0;
            transform: scale(1.05);
          }
        }

        /* Sidebar icon hover effects */
        .sidebar-icon {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .sidebar-icon-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          background: radial-gradient(
            circle at center,
            rgba(45, 212, 191, 0.5) 0%,
            rgba(45, 212, 191, 0) 70%
          );
          transform: scale(0);
          opacity: 0;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .sidebar-icon:hover .sidebar-icon-glow {
          opacity: 0.8;
          transform: scale(1.5);
        }

        /* Tooltip animation */
        .tooltip {
          animation: tooltipAppear 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }

        @keyframes tooltipAppear {
          0% {
            opacity: 0;
            transform: translateX(-10px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
