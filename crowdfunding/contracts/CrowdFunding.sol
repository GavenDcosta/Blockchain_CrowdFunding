// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign{              //struct is a type of object in JS
        address owner;            //solidity is a strictly type language, so give a type to each property
        string title;
        string description;
        uint256 target;           //target amount to acheive    //uint is an integer type 
        uint256 deadline;         //deadline of the funding
        uint256 amountCollected;  
        string image;             //url of the image
        address[] donators;       //array of donators addresses
        uint256[] donations;      //array of actual amount of donations
    }

    //campaigns[0]  for JS

    mapping(uint256 => Campaign) public campaigns;   //for solidity   //array which can be mapped

    uint256 public numberOfCampaigns = 0;        //global variable  //index of the campaigns


 //we need the memory keyword for every single string
 //in solidity we need to specify if a function is only internal or that we can use it from our frontend  (public means that we can use it from frontend)
 //then we have to specify what it returns  "returns (uint256)" --> in the createCampaign function we want it to return the ID of the created campaign


    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) {

        Campaign storage campaign = campaigns[numberOfCampaigns];  //array of the campaigns 

        //is everything okay?  //block.timestamp is the current date
        require(campaign.deadline < block.timestamp, "The deadline should be a date int he Future");   //if the deadline is a past date then show this error

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;  
        campaign.amountCollected = 0;     
        campaign.image = _image;           //all values for campaigns[0]...then increment and next will be campaigns[1]

        numberOfCampaigns++;         //incrementing the index of the array 

        return numberOfCampaigns -1;  //index of the newly created campaign

    }
    

    function donateToCampaign(uint256 _id) public payable {  //payable--> special keyword which signifies that we are going to send crypto currency throughout the function
        uint256 amount = msg.value;             //will be sent from front end

        Campaign storage campaign = campaigns[_id];  //mapping that we created  

        campaign.donators.push(msg.sender);    //push the donator in the donators array of the campaign schema
        campaign.donations.push(amount);    //push the donation in the donations array of the campaign schema

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");    //payable returns 2 values so put coma after bool sent...amount will go to the owner

        if(sent){
            campaign.amountCollected = campaign.amountCollected + amount;     //add the amount received to the amountCollected value of the schema
        }
         
    }  


    function getDonators(uint256 _id) view public returns(address[] memory, uint[] memory) {  //it is a view only funtion, the parameters are the donators and donations array of the campaign schema
        return (campaigns[_id].donators, campaigns[_id].donations);
    }


    function getCampaign() public view returns(Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);  //creating an empty array equal to the size of the no of Campaigns

        for(uint i = 0; i < numberOfCampaigns; i++){
            Campaign storage item = campaigns[i];    //getting a campaign
 
            allCampaigns[i] = item;      //putting it in this new array

        }

        return allCampaigns;
    }
} 