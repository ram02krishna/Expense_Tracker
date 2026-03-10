import React, { useContext } from "react";
import { SIDE_MENU_DATA } from "../../utils/data";
import { UserContext } from "../../context/UserContextDefinition";
import { useNavigate } from "react-router-dom";
import CharAvatar from "../Cards/CharAvatar";

const SideMenu = ({ activeMenu, onClose }) => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path === "/logout") {
      handleLogout();
      return;
    }

    // Close mobile menu if it's open (must happen before potential early return or navigation)
    if (onClose) {
      onClose();
    }

    navigate(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex flex-col shadow-sm transition-all duration-300 lg:fixed lg:top-[61px] lg:left-0 lg:h-[calc(100vh-61px)] lg:z-50">

      {/* Profile section */}
      <div className="flex flex-col items-center justify-center gap-3 mt-8 mb-8">
        <div className="relative">
          {!user?.profileImageUrl ? (
            <CharAvatar
              fullName={user?.fullName || "User"}
              width="w-20"
              height="h-20"
              style="text-xl font-semibold"
            />
          ) : (
            <img
              src={user?.profileImageUrl}
              alt="Profile Image"
              className="w-20 h-20 rounded-full object-cover shadow-md ring-4 ring-gray-50 dark:ring-gray-700"
            />
          )}
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>

        <div className="text-center">
          <h5 className="text-gray-900 dark:text-white font-semibold text-base">
            {user?.fullName || "User"}
          </h5>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-medium mt-0.5">
            Free Member
          </p>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex-1 px-4 space-y-2 overflow-y-auto">
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-3 text-sm py-3 px-4 rounded-xl transition-all duration-200 group ${activeMenu === item.label
                ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-semibold"
                : "text-gray-600 dark:text-gray-300"
              }`}
            onClick={() => handleClick(item.path)}
          >
            {item.icon && (
              <item.icon
                className={`text-lg ${activeMenu === item.label
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  }`}
              />
            )}
            <span>{item.label}</span>

            {/* Active Indicator */}
            {activeMenu === item.label && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></div>
            )}
          </button>
        ))}
      </div>

      {/* Footer/Logout Area could go here */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-300 dark:text-gray-600">v2.1.1</p>
      </div>
    </div>
  );
};

export default SideMenu;
