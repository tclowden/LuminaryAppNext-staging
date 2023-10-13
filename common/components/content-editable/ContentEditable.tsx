import React, { useState, useRef, useEffect } from 'react';
import { StringConverter, deepCopy, getObjectProp, strToCamelCase } from '@/utilities/helpers';
import OptionSelector from '../option-selector/OptionSelector';
import { twMerge } from 'tailwind-merge';
import Icon from '../Icon';
import useDebounce from '@/common/hooks/useDebounce';
import { useAppSelector } from '@/store/hooks';
import { selectUser } from '@/store/slices/user';
import { fetchDbApi } from '@/serverActions';

interface Props {
   // default 'textarea' props to try to treat the content-editable component as similar to a textarea as possible
   disabled?: boolean;
   name?: string;
   placeholder?: string;
   label?: string;
   required?: boolean;
   errorMessage?: string;
   onChange: (
      e: any,
      options: { dbFormattedString?: string; searchInput?: string | null; tagged: Array<any>; newTermSelected: boolean }
   ) => void;
   onBlur?: (e: any) => void;
   // an array of tables to query from
   tablesToQueryFrom: Array<'users' | 'teams'>;
   // callback whenever a pill is click on
   // could as a link or a modal or whatever the user decides :)
   onPillClick?: (e: any, pillClicked: any) => void;
   // default innerHTML, on load... pass in the string from the db
   defaultText: string;
   // default tagged objects (users, teams, etc...), on load... pass in the array of objects from the notifications table
   defaultTagged: Array<any>;
   hardReset?: boolean;
}

// SOMETHING TO THINK ABOUT...
// WHEN TAGGING A TEAM... instead of populating the tagged obj with teams and users... just instantly populate it with all usres from the team and just users...
// just so the tagged object is literally just tagged users...
// downside of that... what if we wanna tag other things? like products & leads?

// if you change the DYNAMIC_STRING_INDICATOR, remember to change the redux to replace all the breaks at the end of the string...
// located at the end of convertInnerHtmlToDbString
const DYNAMIC_STRING_INDICATOR = '[*_*][LUM_VAR]';
type TempNotiTypes = 'individual' | 'team';

