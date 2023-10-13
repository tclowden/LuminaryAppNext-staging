import React, { useState } from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { setTippyClose, setTippyOpen } from '../../../store/slices/tippy';
import { fillColorObject } from '../../../utilities/colors/colorObjects';
import Icon from '../Icon';
import { Data, xLabels } from './LineChart';

interface Props {
   x: string;
   y: string;
   lineData: Data;
   allLinesData: Data[];
   index: number;
   xLabels: xLabels;
}

const Circle = ({ x, y, lineData, allLinesData, index, xLabels }: Props) => {
   const [svgSize, setSvgSize] = useState<{ index: number; size: number } | undefined>();

   const generatedId = Math.floor(Math.random() * 10000).toString();
   const dispatch = useAppDispatch();

   // Uses redux tooltip because SVG does not support foreign objects like <Tooltip>
   const showTooltip = (content: string | null, id: string) => {
      dispatch(
         setTippyOpen({
            content: content,
            anchorId: id,
            isOpen: true,
            position: 'right',
         })
      );
   };

   const hideTooltip = () => {
      dispatch(setTippyClose({}));
   };

   return (
      <>
         <circle
            id={`data-point-${generatedId}`}
            cx={x}
            cy={y}
            r={`${svgSize?.index === index ? svgSize.size : 7}`}
            className={`
               stroke-lum-white dark:stroke-lum-gray-750 cursor-pointer [stroke-width:3] duration-300 ease-in-out
               ${fillColorObject[lineData.config.strokeColor] || fillColorObject['gray:450']}
            `}
            onMouseEnter={() => {
               setSvgSize({ index: index, size: 9 });
               const content = (
                  <div className='flex flex-col justify-center gap-y-2 p-1'>
                     {allLinesData.map((al: Data, ind: number) => (
                        <div key={ind} className='flex flex-row items-center gap-x-2'>
                           {!!xLabels.labels?.length && (
                              <div className='flex flex-row items-center gap-x-1'>
                                 {React.cloneElement(
                                    <Icon
                                       name={al.config.iconName?.x || 'Calendar'}
                                       height='12'
                                       width='12'
                                       //@ts-ignore
                                       color={al.config.strokeColor}
                                    />,
                                    { type: 'Icon' }
                                 )}
                                 <span>{xLabels.labels[index]}</span>
                              </div>
                           )}
                           <div className='flex flex-row items-center gap-x-1'>
                              {React.cloneElement(
                                 <Icon
                                    name={al.config.iconName?.y || 'DollarSignCircle'}
                                    height='12'
                                    width='12'
                                    //@ts-ignore
                                    color={al.config.strokeColor}
                                 />,
                                 { type: 'Icon' }
                              )}
                              <span>{al.yValues[index].label}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               );
               showTooltip(JSON.stringify(content), `data-point-${generatedId}`);
            }}
            onMouseLeave={(e) => {
               setSvgSize(undefined);
               hideTooltip();
            }}
         />
      </>
   );
};

export default Circle;
