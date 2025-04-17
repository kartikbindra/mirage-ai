import React from "react";
import { Outlet } from "react-router-dom";
import {
  HomeIcon,
  Shield,
  PaintRoller,
  Puzzle,
  TestTube2,
  Sparkles,
  Settings,
} from "lucide-react";
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/themeProvider.jsx";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";

const SidebarLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const handleChange = () => {
    toggleTheme();
  };
  const currUrl = useLocation().pathname.split("/")[1];
  return (
    <div className="bg-background dark:bg-background dark:text-foreground text-foreground h-screen w-screen">
      <div className="flex flex-row h-screen w-screen overflow-hidden z-10 absolute">
        <button
          className="absolute flex gap-2 items-center justify-center font-medium text-md px-4 py-2 border-1 rounded-md right-4 top-4  hover:bg-foreground/15 transition duration-300 hover:cursor-pointer"
          onClick={handleChange}
        >
          {theme === "dark" ? <Moon /> : <Sun />}
        </button>
        <div className="w-1/4 dark:bg-[#1A1A1A] bg-[#EAEAEA] text-foreground m-2 rounded-2xl flex flex-col gap-4 items-center justify-between p-4">
          <div className="flex flex-col gap-4 justify-center w-full mx-2">
            <div className="flex flex-col gap-4 justify-center w-full mx-2">
              <h1 className="text-2xl font-[Pixelify_Sans]">mirage.ai</h1>
              <div className="w-full h-[1px] bg-foreground/15"></div>
            </div>

            <div className="flex flex-col gap-0 justify-center w-full">
              <Link
                className={`flex gap-2 items-center justify-start w-full text-lg items-center justify-center hover:bg-foreground/5 transition duration-300 rounded-lg px-3 py-2 ${
                  currUrl == "home" ? "bg-foreground/5" : ""
                }`}
                to={"/home"}
              >
                <HomeIcon /> Home
              </Link>
              <Link
                className={`flex gap-2 items-center justify-start w-full text-lg items-center justify-center hover:bg-foreground/5 transition duration-300 rounded-lg px-3 py-2 ${
                  currUrl == "cloak-personal-images" ? "bg-foreground/5" : ""
                }`}
                to={"/cloak-personal-images"}
              >
                <Shield /> Cloak Personal Images
              </Link>
              <Link
                className={`flex gap-2 items-center justify-start w-full text-lg items-center justify-center hover:bg-foreground/5 transition duration-300 rounded-lg px-3 py-2 ${
                  currUrl == "cloak-art" ? "bg-foreground/5" : ""
                }`}
                to={"/cloak-art"}
              >
                <PaintRoller /> Cloak Your Art
              </Link>
              <Link
                className={`flex gap-2 items-center justify-start w-full text-lg items-center justify-center hover:bg-foreground/5 transition duration-300 rounded-lg px-3 py-2 ${
                  currUrl == "extension" ? "bg-foreground/5" : ""
                }`}
                to={"/extension"}
              >
                <IoExtensionPuzzleSharp /> Chrome Extension
              </Link>
              <Link
                className={`flex gap-2 items-center justify-start w-full text-lg items-center justify-center hover:bg-foreground/5 transition duration-300 rounded-lg px-3 py-2 ${
                  currUrl == "playground" ? "bg-foreground/5" : ""
                }`}
                to={"/playground"}
              >
                <TestTube2 /> Playground
              </Link>
            </div>
            <div className="flex flex-col gap-0 justify-center w-full">
              <p className="text-md text-foreground/50 mx-2">History</p>
              <Link
                className={`text-foreground/50 flex gap-2 items-center justify-start w-full text-lg items-center justify-center hover:bg-foreground/5 transition duration-300 rounded-lg px-3 py-2`}
              >
                <Sparkles /> New Chat
              </Link>
              <Link
                className={`text-foreground/50 flex gap-2 items-center justify-start w-full text-lg items-center justify-center hover:bg-foreground/5 transition duration-300 rounded-lg px-3 py-2`}
              >
                <Sparkles /> Personal Image Cloaking - ...
              </Link>
            </div>
          </div>
          <div className="flex gap-2 w-full text-foreground/50 hover:text-foreground hover:cursor-pointer hover:bg-foreground/5 transition duration-300 rounded-lg px-3 py-2">
            <Settings /> Settings
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