const ContentEditable = ({
   label,
   required,
   errorMessage,
   onChange,
   disabled,
   name,
   onBlur,
   placeholder,
   defaultText,
   defaultTagged,
   onPillClick,
   tablesToQueryFrom,
   hardReset,
}: Props) => {
   const user = useAppSelector(selectUser);
   const [loading, setLoading] = useState<boolean>(false);

   const [content, setContent] = useState('');

   // not using this at the moment, but could eventually..
   const [contentToSaveToDb, setContentToSaveToDb] = useState<string>();

   // tagged objects here
   const [tagged, setTagged] = useState<Array<any>>([]);

   const [inputFocued, setInputFocused] = useState(false);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [searchTerm, setSearchTerm] = useState<string>();

   const [queryResults, setQueryResults] = useState<Array<any>>([]);
   const [noResultsFound, setNoResultsFound] = useState<boolean>(false);
   const [notificationTypes, setNotificationTypes] = useState<Array<any>>([]);

   const initDataSet = useRef<any>({ defaultText: false, defaultTagged: false });
   const divRef = useRef<any>(null);

   const resetContentEditable = () => {
      // clear out certain states whenever leaving the component
      setQueryResults([]);
      setSearchTerm(undefined);
      setShowSuggestions(false);
      setTagged([]);
      setContentToSaveToDb(undefined);
      setInputFocused(false);
      setContent('');
      initDataSet.current = { defaultText: false, defaultTagged: false };
      if (divRef?.current?.innerHTML) divRef.current.innerHTML = '';
   };

   useEffect(() => {
      return () => {
         resetContentEditable();
      };
   }, []);

   useEffect(() => {
      if (hardReset) resetContentEditable();
   }, [hardReset]);

   useEffect(() => {
      const isDefaultText = !!defaultText && !!(defaultText?.length > 0);
      if (isDefaultText && !!divRef?.current && !initDataSet.current?.defaultText) {
         setContentToSaveToDb(defaultText);
         const nodes = convertDbStringToInnerHtml(defaultText);
         nodes.forEach((node: any) => divRef.current.appendChild(node));
      }

      const isDefaultTagged = !!defaultTagged && !!defaultTagged?.length;
      if (isDefaultTagged && !initDataSet.current?.defaultTagged) {
         setTagged(defaultTagged.map((tag: any) => ({ ...tag, tagged: tag?.taggedUser })));
      }

      initDataSet.current['defaultText'] = true;
      initDataSet.current['defaultTagged'] = true;
   }, [divRef, defaultText, initDataSet]);

   const handleChange = (
      e: any,
      updatedSearchTerm?: string,
      termSelected: boolean = false,
      updatedTagged: Array<any> = []
   ) => {
      const tempInnerHtml = convertInnerHtmlToDbString(divRef.current.innerHTML);
      setContentToSaveToDb(tempInnerHtml || undefined);

      onChange &&
         onChange(e, {
            tagged: updatedTagged,
            newTermSelected: termSelected,
            dbFormattedString: tempInnerHtml || undefined,
            searchInput: updatedSearchTerm || null,
         });
   };

   useEffect(() => {
      // create an observer instance linked to the callback function
      const observer = new MutationObserver((mutationsList) => {
         for (let mutation of mutationsList) {
            if (mutation.removedNodes.length) {
               for (let node of mutation.removedNodes) {
                  //@ts-ignore
                  if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SPAN') {
                     const nodeToRemove = node as any;
                     // ... further processing ...
                     const nodeToRemoveId = nodeToRemove.getAttribute('data-id');
                     const childNodes = Array.from(mutation.target.childNodes);
                     if (!!childNodes?.length) {
                        const nodesWithSameId = childNodes.some((node: any) => {
                           if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
                              const idAttr = node.getAttribute('data-id');
                              if (idAttr === nodeToRemoveId) return node;
                           }
                        });

                        if (!nodesWithSameId) {
                           const updatedTagged = deepCopy(tagged).map((noti: any) => {
                              const notiType = nodeToRemove.getAttribute('data-temp-noti-type');
                              let setRowAchived = false;
                              if (notiType === 'team' && noti?.taggedTeamId === nodeToRemoveId) setRowAchived = true;
                              else if (notiType === 'users' && noti?.taggedUserId === nodeToRemoveId)
                                 setRowAchived = true;
                              return {
                                 ...noti,
                                 ...(setRowAchived && { archived: true }),
                              };
                           });

                           // update the tag and call the handle change function
                           setTagged(updatedTagged);
                           handleChange(null, searchTerm, true, updatedTagged);
                        }
                     }
                  }
               }
            }
         }
      });

      // start observing the target node for configured mutations
      const targetNode = divRef.current;
      observer.observe(targetNode, { childList: true, subtree: true });
      // cleanup observer on component unmount
      return () => {
         observer.disconnect();
      };
   }, [tagged]);

   const getAbsoluteCursorPosition = (selection: Selection, rootNode: Node) => {
      const range = selection.getRangeAt(0);
      const clonedRange = range.cloneRange();
      clonedRange.selectNodeContents(rootNode);
      clonedRange.setEnd(range.endContainer, range.endOffset);
      return clonedRange.toString().length;
   };

   // let updatedTagged: any = useRef([]);
   const handleContentChange = (e: any) => {
      // don't allow just enter!
      if (e.key === 'Enter' && !e.shiftKey) return e.preventDefault();
      // if (e.key === 'Backspace' && e.type === 'keydown') updatedTagged.current = handleBackspace(e) || [];
      if (e.type === 'keydown') return;

      if (noResultsFound) setNoResultsFound(false);

      const textContent = e?.target.textContent;

      const selection = window.getSelection();
      if (!selection) return;

      const cursorPosition = getAbsoluteCursorPosition(selection, e?.target);

      const textBeforeCursor = textContent.slice(0, cursorPosition);
      const lastAtPosition = textBeforeCursor.lastIndexOf('@');

      let tempSearchTerm = null;

      if (lastAtPosition !== -1) {
         tempSearchTerm = textBeforeCursor.slice(lastAtPosition + 1, cursorPosition);
         if (!showSuggestions) setShowSuggestions(true);
      } else if (lastAtPosition === -1 && showSuggestions) {
         tempSearchTerm = undefined;
         setShowSuggestions(false);
         setQueryResults([]);
      }

      setContent(e?.target?.textContent);
      setSearchTerm(tempSearchTerm);
      addEventDetails(e);
      handleChange(e, tempSearchTerm, false, []);
      // if (!!updatedTagged?.current?.length) setTagged(updatedTagged.current);
      // handleChange(e, tempSearchTerm, !!updatedTagged.current?.length ? true : false, updatedTagged.current);
      // updatedTagged.current = [];
   };

   const convertInnerHtmlToDbString = (innerHTML: string) => {
      // create a temporary div element to help process the content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = innerHTML;

      // function to extract data attributes from an element
      const extractDataAttributes = (element: any) => {
         const obj: any = {};
         for (const attr of element?.attributes) {
            if (attr.name.startsWith('data-')) {
               // removing 'data-' prefix
               obj[StringConverter.convert(attr.name.slice(5), 'toCamelCase')] = attr.value;
            }
         }
         return obj;
      };

      let resultStr = '';
      const processNode = (node: any) => {
         if (node.nodeType === 3) {
            resultStr += node.nodeValue;
         } else if (node.nodeType === 1) {
            const nodeCopy = node as HTMLElement;
            if (nodeCopy.tagName.toLowerCase() === 'span' && nodeCopy.hasAttribute('data-id')) {
               const objDetails = extractDataAttributes(nodeCopy);
               const replaceText = `${DYNAMIC_STRING_INDICATOR}${JSON.stringify(
                  objDetails
               )}${DYNAMIC_STRING_INDICATOR}`;
               resultStr += replaceText;
            } else if (nodeCopy.tagName.toLowerCase() === 'div' && nodeCopy.innerHTML !== '<br>') {
               // process child nodes recursively
               Array.from(nodeCopy.childNodes).forEach(processNode);
               // add a break after processing child nodes
               resultStr += `${DYNAMIC_STRING_INDICATOR}BREAK${DYNAMIC_STRING_INDICATOR}`;
            } else if (
               nodeCopy.tagName.toLowerCase() === 'br' ||
               (nodeCopy.tagName.toLowerCase() === 'div' && nodeCopy.innerHTML === '<br>')
            ) {
               resultStr += `${DYNAMIC_STRING_INDICATOR}BREAK${DYNAMIC_STRING_INDICATOR}`;
            }
         }
      };

      Array.from(tempDiv.childNodes).forEach(processNode);

      // remove any break or space at the end, if there is no nodes following the break or spave
      resultStr = resultStr.replace(/( |\[\*_\*\]\[LUM_VAR\]BREAK\[\*_\*\]\[LUM_VAR\])+$/g, '');
      return resultStr;
   };

   const convertDbStringToInnerHtml = (dbString: string) => {
      // Create a temporary div to build up our resulting HTML
      const tempDiv = document.createElement('div');
      tempDiv.textContent = dbString;

      // Recursive function to process nodes
      const processNode = (node: any) => {
         if (node.nodeType === 3) {
            //  split by DYNAMIC_STRING_INDICATOR to detect placeholders and JSON objects
            const parts = node.nodeValue.split(`${DYNAMIC_STRING_INDICATOR}`);
            let replaceNodes: (Node | string)[] = [];

            parts.forEach((part: any, idx: number) => {
               if (part.startsWith('{') && part.endsWith('}')) {
                  try {
                     const dataObj = JSON.parse(part);
                     const elementNode = createNode(dataObj);
                     replaceNodes.push(elementNode);
                  } catch (e) {
                     // not a valid JSON object
                     replaceNodes.push(part);
                  }
               } else if (part === 'BREAK') {
                  replaceNodes.push(document.createElement('br'));
               } else if (part === 'DBLBREAK') {
                  replaceNodes.push(document.createElement('br'));
                  replaceNodes.push(document.createElement('br'));
               } else if (part === 'TAB') replaceNodes.push('\t');
               else replaceNodes.push(part);
            });

            if (replaceNodes.length > 1) node.replaceWith(...replaceNodes);
         } else if (node.nodeType === 1) {
            // for element nodes, process their child nodes
            Array.from(node.childNodes).forEach((child) => processNode(child));
         }
      };

      processNode(tempDiv);

      // return tempDiv.innerHTML;
      return Array.from(tempDiv.childNodes);
   };

   const addEventDetails = (e: any) => {
      if (name) e.target.name = name;
      e.target.type = 'content-editable';
   };

   const createNode = (attrObj: any) => {
      const setDataAttributes = (element: any, attributes: any) => {
         attributes['tempId'] = Math.random().toString().slice(2, 12);
         // id is the id of the obj (team or user), NOT THE NOTIFICATION id
         const dataAttributesToAdd = ['id', 'name', 'notificationTypeId', 'tempNotiType'];
         for (const key of dataAttributesToAdd) {
            const attrName = `data-${StringConverter.convert(key, 'toDashCase')}`;
            element.setAttribute(attrName, attributes[key]);
         }
      };

      const value = getObjectProp(attrObj, ['name']);
      const elementNode = document.createElement('span');
      setDataAttributes(elementNode, attrObj);
      elementNode.classList.add('name' as any);
      elementNode.contentEditable = 'false';
      elementNode.textContent = `${value}`;
      if (onPillClick) {
         elementNode.onclick = (e: any) => {
            onPillClick(e, attrObj);
         };
      }
      let tempClassName = `group rounded-full min-h-[24px] max-h-[24px] mx-[2px] px-[8px] py-[2px] text-[13px] false cursor-pointer select-none`;

      if (attrObj?.tempNotiType === 'individual') tempClassName += ` text-lum-blue-500 bg-lum-blue-100`;
      else if (attrObj?.tempNotiType === 'team') tempClassName += ` text-lum-green-500 bg-lum-green-100`;
      else tempClassName += ` text-lum-gray-500 bg-lum-gray-100`;

      elementNode.className = tempClassName;
      return elementNode;
   };

   const adjustRangeToAtSymbol = (div: any, range: Range, atSymbolPosition: number, searchTerm: string) => {
      // keep track of the current position as we iterate through the nodes.
      let position = 0;
      // loop through child nodes...
      for (const node of div?.childNodes) {
         // if text node
         if (node?.nodeType === 3) {
            const nodeLength = node.textContent.length;
            // check if the @ symbol is within this text node.
            if (position + nodeLength > atSymbolPosition) {
               const offsetInNode = atSymbolPosition - position;
               range.setStart(node, offsetInNode);
               const endOffset = Math.min(nodeLength, offsetInNode + 1 + searchTerm.length);
               range.setEnd(node, endOffset);
               // set range and exit loop
               return;
            }
            position += nodeLength;
         }
         // if an element node (ex) <span>, <div>, etc...)
         else if (node?.nodeType === 1) {
            // adjust the position by the length of its content.
            position += node.textContent.length;
         }
      }
   };

   const handleTermSelect = (e: any, selectedTerm: any) => {
      type Notification = {
         id: string | null;
         notificationType: any;
         notificationTypeId: string;
         tagged: any;
         taggedByUserId: string;
         taggedUserId?: string;
         taggedTeamId?: string;
      };

      const taggedCopy = [...tagged];
      // const alreadyTagged = taggedCopy?.some((tagged: any) => tagged?.id === selectedTerm?.id);
      const alreadyTagged = taggedCopy?.some((tagged: any) => tagged?.taggedUserId === selectedTerm?.id);
      // if (!alreadyTagged) taggedCopy.push(selectedTerm);

      // format notificationType
      if (!alreadyTagged) {
         let obj: Notification = {
            id: null,
            notificationType: selectedTerm?.notificationType,
            notificationTypeId: selectedTerm?.notificationTypeId,
            tagged: selectedTerm,
            taggedByUserId: user?.id || '',
         };
         if (selectedTerm?.notificationType?.name === 'Individual') obj['taggedUserId'] = selectedTerm?.id;
         else if (selectedTerm?.notificationType?.name === 'Team') obj['taggedTeamId'] = selectedTerm?.id;

         taggedCopy.push(obj);
      }
      const tempTagged = taggedCopy;

      const selectedValue = getObjectProp(selectedTerm, ['name']);

      const atIndex = content.indexOf('@');
      const result = content.substring(0, atIndex);
      setContent(`${result} ${selectedValue}`);

      const selection = window.getSelection();
      if (!selection) return;

      const range = selection.getRangeAt(0);
      const elNode = createNode(selectedTerm);

      const divTextContent = divRef.current.textContent;
      // find position of the last '@' in the entire div's content...
      const atSymbolPosition = divTextContent.lastIndexOf('@');
      if (atSymbolPosition !== -1) {
         adjustRangeToAtSymbol(divRef.current, range, atSymbolPosition, searchTerm || '');
         // replace '@' with elNode
         range.deleteContents();
         range.insertNode(elNode);
         // set the caret right after the elNode
         setCaretAtEnd(elNode);
      }

      setShowSuggestions(false);
      setSearchTerm(undefined);
      setQueryResults([]);
      setTagged(tempTagged);
      handleChange(e, undefined, true, tempTagged);
   };

   const setCaretAtEnd = (node: any) => {
      const range = document.createRange();
      const selection = window.getSelection();

      // set the range right after the provided node
      range.setStartAfter(node);
      // collapse the range to the end point.
      range.collapse(true);

      selection?.removeAllRanges();
      selection?.addRange(range);
   };

   // this utility is called whenever searching for a user or team... this is to add to the object...
   // is only called once and only when searching...
   const fetchNotificationTypes = async () => {
      return fetchDbApi(`/api/v2/notification-types`, {
         method: 'GET',
         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.token}` },
      });
   };

   useDebounce(
      async () => {
         let copyNotificationTypes = notificationTypes;

         if (!copyNotificationTypes?.length) {
            await fetchNotificationTypes()
               .then((notiTypes: any) => {
                  copyNotificationTypes = notiTypes;
                  setNotificationTypes(copyNotificationTypes);
               })
               .catch((err: any) => {
                  console.log('err fetching noti types in use debounce', err);
               });
         }

         if (!!searchTerm?.length && !!tablesToQueryFrom?.length) {
            const token = user?.token;
            let results: Array<any> = [];

            if (tablesToQueryFrom?.includes('users')) {
               let userSearchRes = await fetchDbApi(`/api/v2/users/query?fullName=${searchTerm}`, {
                  method: 'GET',
                  headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
               });

               if (!!userSearchRes?.length) {
                  const individualNotiType = copyNotificationTypes.find(
                     (notiType: any) => notiType.name === 'Individual'
                  );

                  results = [
                     ...results,
                     ...userSearchRes?.map((user: any) => ({
                        ...user,
                        name: user?.fullName,
                        notificationTypeId: individualNotiType?.id,
                        notificationType: individualNotiType,
                        tempNotiType: 'individual',
                     })),
                  ];
               }
            }

            if (tablesToQueryFrom?.includes('teams')) {
               const teamNotiType = copyNotificationTypes.find((notiType: any) => notiType.name === 'Team');
               let teamSearchRes = await fetchDbApi(`/api/v2/teams/query?name=${searchTerm}`, {
                  method: 'GET',
                  headers: { 'Content-type': 'application/json', Authorization: `Bearer ${token}` },
               });

               if (!!teamSearchRes?.length) {
                  results = [
                     ...results,
                     ...teamSearchRes?.map((team: any) => ({
                        ...team,
                        notificationTypeId: teamNotiType?.id,
                        notificationType: teamNotiType,
                        tempNotiType: 'team',
                     })),
                  ];
               }
            }

            if (!results?.length && !noResultsFound) setNoResultsFound(true);
            else if (!!results?.length && noResultsFound) setNoResultsFound(false);
            setQueryResults(results);
         }
      },
      [searchTerm, tablesToQueryFrom],
      500
   );

   return (
      <div className='relative'>
         {label && (
            <>
               <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>
                  {label}
                  {required && <span className='pl-[3px]'>*</span>}
               </span>
            </>
         )}
         <div
            ref={divRef}
            data-placeholder={placeholder}
            className={twMerge(`
               w-full min-h-[70px] p-[10px] rounded resize-none bg-lum-gray-50 dark:bg-lum-gray-700 text-lum-gray-700 dark:text-lum-white placeholder:text-lum-gray-400 border-[1px] border-solid 
               ${errorMessage ? 'border-lum-red-500' : 'border-lum-gray-100 dark:border-lum-gray-600'}
               ${disabled ? 'opacity-70 hover:cursor-not-allowed text-lum-gray-400' : ''}
            `)}
            // ${!divRef?.current?.innerHTML ? 'before:content-[attr(data-placeholder)]' : ''}
            contentEditable
            onInput={(e: any) => {
               handleContentChange(e);
            }}
            onKeyDown={(e: any) => {
               handleContentChange(e);
            }}
            onFocus={(e: any) => {
               addEventDetails(e);
               setInputFocused(true);
            }}
            onBlur={(e: any) => {
               addEventDetails(e);
               setInputFocused(false);
               onBlur && onBlur(e);
            }}
         />

         <OptionSelector
            isLoading={
               !!(!!searchTerm?.length && !!tablesToQueryFrom?.length && !queryResults?.length && !noResultsFound)
            }
            noOptionsDisplayText={noResultsFound ? `No Users or Teams found...` : undefined}
            autoFocus={false}
            textKeyPath={['name']}
            options={queryResults}
            onOptionSelect={handleTermSelect}
            showOptions={showSuggestions}
            setShowOptions={(bool: boolean) => {
               setShowSuggestions(bool);
            }}
            siblingRef={divRef}
         />

         {errorMessage && (
            <div className='flex pt-[6px]'>
               <Icon
                  className='min-w-[11px] min-h-[11px] fill-lum-red-500'
                  name='Warning'
                  height='11'
                  width='11'
                  viewBox='0 0 16 16'
               />
               <span className='mt-[-3px] pl-[6px] text-[11px] leading-[14px] text-lum-gray-600 dark:text-lum-gray-300'>
                  {errorMessage}
               </span>
            </div>
         )}
      </div>
   );
};

export default ContentEditable;

// NOT BEING USED RIGHT NOW...
// const handleBackspace = (e: any) => {
//    const isCursorAfterSpan = (selection: any, target: Node): ChildNode | undefined => {
//       const cursorPosition = getAbsoluteCursorPosition(selection, target);
//       // traverse child nodes
//       let contentLength = 0;
//       for (let i = 0; i < target.childNodes.length; i++) {
//          const node = target.childNodes[i];
//          // console.log('node.nodeName:', node.nodeName);
//          // console.log('node.nodeType:', node.nodeType);
//          // if the node is a text node, add to length
//          if (node.nodeType === Node.TEXT_NODE) contentLength += node.textContent?.length || 1;
//          // if the node is a BR element, add to length
//          else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'BR') contentLength += 1;
//          // if the node is SPAN el, check cursor pos
//          else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
//             // add the length of the span content
//             contentLength += node.textContent?.length || 0;
//             // if the cursor position is right after the  span
//             if (contentLength === cursorPosition) return node;
//          }
//       }
//       return;
//    };

//    const selection: any = window.getSelection();
//    const nodeToRemove: any = isCursorAfterSpan(selection, e.target);
//    if (nodeToRemove) {
//       // remove from dom
//       nodeToRemove.remove();
//       // also, need to set the obj in the tagged archived:true
//       const nodeToRemoveId = nodeToRemove.getAttribute('data-id');
//       // we now have that user or team id...
//       // if the team or user is mentioned more than once... therefore there are multiple notes with data-id being the same
//       // don't do anything...
//       // we are only saving one row per user/team to be tagged / notified

//       // see if there are still childNodes with data-id being the same id...
//       // if so, just move on
//       // if not, archive the notification row
//       // at this point, because we are removing the node, there shouldn't be any found with the nodeToRemove.id, if only one instance
//       const childNodes = Array.from(e.target?.childNodes);
//       if (!!childNodes?.length) {
//          const nodesWithSameId = childNodes.some((node: any) => {
//             if (node.nodeType === Node.ELEMENT_NODE && node.nodeName === 'SPAN') {
//                const idAttr = node.getAttribute('data-id');
//                if (idAttr === nodeToRemoveId) return node;
//             }
//          });
//          if (!nodesWithSameId) {
//             const updatedTagged = deepCopy(tagged).map((noti: any) => ({
//                ...noti,
//                ...(noti?.tagged?.id === nodeToRemoveId && {
//                   archived: true,
//                }),
//             }));
//             return updatedTagged;
//          }
//       }
//    }

//    return undefined;
// };
