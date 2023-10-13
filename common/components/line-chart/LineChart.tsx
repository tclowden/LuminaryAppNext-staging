import React, { useEffect, useRef, useState } from 'react';
import Footer from './Footer';
import Legend from './Legend';
import Polyline from './Polyline';

export interface Data {
   config: {
      referenceLine?: boolean;
      strokeWidth: number;
      strokeColor: string;
      title: string;
      iconName?: { x: string; y: string };
   };
   yValues: { value: number; label: string }[];
}

export interface xLabels {
   type: 'currency' | 'date' | 'number' | string;
   labels: Array<string>;
}
export interface yLabels {
   type: 'currency' | 'date' | 'number' | string;
   labels: Array<number>;
}

export interface Title {
   value: string;
   placement?: 'left' | 'center' | 'right';
}

type SvgDimensions = {
   width: string | number;
   height: string | number;
};

interface LineChartConfig {
   title: Title;
   xLabels?: xLabels;
   yLabels?: yLabels;
}

interface Props {
   width?: number;
   height: number;
   data: Data[];
   config?: LineChartConfig;
}

const LineChart = ({ data, width, height, config }: Props) => {
   const svgContainerRef = useRef<any>();
   const lineChartContainerRef = useRef<any>();

   const [svgDimensions, setSvgDimensions] = useState<SvgDimensions>({ width: 'auto', height: 'auto' });
   const [labelContainerWidth, setLabelContainerWidth] = useState<number | undefined>();

   // this is here to hide containers depending on screen size
   const [hideContainer, setHideContainer] = useState<boolean>(false);

   const tempMaxYs = data.map(
      (configObj: any) => [...configObj.yValues].sort((a, b) => a.value - b.value)[configObj.yValues.length - 1]
   );
   const tempMixYs = data.map((configObj: any) => [...configObj.yValues].sort((a, b) => a.value - b.value)[0]);
   const sortedYLabels = config?.yLabels?.labels.length ? [...config.yLabels.labels].sort((a, b) => a - b) : [];
   let minY = sortedYLabels?.length
      ? sortedYLabels[0]
      : tempMixYs.reduce((prevVal, currVal) => (currVal.value > prevVal.value ? prevVal : currVal)).value;
   let maxY = sortedYLabels?.length
      ? sortedYLabels.at(-1)
      : tempMaxYs.reduce((prevVal, currVal) => (currVal.value > prevVal.value ? currVal : prevVal)).value;

   // find the largest width ylabel & set the container to that width
   useEffect(() => {
      const yLabelsArr = document.querySelectorAll('.y-labels');
      if (!yLabelsArr || !yLabelsArr.length) return setLabelContainerWidth(0);
      const biggestWidthLabel: any = Array.from(yLabelsArr).reduce((acc: any, curr: any) =>
         curr.offsetWidth > acc.offsetWidth ? curr : acc
      );
      setLabelContainerWidth(biggestWidthLabel.offsetWidth);
   }, [document]);

   // event listener that will change the svg container size on screen resize
   useEffect(() => {
      const handleResize = (e: any) => {
         const { offsetWidth, offsetHeight } = svgContainerRef.current;
         if (lineChartContainerRef.current.offsetWidth >= 406 && hideContainer) setHideContainer(false);
         else if (lineChartContainerRef.current.offsetWidth < 406 && !hideContainer) setHideContainer(true);
         setSvgDimensions({ width: offsetWidth, height: offsetHeight });
      };

      window.addEventListener('resize', handleResize);
      return () => {
         window.removeEventListener('resize', handleResize);
      };
   }, [hideContainer]);

   // init the svg dimisions whenever there is a reference available
   useEffect(() => {
      if (
         svgContainerRef.current &&
         svgDimensions.width === 'auto' &&
         svgDimensions.height === 'auto' &&
         labelContainerWidth !== undefined
      ) {
         const { offsetWidth, offsetHeight } = svgContainerRef.current;
         setSvgDimensions({ width: offsetWidth, height: offsetHeight });
      }

      if (lineChartContainerRef.current) {
         const { offsetWidth } = lineChartContainerRef.current;
         if (offsetWidth >= 406 && hideContainer) setHideContainer(false);
         if (offsetWidth < 406 && !hideContainer) setHideContainer(true);
      }
   }, [svgContainerRef.current, lineChartContainerRef.current]);

   return (
      <div
         ref={lineChartContainerRef}
         className={`p-[20px] rounded dark:bg-lum-gray-750 bg-lum-white`}
         style={{
            width: width ? width : '100%',
            display: 'grid',
            gridTemplateAreas: `
               "legend legend"
               ${!!config?.yLabels && !hideContainer ? '"yLabels svgContainer"' : '"svgContainer svgContainer"'}
               ${!!config?.xLabels && !hideContainer ? '". footer"' : ''}
            `,
            rowGap: '30px',
            columnGap: '20px',
            gridTemplateColumns: 'min-content auto',
         }}>
         <Legend data={data} width={width} title={config?.title || { placement: 'left', value: '' }} />
         {!!config?.yLabels && !hideContainer && (
            <div
               className={`relative`}
               style={{
                  height: height ? height : 'auto',
                  width: `${labelContainerWidth}px`,
                  gridArea: 'yLabels',
               }}>
               {config.yLabels.labels.map((label: number, i: number) => (
                  <div
                     key={i}
                     className='text-[11px] text-lum-gray-400 max-content absolute leading-[0px] y-labels'
                     style={{
                        left: 0,
                        bottom: ((label - minY) * height) / (maxY - minY),
                     }}>
                     ${label.toLocaleString('en-US')}
                  </div>
               ))}
            </div>
         )}
         <div
            ref={svgContainerRef}
            style={{
               height: height ? height : 'auto',
               width: width ? width - 40 : 'inherit',
               gridArea: 'svgContainer',
            }}
            className={`mx-auto`}>
            <svg
               style={{
                  transform: 'scaleY(-1)',
                  height: 'inherit',
                  width: width ? width - 40 : 'inherit',
                  overflow: 'inherit',
               }}>
               {data.map((lineData: Data, i: number) => (
                  <Polyline
                     key={i}
                     width={svgDimensions.width}
                     height={svgDimensions.height}
                     xLabels={config?.xLabels || { type: '', labels: [] }}
                     lineData={lineData}
                     allLinesData={data}
                     maxY={maxY}
                     minY={minY}
                  />
               ))}
            </svg>
         </div>
         {!!config?.xLabels && !hideContainer && <Footer xLabels={config?.xLabels || { type: '', labels: [] }} />}
      </div>
   );
};
export default LineChart;
