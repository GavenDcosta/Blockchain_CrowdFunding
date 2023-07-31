import React, { useState, useEffect } from 'react'
import { useStateContext } from '../context'
import { DisplayCampaign } from '../components'

const Home = () => {

  const [isLoading,setIsLoading] = useState(false)
  const [campaigns, setCampaigns] = useState([])

  const { address, contract, getCampaigns } = useStateContext()

  const fetchCampaigns = async () => {
     setIsLoading(true)
     const data = await getCampaigns()
     setCampaigns(data)
     setIsLoading(false)
  }

  useEffect(() => {
    if(contract) fetchCampaigns()     //if we directly call getCampaigns inside useEffect then it will take some time so put it in fetchCampaigns and then inside useEffect
  }, [address, contract])            //will re call itself once a new address and contract comes

  return (
    <DisplayCampaign
      title="All Campaigns"
      isLoading = {isLoading}
      campaigns={campaigns}
    />
  )
}

export default Home