import React from "react";

import { tagType, thirdweb } from "../assets";
import { daysLeft } from "../utils";

const FundCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  category,
  handleClick,
  count,
  index,
}) => {
  const remainingDays = daysLeft(deadline);

  return (
    <div
      className="sm:w-[288px] w-full rounded-[15px] bg-[#5369faf8] cursor-pointer shadow-xl border-2 border-sky-500"
      onClick={handleClick}
    >
      <img
        src={image}
        alt="fund"
        className="w-full h-[158px] object-cover rounded-[15px]"
      />

      <div className="flex flex-col p-4">
        <div className="flex flex-row items-center md-[18px]">
          <img
            src={tagType}
            alt="tag"
            className="w-[17px] h-[17px] object-ccontain"
          />
          <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[12px] text-[#131313]">
            {category}
          </p>
        </div>

        <div className="block mt-[20px]">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">
            {title}
          </h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#131313] text-left leading-[18px] truncate">
            {description}
          </p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-bold text-[14px] text-[#131313] leading-[22px]">
              {amountCollected}
            </h4>
            <p className="font-epilogue font-normal text-[12px] leading-[18px] text-[#131313] sm:max-w-[120px] truncate">
              Raised of {target}
            </p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#131313] leading-[22px]">
              {remainingDays > 0 ? remainingDays : "Over"}
            </h4>
            <p className="font-epilogue font-normal text-[12px] leading-[18px] text-[#131313] sm:max-w-[120px] truncate">
              Days Left
            </p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img
              src={thirdweb}
              alt="user"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#131313] truncate">
            By <span className="text-[#131313] font-bold">{owner}</span>
          </p>
        </div>

        <div className="flex flex-row items-center md-[18px]">
          <p className="mt-[10px] font-epilogue font-medium text-[15px] text-[#131313]">
            Created Campaigns : {count}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
