import React from "react";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { CampaignDetails, CreateCampaign, Home, Profile, Charts } from "./pages";
import { Sidebar, Navbar } from "./components";

const App = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="relative sm:-8 p-4 bg-[#cbd5e1] min-h-screen flex flex-row ">
      <div className="sm:flex hidden mr-10 relative">
        <Sidebar />
      </div>

      <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
        <Navbar search={search} setSearch={setSearch} />

        <Routes>
          <Route
            path="/"
            element={<Home search={search} setSeaerch={setSearch} />}
          />
          <Route path="/create-campaign" element={<CreateCampaign />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/campaign-details/:id" element={<CampaignDetails />} />
          <Route path="/charts" element={<Charts />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
