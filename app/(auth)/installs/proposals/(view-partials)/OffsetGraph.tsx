'use client';
import React, { useEffect, useRef } from 'react';
import Chart, { ChartConfiguration, PluginServiceRegistrationOptions } from 'chart.js';

interface Props {
   offset: number;
}

const OffsetGraph = ({ offset }: Props) => {
   const canvasRef = useRef<HTMLCanvasElement | null>(null);

   useEffect(() => {
      if (offset == undefined) {
         return;
      }

      let greyGradient: CanvasGradient;
      if (canvasRef?.current !== null) {
         const dataSet = [
            {
               label: '21%',
               data: [50, 100],
               backgroundColor: ['#FF6900', '#dce0e2'],
            } as Chart.ChartDataSets,
         ] as Chart.ChartDataSets[];

         const currentCanvas = canvasRef?.current;
         const myChart = currentCanvas.getContext('2d');
         if (myChart !== null) {
            const data = {
               labels: [] as string[],
               datasets: dataSet,
            } as Chart.ChartData;

            const config = {
               type: 'doughnut',
               data: data,
            } as Chart.ChartConfiguration;

            if (canvasRef.current) {
               const chart = new Chart(canvasRef.current, config);

               // Cleanup function to remove chart on component unmount
               return () => {
                  chart.destroy();
               };
            }
         }
      }
   }, [offset]); // re-run effect when production changes

   return <canvas className='w-[200px] h-[200]' ref={canvasRef} width='200' height='200' />;
};

export default OffsetGraph;
