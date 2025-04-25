import React from "react";

interface HeaderProps {
  left: string;
  right?: any;
}

const Header: React.FC<HeaderProps> = ({ left, right }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between py-2">
        <span className="xl:text-xl text-[10px] font-semibold primary">
          {left}
        </span>
        {right && (
          <span className="xl:text-lg text-[10px] text-gray-500 text-end">
            {right}
          </span>
        )}
      </div>
      <div className="border-b border-gray-300" />
    </div>
  );
};

export default Header;
