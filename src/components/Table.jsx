import React from 'react';
import './Table.css';
import numeral from 'numeral';

function Table({ countries }) {
  return (
    <div className='table'>
      <tr>
        <td>Countries</td>

        <td>Total Cases</td>
      </tr>
      {countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>

          <td>{numeral(cases).format('000,000')}</td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
