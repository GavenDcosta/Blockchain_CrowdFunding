import React, { useState, useEffect } from 'react';
import { useStateContext } from '../context';
import { DisplayCampaign } from '../components';

const Home = ({ search, setSearch }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
    }
  }, [address, contract]);

  const filterCampaigns = () => {
    if (!search || search.toLowerCase() === 'all') {
      return campaigns; // Return all campaigns without filtering
    }

    const filteredCampaigns = campaigns.filter((campaign) => {
      const descWords = campaign.description.trim().toLowerCase().split(' ');
      const searchTextWords = search.trim().toLowerCase().split(' ');

      const hasCommonWord = descWords.some((word) => searchTextWords.includes(word));

      return (
        campaign.owner.includes(search) ||
        campaign.title.includes(search) ||
        hasCommonWord
      );
    });

    return filteredCampaigns;
  };

  const filteredCampaigns = filterCampaigns();

  return (
    <DisplayCampaign title="All Campaigns" isLoading={isLoading} campaigns={filteredCampaigns} />
  );
};

export default Home;
