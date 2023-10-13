'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { twMerge } from 'tailwind-merge';
import Icon from '../common/components/Icon';
import { selectTippy } from '../store/slices/tippy';

const TippyProvider = ({ children }: { children: React.ReactNode }) => {
   const pathname = usePathname();
   const tooltipRef = useRef<any>();
   const [tooltipStyle, setTooltipStyle] = useState<object>({ zIndex: -100 });
   const { isOpen, anchorId, content, contentId, position } = useSelector(selectTippy);

   // closes the tooltip on page change
   useEffect(() => {
      if (isOpen) hideTooltip();
   }, [pathname]);

   useEffect(() => {
      if (isOpen) showTooltip();
      else hideTooltip();
   }, [isOpen]);

   const showTooltip = () => {
      const hoveredElement = document.getElementById(`${anchorId}`);
      if (!hoveredElement) return;
      const hoveredElementPos = hoveredElement.getBoundingClientRect();
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
   };

   const hideTooltip = () => {
      let style: any = {};
      style['zIndex'] = -100;
      setTooltipStyle(style);
   };

   // recursive function render a child element, rather than just a string.
   const renderChildren = (childElement: any): any => {
      if (!childElement?.props && typeof childElement === 'string') {
         return childElement;
      } else if (childElement?.props?.children && !Array.isArray(childElement?.props.children)) {
         return React.createElement(
            childElement?.type,
            { key: Math.floor(Math.random() * 10000).toString(), ...childElement?.props },
            renderChildren(childElement?.props?.children)
         );
      } else if (Array.isArray(childElement?.props?.children)) {
         return React.createElement(
            childElement?.type,
            { key: Math.floor(Math.random() * 10000).toString(), ...childElement?.props },
            childElement.props.children.map((child: any) => renderChildren(child))
         );
      } else {
         if (!childElement?.type && childElement?.props?.type) {
            return (
               <React.Fragment key={Math.floor(Math.random() * 10000).toString()}>
                  <RenderComp type={childElement?.props.type} {...childElement?.props} />
               </React.Fragment>
            );
         }
         if (!childElement?.type && !childElement?.props?.type) return null;
         return React.createElement(childElement?.type, {
            key: Math.floor(Math.random() * 10000).toString(),
            ...childElement?.props,
         });
      }
   };

   const isJSON = (str: string): boolean => {
      try {
         return JSON.parse(str) && !!str;
      } catch (e) {
         return false;
      }
   };
   const dataToRender = isJSON(content) ? JSON.parse(content) : null;
   return (
      <>
         <div
            id={'tooltip'}
            role={'tooltip'}
            ref={tooltipRef}
            className={twMerge(`
               ${isOpen ? 'visible animate-fadeIn' : 'invisible'}
               bg-lum-black text-lum-white px-[6px] py-[4px] min-h-[20px] text-[12px] rounded absolute text-left break-normal leading-[14px] pointer-events-none
            `)}
            style={{
               ...tooltipStyle,
               maxWidth: 250,
            }}>
            {dataToRender ? renderChildren(dataToRender) : content}
         </div>
         {children}
      </>
   );
};

// renders a component based on type
const RenderComp = (props: any) => {
   switch (props.type) {
      case 'Icon':
         return <Icon {...props} />;
      default:
         return null;
   }
};

export default TippyProvider;
