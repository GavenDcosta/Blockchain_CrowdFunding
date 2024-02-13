import React, { useEffect, useState } from 'react';

const Charts = () => {
    const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://gaven-blockchain-crowd-funding-api.vercel.app/complains');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const generateComplaintStats = () => {
    const categoryCounts = {};
    complaints.forEach((complaint) => {
      const categories = complaint.category ? complaint.category.split(', ') : [];
      categories.forEach((category) => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });
  
    const categoryDivs = Object.keys(categoryCounts).map((category) => (
      <div key={category} className="bg-white m-2 p-4 shadow-xl rounded-full">
        <span className="text-black font-bold">
          {`${category}: ${categoryCounts[category]} complaints`}
        </span>
      </div>
    ));
  
    return categoryDivs;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Complaint Statistics</h1>
      <div className="flex flex-wrap">
        {generateComplaintStats()}
      </div>
    </div>
  );
};

export default Charts;


// import React from 'react'

// const Charts = () => {
//   return (
//     <div>Charts</div>
//   )
// }

// export default Charts
