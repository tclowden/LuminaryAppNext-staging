import React, { useState, useRef } from 'react';
import Button from '../../../../../common/components/button/Button';
import Icon from '../../../../../common/components/Icon';

interface Element {
   key: string,
   keyPath: string;
   value: string;
}[]

const ContentEditable = ({ label, options, required, errorMessage, onChange }: {
   label?: string;
   options: Element[];
   required?: boolean;
   errorMessage?: string;
   onChange?: (e: any) => void;
}) => {
   const [text, setText] = useState('');
   const [inputFocused, setInputFocused] = useState(false);
   const editableRef = useRef<HTMLDivElement>(null);

   const labelHtmlFor = label ? label.replace(' ', '-').toLowerCase() : '';

   const handleInputChange = (event: React.ChangeEvent<HTMLDivElement>) => {
      setText(event.target.innerHTML);
   };

   const handleElementSelect = (element: Element) => {
      if (editableRef.current) {
         const selection = window.getSelection();
         const range = selection?.getRangeAt(0);
         const selectedText = range?.toString();
         const elementNode = document.createElement('span');
         elementNode.classList.add(element.keyPath);
         elementNode.contentEditable = 'false';
         elementNode.textContent = `${element.keyPath}: ${JSON.stringify(element.value)}`;
         elementNode.className = `group rounded text-lum-white min-h-[24px] max-h-[24px] mx-[2px] px-[5px] py-[2px] text-[13px] false bg-lum-gray-450 hover:bg-lum-gray-350`

         if (selectedText) {
            range?.deleteContents();
            range?.insertNode(elementNode);
         } else {
            editableRef.current.appendChild(elementNode);
         }
      }
   };

   const handleBackspace = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Backspace') {
         const selection = window.getSelection();
         const range = selection?.getRangeAt(0);
         const currentElement = range?.startContainer.parentElement;

         if (currentElement && currentElement.nodeName === 'SPAN') {
            const previousElement = currentElement.previousSibling;

            if (previousElement && previousElement.nodeName === 'SPAN') {
               range?.setStartAfter(previousElement);
               range?.setEndAfter(currentElement);
               range?.deleteContents();
               event.preventDefault();
            } else {
               currentElement.remove();
               event.preventDefault();
            }
         }
      }
   };

   const handleInputFocus = () => {
      setInputFocused(true);
   };

   const handleInputBlur = () => {
      setInputFocused(false);
   };

   return (
      <div>
         <label className='relative block' htmlFor={labelHtmlFor} >
            {label && (
               <>
                  <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>
                     {label}
                     {required && <span className='pl-[3px]'>*</span>}
                  </span>
               </>
            )}
            <div
               ref={editableRef}
               className={`w-full min-h-[40px] p-[10px] rounded resize-none cursor-text bg-lum-gray-50 dark:bg-lum-gray-700 text-lum-gray-700 dark:text-lum-white placeholder:text-lum-gray-400 border-[1px] border-solkeyPath border-lum-gray-100 dark:border-lum-gray-600`}
               contentEditable
               onInput={handleInputChange}
               onKeyDown={handleBackspace}
               onFocus={handleInputFocus}
               onBlur={handleInputBlur}
               onChange={(e: any) => {
                  onChange && onChange(e);
               }}
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

            {inputFocused && (
               <div className='absolute z-10 mt-1 p-4 flex gap-2 flex-wrap rounded bg-lum-gray-50 dark:bg-lum-gray-700'
                  onMouseDown={(event) => { event.preventDefault() }}
               > <div className='text-sm  text-lum-gray-600 dark:text-lum-gray-300'>Insert Data:</div>
                  {options.length > 0
                     ? options
                        .sort((a, b) => a.keyPath > b.keyPath ? 1 : -1)
                        .map((element) => (
                           <Button
                              key={element.keyPath}
                              size='xs'
                              onClick={() => handleElementSelect(element)}
                           >
                              {element.keyPath}
                           </Button>
                        ))
                     : <div className='flex'>
                        <Icon
                           className='min-w-[11px] min-h-[11px] fill-lum-yellow-500'
                           name='Warning'
                           height='11'
                           width='11'
                           viewBox='0 0 16 16'
                        />
                        <span className='mt-[-3px] pl-[6px] text-[11px] leading-[14px] text-lum-gray-600 dark:text-lum-gray-300'>
                           Please select a request for dynamic inputs
                        </span>
                     </div>
                  }
               </div>
            )}
            {/* <p>Current Text: {text}</p> */}
         </label>
      </div>
   );
};

export default ContentEditable;


// elementNode.contentEditable = 'false'