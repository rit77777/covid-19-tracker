import React from 'react';
import { Card, CardContent } from '@material-ui/core';

import './InfoBox.css';

function InfoBox({ title, isRed, isGrey, active, cases, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`info-box ${active && 'info-box-selected'} ${
        isRed && 'info-box-red'
      } ${isGrey && 'info-box-grey'}`}
    >
      <CardContent>
        {/* Title */}
        <h3 className='info-box-title'>{title}</h3>

        {/* Number of Cases */}
        <h2
          className={`info-box-cases ${!isRed && 'info-box-cases-green'} ${
            isGrey && 'info-box-cases-grey'
          }`}
        >
          {props.isloading ? <i className='fa fa-cog fa-spin fa-fw' /> : cases}
        </h2>

        {/* Total Cases */}
        <h4 className='info-box-total'>{total} Total</h4>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
