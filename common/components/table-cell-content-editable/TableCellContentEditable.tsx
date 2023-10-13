'use client';
import { revalidate } from '@/serverActions';
import { StringConverter, getObjectProp } from '@/utilities/helpers';
import { useRouter } from 'next/navigation';
import React from 'react';

interface Props {
   content: string;
}

const TableCellContentEditable = ({ content }: Props) => {
   const router = useRouter();

   return (
      <div className='py-2'>
         {/* DANGEROUSLY SET INNER HTML WAY OF DOING IT */}
         {/* <div className={twMerge('whitespace-normal overflow-hidden')} dangerouslySetInnerHTML={{ __html: convertDbStringToInnerHtml(item.content, router) }} /> */}
         <div className='whitespace-normal overflow-hidden'>
            {convertDbStringToJSX(content, async (e: any, attributeObj: any) => {
               let path = ``;
               switch (attributeObj?.tempNotiType) {
                  case 'individual':
                     path = `/admin/users/${attributeObj?.id}`;
                     break;
                  case 'team':
                     path = `/admin/teams/${attributeObj?.id}`;
                     break;
                  default:
                     break;
               }

               await revalidate({ path: path });
               router.push(path);
            })}
         </div>
      </div>
   );
};

export default TableCellContentEditable;

const DYNAMIC_STRING_INDICATOR = '[*_*][LUM_VAR]';
const convertDbStringToJSX = (dbString: string, callback: (e: any, attrObj: any) => void) => {
   const createNode = (attrObj: any) => {
      const setDataAttributes = (attributes: any) => {
         const attrObj: any = {};
         const dataAttributesToAdd = ['id', 'name', 'notificationTypeId', 'tempNotiType'];

         for (const key of dataAttributesToAdd) {
            const attrName = `data-${StringConverter.convert(key, 'toDashCase')}`;
            attrObj[attrName] = attributes[key];
         }

         return attrObj;
      };

      const value = getObjectProp(attrObj, ['name']);

      let tempClassName = `group rounded-full min-h-[24px] max-h-[24px] mx-[2px] px-[8px] py-[2px] text-[13px] false cursor-pointer select-none`;
      if (attrObj?.tempNotiType === 'individual') tempClassName += ` text-lum-blue-500 bg-lum-blue-100`;
      else if (attrObj?.tempNotiType === 'team') tempClassName += ` text-lum-green-500 bg-lum-green-100`;
      else tempClassName += ` text-lum-gray-500 bg-lum-gray-100`;

      return (
         <span
            key={Math.random().toString()} // since we don't have unique key, but using random can cause unnecessary rerenders
            onClick={(e: any) => {
               callback(e, attrObj);
            }}
            className={tempClassName}
            {...setDataAttributes(attrObj)} // assuming you convert setDataAttributes to return props instead
         >
            {value}
         </span>
      );
   };

   const processNode = (nodeValue: any) => {
      const parts = nodeValue.split(`${DYNAMIC_STRING_INDICATOR}`);
      let jsxArray: any = [];
      parts.forEach((part: any) => {
         if (part.startsWith('{') && part.endsWith('}')) {
            try {
               const dataObj = JSON.parse(part);
               jsxArray.push(createNode(dataObj));
            } catch (e) {
               jsxArray.push(part);
            }
         } else if (part === 'BREAK') jsxArray.push(<br key={Math.random().toString()} />);
         else if (part === 'DBLBREAK') {
            jsxArray.push(<br key={Math.random().toString()} />, <br key={Math.random().toString()} />);
         } else if (part === 'TAB') jsxArray.push('\t');
         else jsxArray.push(part);
      });
      return jsxArray;
   };

   return processNode(dbString);
};

// DANGEROUSLY SET INNER HTML WAY OF DOING IT
// const convertDbStringToInnerHtml = (dbString: string, router: any) => {
//    const createNode = (attrObj: any) => {
//       const setDataAttributes = (element: any, attributes: any) => {
//          attributes['tempId'] = Math.random().toString().slice(2, 12);
//          // id is the id of the obj (team or user), NOT THE NOTIFICATION id
//          const dataAttributesToAdd = ['id', 'name', 'notificationTypeId', 'tempNotiType'];
//          for (const key of dataAttributesToAdd) {
//             const attrName = `data-${StringConverter.convert(key, 'toDashCase')}`;
//             element.setAttribute(attrName, attributes[key]);
//          }
//       };

//       const value = getObjectProp(attrObj, ['name']);
//       const elementNode = document.createElement('span');
//       setDataAttributes(elementNode, attrObj);
//       elementNode.classList.add('name' as any);
//       elementNode.contentEditable = 'false';
//       elementNode.textContent = `${value}`;
//       let tempClassName = `group rounded-full min-h-[24px] max-h-[24px] mx-[2px] px-[8px] py-[2px] text-[13px] false cursor-pointer select-none`;

//       if (attrObj?.tempNotiType === 'individual') tempClassName += ` text-lum-blue-500 bg-lum-blue-100`;
//       else if (attrObj?.tempNotiType === 'team') tempClassName += ` text-lum-green-500 bg-lum-green-100`;

//       elementNode.className = tempClassName;
//       return elementNode;
//    };

//    // Create a temporary div to build up our resulting HTML
//    const tempDiv = document.createElement('div');
//    tempDiv.textContent = dbString;

//    // Recursive function to process nodes
//    const processNode = (node: any) => {
//       if (node.nodeType === 3) {
//          //  split by DYNAMIC_STRING_INDICATOR to detect placeholders and JSON objects
//          const parts = node.nodeValue.split(`${DYNAMIC_STRING_INDICATOR}`);
//          let replaceNodes: (Node | string)[] = [];

//          parts.forEach((part: any, idx: number) => {
//             if (part.startsWith('{') && part.endsWith('}')) {
//                try {
//                   const dataObj = JSON.parse(part);
//                   const elementNode = createNode(dataObj);
//                   replaceNodes.push(elementNode);
//                } catch (e) {
//                   // not a valid JSON object
//                   replaceNodes.push(part);
//                }
//             } else if (part === 'BREAK') {
//                replaceNodes.push(document.createElement('br'));
//             } else if (part === 'DBLBREAK') {
//                replaceNodes.push(document.createElement('br'));
//                replaceNodes.push(document.createElement('br'));
//             } else if (part === 'TAB') replaceNodes.push('\t');
//             else replaceNodes.push(part);
//          });

//          if (replaceNodes.length > 1) node.replaceWith(...replaceNodes);
//       } else if (node.nodeType === 1) {
//          // for element nodes, process their child nodes
//          Array.from(node.childNodes).forEach((child) => processNode(child));
//       }
//    };

//    processNode(tempDiv);
//    return tempDiv.innerHTML;
// };
