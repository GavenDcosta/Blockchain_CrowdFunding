import React, { useContext, createContext } from 'react'

import { useAddress, useContract, useMetamask, useContractWrite } from '@thirdweb-dev/react'   //inbuilt hooks for transactions, smart contract
import { ethers } from 'ethers'

const StateContext = createContext()

export const StateContextProvider = ({ children }) => {
    const { contract } = useContract('0xB0963F06905401c562E73d0CfE003e2597E5875b')   //address of my smart contract
    const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign')   //using the write functions declared in smart contract

    const address = useAddress()    
    const connect = useMetamask()   //to use MetaMask //on clicking connect this will run and then useAddress will take your account address


    const publishCampaign = async (form) => {
        try{
        //     const data = await createCampaign([   //write in the same order as we wrote in our createCampaign function of the solidity code
        //         address, //owner
        //         form.title, //title
        //         form.description,  //description
        //         form.target,
        //         new Date(form.deadline).getTime(), //deadline
        //         form.image
        //    ])

            const data = await contract.call("createCampaign", [address,form.title,form.description,form.target,new Date(form.deadline).getTime(),form.image])
             
            console.log("contract call success", data)
        }
        catch (error) {
            console.log("contract call failure", error)
        }    
    }



    const getCampaigns = async () => {
        const campaigns = await contract.call('getCampaign')

        const parsedCampaigns = campaigns.map((campaign, i) => ({       //immediately return an object
               owner : campaign.owner,
               title : campaign.title,
               description : campaign.description,
               target: ethers.utils.formatEther(campaign.target.toString()),
               deadline : campaign.deadline.toNumber(),
               amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
               image : campaign.image,
               pId : i   //index of campaign
        }))

        return parsedCampaigns
    }



    const getUserCampaigns = async () => {
        const allCampaigns = await getCampaigns()

        const filteredCampaigns = allCampaigns.filter((campaign) =>
            campaign.owner === address
        )

        return filteredCampaigns
    }


    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', [pId] ,{value : ethers.utils.parseEther(amount)})

        return data
    }

    const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', [pId])
        const numberOfDonations = donations[0].length

        const parsedDonations = []

        for(let i=0; i < numberOfDonations; i++){
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            })
        }

        return parsedDonations
    }

    const refundCampaign = async (pId) => {
        try {
            const data = await contract.call('refundCampaign', [pId]);
            console.log("Refund success", data);
        } catch (error) {
            console.log("Refund failed", error);
        }
    };

    const deleteCampaign = async (pId) => {
        try {
            const data = await contract.call('deleteCampaign', [pId]);
            console.log("Campaign deletion success", data);
        } catch (error) {
            console.log("Campaign deletion failed", error);
        }
    };

    const refundUserCampaign = async (pId) => {
        try {
            const data = await contract.call('refundAllCampaign', [pId]);
            console.log("Refund all campaign success", data);
        } catch (error) {
            console.log("Refund all campaign failed", error);
        }
    };

    return(
        <StateContext.Provider    //sharing all of the values throughout our application
          value={{ 
            address,
            contract,
            connect,
            createCampaign: publishCampaign,
            getCampaigns,
            getUserCampaigns,
            donate,
            getDonations,
            deleteCampaign,
            refundCampaign,
            refundAllCampaigns: refundUserCampaign
           }}
        >
         {children}
        </StateContext.Provider>

    ) 
}   

export const useStateContext = () => useContext(StateContext) 