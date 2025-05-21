import { useState, useEffect } from "react";
import {
  Home,
  Code,
  Bug,
  FileSearch,
  RefreshCw,
  Image,
  X,
  Sparkles,
  Minimize2,
  BarChart2,
  History,
} from "lucide-react";
import logo from "../../assets/logo.png";

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("");

  // active item
  useEffect(() => {
    const updateActiveItem = () => {
      const pathname = window.location.pathname;

      if (pathname === "/dashboard" || pathname === "/dashboard/") {
        setActiveItem("dashboard");
        return;
      }

      const pathSegments = pathname.split("/").filter((segment) => segment);
      const lastSegment = pathSegments[pathSegments.length - 1];

      const matchingItem = menuItems.find((item) => item.id === lastSegment);
      if (matchingItem) {
        setActiveItem(matchingItem.id);
      } else {
        setActiveItem("dashboard");
      }
    };

    updateActiveItem();

    window.addEventListener("popstate", updateActiveItem);
    return () => window.removeEventListener("popstate", updateActiveItem);
  }, []);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: Home },
    { id: "snippet", name: "Snippet Generator", icon: Code },
    { id: "bugfixer", name: "Bug Fixer", icon: Bug },
    { id: "explain", name: "Code Explainer", icon: FileSearch },
    { id: "convert", name: "Code Converter", icon: RefreshCw },
    { id: "refactor", name: "Refactoring Hints", icon: Sparkles },
    { id: "minify", name: "Code Minify", icon: Minimize2 },
    { id: "complexity", name: "Complexity Score", icon: BarChart2 },
    { id: "image", name: "Image Generator", icon: Image },
    { id: "history", name: "History", icon: History },
  ];

  const closeSidebar = () => {
    document.documentElement.classList.remove("sidebar-open");
  };

  return (
    <aside className="w-64 bg-[#222831] text-[#EEEEEE] h-screen flex flex-col fixed left-0 top-0 z-30 sidebar-glassmorphism lg:translate-x-0 transition-transform duration-300 transform -translate-x-full sidebar-container">
      <div className="absolute inset-0 bg-gradient-to-b from-[#00ADB5]/20 to-transparent pointer-events-none z-0 sidebar-glow"></div>

      <div className="relative z-10 p-4 border-b border-[#393E46]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo.src} alt="AI Code Assistant Logo" className="mr-2" />
          </div>
          <button
            className="lg:hidden text-[#00ADB5] hover:text-[#EEEEEE] transition-colors"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto relative z-10 flex flex-col pt-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const href =
              item.id === "dashboard" ? "/dashboard" : `/dashboard/${item.id}`;
            const isActive = activeItem === item.id;

            return (
              <li key={item.id}>
                <a
                  href={href}
                  className={`flex items-center p-3 rounded-lg transition-all duration-300 sidebar-item ${
                    isActive
                      ? "bg-[#00ADB5]/30 text-[#EEEEEE] shadow-glow"
                      : "hover:bg-[#393E46]/70 hover:translate-x-1"
                  }`}
                  onClick={() => {
                    setActiveItem(item.id);
                    closeSidebar();
                  }}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-[#EEEEEE]" : "text-[#00ADB5]"
                    }`}
                  />
                  <span>{item.name}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#393E46] relative z-10 mt-auto"></div>

      <style jsx>{`
        .sidebar-glassmorphism {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          border-right: 1px solid rgba(0, 173, 181, 0.2);
        }

        .sidebar-glow {
          background: radial-gradient(
            circle at top right,
            rgba(0, 173, 181, 0.3),
            transparent 70%
          );
        }

        .shadow-glow {
          box-shadow: 0 0 15px rgba(0, 173, 181, 0.3);
        }

        .sidebar-item {
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
        }

        .sidebar-item:hover::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(0, 173, 181, 0.1),
            transparent
          );
          animation: shine 1.5s;
        }

        @keyframes shine {
          100% {
            left: 100%;
          }
        }
      `}</style>
    </aside>
  );
}
