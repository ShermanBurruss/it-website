import React, { useState } from 'react';

const CleaningForm = ({data}) => {
  const [formData, setFormData] = useState({
    unitNumber: '',
    dateCleaned: '',
    cleanedBy: '',
    truckCond: '',
    cleaningNotes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Parse cleanedBy and truckCond as integers
    const parsedValue = name === 'cleanedBy' || name === 'truckCond' ? parseInt(value, 10) : value;
  
    setFormData({ ...formData, [name]: parsedValue });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/submit', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Display success message
        console.log('Form submitted successfully:', data.message);
        // You can also update the state or perform other actions on success
      } else {
        // Display error message
        console.error('Error submitting form:', data.message);
        // You can handle errors or display messages to the user
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle fetch errors or other unexpected issues
    }
  };

  return (
    <div className="container formDiv right">
      <form action="/submit" method="post" className="cleaning-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="unitNumber" className = "formItem">Unit Number:</label>
          <input
            type="text"
            id="unitNumber"
            name="unitNumber"
            className="form-input"
            value={formData.unitNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="dateCleaned" className = "formItem">Date Cleaned:</label>
          <input
            type="date"
            id="dateCleaned"
            name="dateCleaned"
            className="form-input"
            value={formData.dateCleaned}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor="cleanedBy" className = "formItem">Cleaned By:</label>
          <select
            name="cleanedBy"
            id="cleanedBy"
            className="form-input"
            value={formData.cleanedBy}
            onChange={handleInputChange}
          >
          <option value="" disabled hidden>
            Select a staff
          </option>
          {data && data.map((staffMember) => (
            <option key={staffMember.id} value={staffMember.id}>
              {staffMember.name}
            </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="truckCond" className = "formItem">Truck Condition:</label>
          <select
            id="truckCond"
            name="truckCond"
            className="form-input"
            value={formData.truckCond}
            onChange={handleInputChange}
            required
          >
          <option value="" disabled hidden>
            Select a condition
          </option>
          <option value="1">Great</option>
          <option value="2">Good</option>
          <option value="3">Average</option>
          <option value="4">Bad</option>
          <option value="5">Very Bad</option>
          </select>
        </div>
        <div id="cleaningNotesDiv">
          <label htmlFor="cleaningNotes" className = "formItem formNote">Cleaning Notes:</label>
          <textarea
            id="cleaningNotes"
            name="cleaningNotes"
            rows="4"
            className="form-input"
            value={formData.cleaningNotes}
            onChange={handleInputChange}
          >Enter notes here.</textarea>
        </div>
        <button type="button" class="btn btn-primary btn-lg" onClick={handleSubmit}>Submit</button>

        <div className="flash-message">
          {/* Display success or error messages here */}
        </div>
      </form>
    </div>
  );
};

export default CleaningForm;
