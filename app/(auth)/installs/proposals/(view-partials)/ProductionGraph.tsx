'use client';
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

interface Props {
   production: any;
}

const ProductionGraph = ({ production }: Props) => {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);

   useEffect(() => {
      if (production.production == undefined || production.usage == undefined) {
         return;
      }
      const solarProduction = production.production;
      const usage = production.usage;

      const ee = true;
      const reducedUsage = usage.map((e: any) => {
         if (ee) {
            return e * (1 - production.offset / 100);
         }
         return e;
      });

      let greyGradient: CanvasGradient;
      if (canvasRef?.current !== null) {
         const currentCanvas = canvasRef?.current;
         const myChart = currentCanvas.getContext('2d');
         if (myChart !== null) {
            greyGradient = myChart.createLinearGradient(0, 0, 0, 600) as any;
            greyGradient.addColorStop(0, 'rgba(48,61,70, 1)');
            greyGradient.addColorStop(1, 'rgba(125,141,154, 1)');

            let datasets = [
               {
                  label: 'Consumption',
                  data: usage, //post_consumption,
                  order: 2,
                  barThickness: 40,
                  backgroundColor: greyGradient, // greyGradient,
               },
               {
                  label: 'Energy Reduction',
                  data: reducedUsage, //energy_reduction_by_month,
                  order: 3,
                  barThickness: 40,
                  backgroundColor: '#e0e3e5',
               },
               {
                  label: 'Solar Production',
                  type: 'line',
                  data: solarProduction, //production_by_month,
                  order: 1,
                  fill: false,
                  fillBackgroundColor: '#FF6900',
                  backgroundColor: '#FFF',
                  borderColor: '#FF6900',
                  borderWidth: 4,
                  pointBorderWidth: 2.5,
                  lineTension: 0,
                  pointRadius: 6,
                  pointHoverRadius: 8,
                  pointHoverBorderWidth: 2,
                  pointHitRadius: 10,
               },
            ];

            if (canvasRef.current) {
               const chart = new Chart(canvasRef.current, {
                  type: 'bar',
                  data: {
                     labels: [
                        'January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',
                        'July',
                        'August',
                        'September',
                        'October',
                        'November',
                        'December',
                     ],
                     datasets: datasets,
                  },
                  options: {
                     scales: {
                        xAxes: [{ stacked: true }],
                        yAxes: [{ stacked: true }],
                     },
                     legend: {
                        position: 'bottom',
                        labels: {
                           fontColor: 'black',
                           boxWidth: 20,
                        },
                        onClick: (e: any) => e.stopPropagation(),
                     },
                     animation: {
                        duration: 0,
                     },
                  },
               });

               // Cleanup function to remove chart on component unmount
               return () => {
                  chart.destroy();
               };
            }
         }
      }
   }, [production]); // re-run effect when production changes

   return <canvas ref={canvasRef} width='700' height='480' />;
};

export default ProductionGraph;
