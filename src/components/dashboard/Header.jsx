import { useState, useEffect } from "react";
import { Menu, Settings, User, LogOut } from "lucide-react";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest(".user-menu-container")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const toggleSidebar = () => {
    document.documentElement.classList.toggle("sidebar-open");
  };

  return (
    <header className="bg-[#222831]/80 backdrop-blur-md border-b border-gray-200 py-4 px-6 flex items-center justify-between text-[#EEEEEE] fixed top-0 right-0 left-0 z-20 lg:pl-72">
      <div className="flex items-center">
        <button
          className="lg:hidden mr-4 p-2 rounded-lg hover:bg-[#393E46]"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <h1 className="text-xl font-bold">Dev Ghost Writers</h1>
      </div>

      <div className="relative user-menu-container">
        <button
          className="flex items-center space-x-2 p-2 rounded-full hover:bg-[#393E46]"
          onClick={() => setShowMenu(!showMenu)}
        >
          <div className="w-8 h-8 bg-[#00ADB5] rounded-full flex items-center justify-center text-[#EEEEEE] font-medium">
            U
          </div>
          <span className="hidden md:inline">User</span>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-[#222831]/95 backdrop-blur-md border border-gray-200 rounded-lg shadow-lg py-1 z-10">
            <a
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 hover:bg-[#393E46] text-[#EEEEEE]"
            >
              <User size={16} className="mr-2" />
              Profile
            </a>
            <a
              href="/dashboard/setting"
              className="flex items-center px-4 py-2 hover:bg-[#393E46] text-[#EEEEEE]"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </a>
            <hr className="my-1 border-gray-200/20" />
            <a
              href="/"
              className="flex items-center px-4 py-2 hover:bg-[#393E46] text-[#00ADB5]"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
