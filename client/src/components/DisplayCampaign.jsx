import React from 'react'
import { useNavigate } from 'react-router-dom'
import { loader } from '../assets'
import FundCard  from './FundCard'

const DisplayCampaign = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate()

  

  const handleNavigate = (campaign, count, index) => {
    navigate(`/campaign-details/${campaign.title}`, {state: {...campaign, count, index}})   //sending state through routing, can retrive this state with useLocation Hook
  }

  return (
    <div>
      <h1 className='font-epilogue font-semibold text-white text-left'>{title} ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt='loader' className='w-[100px] h-[100px] object-contain'/>
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className='font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]'>You have not created campaigns yet</p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign, index) => {

          var count = 0 
          for(let i=0; i< campaigns.length;i++){
            if(campaign.owner === campaigns[i].owner){
              count++;
            }
          }
          
          return (
            <FundCard
              key={campaign.id}
              {...campaign}
              handleClick = {() => handleNavigate(campaign, count, index)}
              count={count}
              index={index}
            />
          )
       })}
      </div>
    </div>
  )
}

export default DisplayCampaign