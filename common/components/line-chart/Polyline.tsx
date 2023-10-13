import React from 'react';
import { strokeColorObject } from '../../../utilities/colors/colorObjects';
import Circle from './Circle';
import { Data, xLabels } from './LineChart';

interface Props {
   width: string | number;
   height: string | number;
   lineData: Data;
   allLinesData: Data[];
   maxY: number;
   minY: number;
   xLabels: xLabels;
}

const Polyline = ({ lineData, allLinesData, width, height, maxY, minY, xLabels }: Props) => {
   const { yValues, config } = lineData;
   const pointsString = yValues
      .map((yVal: { value: number; label: string }, i: number) => {
         const labelX = ((+width / (yValues.length - 1)) * i).toFixed(2);
         const labelY = (((yVal.value - minY) * +height) / (maxY - minY)).toFixed(2);
         return [labelX, labelY].join(',');
      })
      .join(' ');

   if (pointsString.includes('NaN')) return null;

   return (
      <>
         <polyline
            points={pointsString}
            className={`
               fill-none [stroke-linejoin:round] mx-auto
               ${strokeColorObject[lineData.config.strokeColor] || strokeColorObject['gray:450']}
            `}
            strokeWidth={`${config.strokeWidth}px`}
         />
         {!config.referenceLine &&
            pointsString.split(' ').map((points, index) => {
               const [x, y] = points.split(',');
               const yVal = lineData.yValues[index];

               return (
                  <Circle
                     key={index}
                     x={x}
                     y={y}
                     lineData={lineData}
                     allLinesData={allLinesData}
                     index={index}
                     xLabels={xLabels}
                  />
               );
            })}
      </>
   );
};

export default Polyline;
