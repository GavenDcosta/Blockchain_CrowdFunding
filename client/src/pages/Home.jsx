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
      const titleWords = campaign.title.trim().toLowerCase().split(' ')
      const searchTextWords = search.trim().toLowerCase().split(' ');

      const categoryTags = campaign.category.trim().toLowerCase().split(',')

      const hasCommonWord = descWords.some((word) => searchTextWords.includes(word)) ||
                            titleWords.some((word) => searchTextWords.includes(word)) ||
                            categoryTags.some((tag) => searchTextWords.includes(tag.replace(/#/g, '')))

      return (
        campaign.owner === search ||
        campaign.title.toLowerCase().includes(search.toLowerCase()) ||
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
