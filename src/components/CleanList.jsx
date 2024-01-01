import React from 'react';

export default function CleanList({ truckList}) {
  return (
<div>
  <table>
    <thead>
      <tr>
        <th className="styleCol1">Unit Number</th>
        <th className="styleCol1">Style</th>
        <th className="styleCol2">Available</th>
        <th className="styleCol1">Last Cleaned</th>
      </tr>
    </thead>
    <tbody>
      {truckList.map((truck) => (
        <tr key={truck.unit_number}>
          <td className="styleCol1">{truck.unit_number}</td>
          <td className="styleCol1">{truck.style}</td>
          <td className="styleCol2">{`${truck.avail_start} to ${truck.avail_end}`}</td>
          <td className="styleCol1">{truck.last_cleaned}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}
