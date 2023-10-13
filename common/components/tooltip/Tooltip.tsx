'use client';
import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type TooltipPosition = 'left' | 'right' | 'top' | 'bottom';
export type TooltipDelay = 0 | 250 | 500 | 750 | 1000;

interface Props {
   content?: string | React.ReactNode;
   position?: TooltipPosition;
   openDelay?: TooltipDelay;
   closeDelay?: TooltipDelay;
   disabled?: boolean;
   children: React.ReactElement; // only one element...
}

const Tooltip = ({ content, position = 'bottom', openDelay = 250, closeDelay = 0, disabled, children }: Props) => {
   const generatedTooltipId = useId();
   const tooltipRef = useRef<any>();
   const [tooltipStyle, setTooltipStyle] = useState<object>({ zIndex: -100 });

   // isOpen state handles triggering the setTimeout for openDelay
   const [isOpen, setIsOpen] = useState<boolean>(false);
   // isOpenEvenHarder triggers only if delay finishes and is not cleared out, which then results in displaying the tooltip
   const [isOpenEvenHarder, setIsOpenEvenHarder] = useState<boolean>(false);

   useEffect(() => {
      if (!isOpen) {
         const timeoutId = setTimeout(hideTooltip, closeDelay);
         return () => clearTimeout(timeoutId);
      } else {
         const timeoutId = setTimeout(showTooltip, openDelay);
         return () => clearTimeout(timeoutId);
      }
   }, [isOpen]);

   const showTooltip = () => {
      if (!document) return;
      const element = document.getElementById(generatedTooltipId);

      if (disabled || !element) return;
      const hoveredElementPos = element.getBoundingClientRect();
      let style: any = {};
      style['zIndex'] = 100;

      const DIFF = 2;

      switch (position) {
         case 'top':
            style['left'] = hoveredElementPos.left + hoveredElementPos.width / 2 - tooltipRef.current.offsetWidth / 2;
            style['top'] = hoveredElementPos.top - tooltipRef.current.offsetHeight - DIFF;
            break;
         case 'bottom':
            style['left'] = hoveredElementPos.left + hoveredElementPos.width / 2 - tooltipRef.current.offsetWidth / 2;
            style['top'] = hoveredElementPos.bottom + DIFF;
            break;
         case 'left':
            style['left'] = hoveredElementPos.left - tooltipRef.current.offsetWidth - DIFF;
            style['top'] = hoveredElementPos.top + hoveredElementPos.height / 2 - tooltipRef.current.offsetHeight / 2;
            break;
         case 'right':
            style['left'] = hoveredElementPos.right + DIFF;
            style['top'] = hoveredElementPos.top + hoveredElementPos.height / 2 - tooltipRef.current.offsetHeight / 2;
            break;
         default:
            console.log(`${position} does not exist..`);
            return;
      }

      // handle offset top
      if (style['top'] < 0) {
         style['top'] = position === 'left' || position === 'right' ? 0 : hoveredElementPos.bottom + DIFF;
      }
      // handle offset bottom
      if (style['top'] > window.innerHeight - tooltipRef.current.offsetHeight) {
         style['top'] =
            position === 'left' || position === 'right'
               ? window.innerHeight - tooltipRef.current.offsetHeight
               : hoveredElementPos.top - tooltipRef.current.offsetHeight - DIFF;
      }
      // handle offset left
      if (style['left'] < 0) {
         style['left'] = hoveredElementPos.right + DIFF;
      }
      // handle offset right
      if (style['left'] > window.innerWidth - tooltipRef.current.offsetWidth) {
         // style['left'] = hoveredElementPos.left - tooltipRef.current.offsetWidth - DIFF;
         style['left'] = 'auto';
         style['right'] = 0;
      }
      setTooltipStyle(style);

      setIsOpenEvenHarder(true);
   };

   const hideTooltip = () => {
      let style: any = {};
      style['zIndex'] = -100;
      setTooltipStyle(style);
      setIsOpenEvenHarder(false);
   };

   return (
      <>
         {/* children */}
         {React.cloneElement(children, {
            ...children.props,
            id: generatedTooltipId,
            onMouseEnter: () => setIsOpen(true),
            onMouseLeave: () => setIsOpen(false),
         })}

         {/* tooltip */}
         {!disabled &&
            createPortal(
               <div
                  ref={tooltipRef}
                  role={'tooltip'}
                  className={`
                     fixed pointer-events-none
                     ${isOpenEvenHarder ? 'visible animate-fadeIn' : 'invisible'}
                     ${
                        typeof content !== 'object' &&
                        'bg-lum-black text-lum-white px-[6px] py-[4px] min-h-[20px] max-w-[250px] text-[12px] rounded text-left break-normal leading-[14px] pointer-events-none'
                     }
                  `}
                  style={{ ...tooltipStyle }}>
                  {content}
               </div>,
               document.body
            )}
      </>
   );
};

export default Tooltip;
