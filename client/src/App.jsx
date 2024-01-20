import React from "react";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { CampaignDetails, CreateCampaign, Home, Profile } from "./pages";
import { Sidebar, Navbar } from "./components";

const App = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="relative sm:-8 p-4 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ... min-h-screen flex flex-row ">
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
        </Routes>
      </div>
    </div>
  );
};

export default App;
