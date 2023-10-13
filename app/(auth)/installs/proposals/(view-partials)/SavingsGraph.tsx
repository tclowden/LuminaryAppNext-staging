'use client';
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

interface Props {
   production: any;
}

const SavingsGraph = () => {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);

   useEffect(() => {
      const saving = 70165;

      //   if (production.production == undefined || production.usage == undefined) {
      //      return;
      //   }

      // let grey_gradient: any = 'rgba(48,61,70, 1)';

      let greyGradient: CanvasGradient;
      if (canvasRef?.current !== null) {
         const currentCanvas = canvasRef?.current;
         const myChart = currentCanvas.getContext('2d');
         if (myChart !== null) {
            greyGradient = myChart.createLinearGradient(0, 0, 0, 600) as any;
            greyGradient.addColorStop(0, 'rgba(48,61,70, 1)');
            greyGradient.addColorStop(1, 'rgba(125,141,154, 1)');

            function formatCurrency(value: number | string) {
               const valueNumber = typeof value == 'string' ? parseInt(value) : value;
               return new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
               }).format(valueNumber);
            }

            let datasets = [
               {
                  label: 'Consumption',
                  data: [saving], //post_consumption,
                  order: 2,
                  barThickness: 150,
                  backgroundColor: greyGradient, // greyGradient,
               },
            ];

            if (canvasRef.current) {
               const chart = new Chart(canvasRef.current, {
                  type: 'bar',
                  data: {
                     labels: [''],
                     datasets: datasets,
                  },
                  options: {
                     scales: {
                        xAxes: [{ stacked: true }],
                        yAxes: [
                           {
                              stacked: true,

                              ticks: {
                                 callback: function (value, index, values) {
                                    return formatCurrency(value);
                                 },
                              },
                           },
                        ],
                     },
                     legend: {
                        display: false,
                     },
                     // legend: {
                     //    position: 'bottom',
                     //    labels: {
                     //       fontColor: 'black',
                     //       boxWidth: 20,
                     //    },
                     //    onClick: (e: any) => e.stopPropagation(),
                     // },
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
   }, []); // re-run effect when production changes

   return <canvas ref={canvasRef} width='350px' height='480px' />;
};

export default SavingsGraph;
