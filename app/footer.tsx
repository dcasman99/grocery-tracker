"use client";
import appInfo from "../package.json";

const Footer = () => {
  return (
    <footer className="flex-none w-full border-t border-border mt-8">
      <div className="flex flex-col items-center my-4">
        <p>v{appInfo.version}</p>
      </div>
    </footer>
  );
};

export default Footer;
