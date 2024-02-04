import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; //useLocation used to pick up the state comming from routing
import { useContract } from "@thirdweb-dev/react";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { CustomButton, CountBox, Loader } from "../components";
import { calculateBarPercentage, daysLeft } from "../utils";
import { thirdweb, tagType, deleteIcon } from "../assets";

const CampaignDetails = () => {
  const { state } = useLocation(); //retriving the state received through routing
  const { donate, getDonations, contract, address } = useStateContext();
  console.log(state);
  console.log(address);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [donators, setDonators] = useState([]);

  const [complain, setComplain] = useState({
    srno: state.index,
    userid: address,
    campaignuserid: state.owner,
    category: state.category,
    reason: "",
  });

  const [allComplains, setAllComplains] = useState([]);

  console.log(complain);

  const remainingDays = daysLeft(state.deadline);

  const fetchDonators = async () => {
    const data = await getDonations(state.pId);
    setDonators(data);

    console.log(data);
  };

  useEffect(() => {
    if (contract) fetchDonators();
  }, [contract, address]);

  useEffect(() => {
    fetch("https://gaven-blockchain-crowd-funding-api.vercel.app/complains")
      .then((res) => res.json())
      .then((data) => setAllComplains(data))
      .catch((err) => console.error("Error", err));
  }, []);

  console.log(allComplains);

  const filteredComplains = allComplains.filter(
    (item) => item.srno === state.index
  );

  console.log(filteredComplains);

  const ownerComplaintsCount = allComplains.filter(
    (item) => item.campaignuserid === state.owner
  ).length;

  const handleDonate = async () => {
    //making the contract call , make it async because contract calls take sometime
    setIsLoading(true);

    await donate(state.pId, amount);
    navigate("/");
    setIsLoading(false);
  };

  const handleAddComplain = async () => {
    console.log("Before fetch - Complain state:", complain);
    try {
      const response = await fetch(
        "https://gaven-blockchain-crowd-funding-api.vercel.app/complains/givecomplain",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            srno: state.index,
            userid: address,
            campaignuserid: state.owner,
            category: state.category,
            reason: complain.reason,
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
        );
      }

      const data = await response.json();
      console.log("Success:", data);
      setComplain({ ...complain, reason: "" });

      setAllComplains([...allComplains, complain]);
    } catch (error) {
      console.error("Error while sending complain:", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const shouldDelete = window.confirm(
        "Are you sure you want to delete this complain?"
      );

      if (!shouldDelete) {
        return;
      }

      const response = await fetch(
        `https://gaven-blockchain-crowd-funding-api.vercel.app/complains/deletecomplain/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(
          `HTTP error! Status: ${response.status}, Message: ${errorMessage}`
        );
      }

      const deletedComplain = await response.json();
      console.log("Complain deleted successfully:", deletedComplain);

      const newFilteredComplains = allComplains.filter(
        (complain) => complain._id != id
      );
      setAllComplains(newFilteredComplains);
    } catch (error) {
      console.log("Error while deleting", error.message);
    }
  };

  return (
    <div>
      {isLoading && <Loader />}

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img
            src={state.image}
            alt="campaign"
            className="w-full h-[410px] object-cover rounded-xl"
          />
          <div className="relative w-full rounded-xl h-[20px] bg-[#3a3a43] mt-2">
            <div
              className="absolute h-full rounded-xl bg-[#4acd8d] flex items-center"
              style={{
                width: `${calculateBarPercentage(
                  state.target,
                  state.amountCollected
                )}%`,
                maxWidth: "100%",
              }}
            >
              <strong className="text-[#131313] font-semibold pl-2">
                {calculateBarPercentage(state.target, state.amountCollected)}%
              </strong>
            </div>
          </div>
        </div>

        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
          <CountBox
            title="Days Left"
            value={remainingDays > 0 ? remainingDays : "Over"}
          />
          <CountBox
            title={`Raised of ${state.target}`}
            value={state.amountCollected}
          />
          <CountBox title="Total Backers" value={donators.length} />
        </div>
      </div>

      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-2 flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Creator
            </h4>
            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img
                  src={thirdweb}
                  alt="user"
                  className="w-[60%] h-[60%] object-contain"
                />
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-black break-all">
                  {state.owner}
                </h4>
                <p className="mt-4px font-epilogue font-normal text-[12px] text-[#131313]">
                  Has created {state.count}{" "}
                  {state.count == 1 ? "Campaign" : "Campaign's"} in the Past
                </p>
              </div>
            </div>
          </div>

          <div className="mt-[2px] font-epilogue border-solid border  border-red-500 px-14 font-normal text-[15px] text-[#bf0606] ">
            Has received{" "}
            <span className="text-red-900 text-[25px] font-extrabold px-2">
              {ownerComplaintsCount}
            </span>{" "}
            {ownerComplaintsCount === 1 ? "Complain" : "Complains"} in the Past
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Story
            </h4>
            <div className="mt-[20px]">
              <p className="font-epilogue font-normal text-[16px] text-[#131313] leading-[26px] text-justify">
                {state.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Category
            </h4>
            <div className="flex flex-row items-center md-[18px] mt-[20px]">
              <img
                src={tagType}
                alt="tag"
                className="w-[25px] h-[25px] object-ccontain"
              />
              <p className="ml-[12px] mt-[2px] font-epilogue font-medium text-[17px] text-[#131313]">
                {state.category}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Donators
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {donators.length > 0 ? (
                donators.map((item, index) => (
                  <div
                    key={`${item.donator}-${index}`}
                    className="flex justify-between items-center gap-4 flex-wrap"
                  >
                    <p className="font-epilogue font-normal sm:text-[16px] text-[12px] text-[#131313] leading-[26px]">
                      {index + 1}.{item.donator}
                    </p>
                    <p className="font-epilogue font-bold text-16px text-[#131313] leading-[26px]  break-all">
                      {item.donation}
                    </p>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-bold text-[16px] text-[#808191] leading-[26px] text-justify">
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
              Complains: {filteredComplains.length}
            </h4>
            <div className="mt-[20px] flex flex-col gap-4">
              {filteredComplains.length > 0 ? (
                filteredComplains.map((item, index) => (
                  <div
                    key={`${item.userid}-${index}`}
                    className="flex flex-col items-start gap-1 flex-wrap"
                  >
                    <p className="font-epilogue font-normal sm:text-[16px] text-[12px] text-[#131313] leading-[26px]">
                      {index + 1}.{item.userid}
                    </p>
                    <div className="flex flex-row flex-wrap items-center justify-between gap-4">
                      <p className="font-epilogue font-semibold text-16px text-[#bf0606] leading-[26px] break-all">
                        Reason: {item.reason}
                      </p>
                      {item.userid === address && (
                        <img
                          src={deleteIcon}
                          className="w-[20px] h-[20px]"
                          onClick={() => handleDelete(item._id)}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                  No complains yet, Feel free to send one
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-black uppercase">
            Fund
          </h4>

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input
                type="number"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Back it because you beleive in it.
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  Suppport the project for no reward, just because it speaks to
                  you.
                </p>
              </div>

              <CustomButton
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleDonate}
              />
            </div>
          </div>

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue font-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Send a Complain
            </p>
            <div className="mt-[30px]">
              <input
                type="text"
                placeholder="Reason to Complain"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={complain.reason}
                onChange={(e) =>
                  setComplain({ ...complain, reason: e.target.value })
                }
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">
                  Do you Find this Campaign Suspecious ?
                </h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">
                  If so , then please help us out by Sending a Complain
                </p>
              </div>

              <CustomButton
                btnType="button"
                title="Send Complain"
                styles="w-full bg-pink-400"
                handleClick={handleAddComplain}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
