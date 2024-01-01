import React from 'react';

export default function PendingTrucks({ truckList}) {
  return (
<div>
  <table>
    <thead>
      <tr>
        <th className="styleCol1">Unit Number</th>
        <th className="styleCol1">Style</th>
        <th className="styleCol2">Last Cleaned</th>
        <th className="styleCol1">Price</th>
      </tr>
    </thead>
    <tbody>
      {truckList.map((truck) => (
        <tr key={truck.unit_number}>
          <td className="styleCol1">{truck.unit_number}</td>
          <td className="styleCol1">{truck.style}</td>
          <td className="styleCol2">{truck.last_cleaned}</td>
          <td className="styleCol1">{truck.price}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}
