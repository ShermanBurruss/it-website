import React, { useState, useEffect } from 'react';
import CleanList from './CleanList';
import CleanForm from './CleanForm';
import PendingTrucks from './PendingTrucks';

export default function CleanTruck() {

  const [cleaningLists, setCleaningLists] = useState({
    currentWeek: { startDate: null, endDate: null, list: [] },
    nextWeek: { startDate: null, endDate: null, list: [] },
    cleaningStaff: [], 
    pendingTrucks:[], 
  });
  
  useEffect(() => {
    const fetchCleaningLists = async () => {
      try {
        const response = await fetch('http://localhost:3001/cleaning_lists', {
  credentials: 'include',
});

        const data = await response.json();
        console.log(data);
        if (data.success) {
          setCleaningLists(data);
        } else {
          console.error('Failed to fetch cleaning lists:', data.message);
        }
      } catch (error) {
        console.error('Error fetching cleaning lists:', error);
      }
    };

    fetchCleaningLists();
  }, []); // Include dependencies if needed

  return (
    <section id="main" className="colored-bg">
      <div className="container listDiv left">
        <div className="container">
          <h4>Current week: {cleaningLists.currentWeek.startDate} to {cleaningLists.currentWeek.endDate}</h4>
          <CleanList className="listDiv" truckList={cleaningLists.currentWeek.list} />
        </div>
        <div className="container">
          <h4>Upcoming week: {cleaningLists.nextWeek.startDate} to {cleaningLists.nextWeek.endDate}</h4>
          <CleanList className="listDiv" truckList={cleaningLists.nextWeek.list} />
        </div>
      </div>
      <div className="container formDiv center">
      <CleanForm data={cleaningLists.cleaningStaff} />
      </div>
      <div className="container listDiv right">
        <div className="container">
          <h4>Completed cleanings awaiting payout: </h4>
          {/* Add a check for the existence of cleaningLists.cleaning before rendering */}
          {cleaningLists.pendingTrucks && (
            <PendingTrucks className="listDiv" truckList={cleaningLists.pendingTrucks} />
          )}
        </div>
      </div>
    </section>
  );
}
