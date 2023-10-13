'use client'

import React, { MouseEvent } from 'react';
import { closeModal } from '@/store/slices/webModalSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import XMark from './cancel-x.svg'

import ModalContactLuminaryApps from './modalContent/modalContactLuminaryApps';
import Icon from '../Icon';

/**
 * Add your modal name to the modal types 
 */
export type WebModalType = 'contact-luminary-apps' | null


const WebModalSelector = ({ handleClose }: {
   handleClose: () => void
}) => {

   const { modalType } = useAppSelector((state) => state.webModal)

   /**
    * Add your Modal Content to the switch with the name that you specified in the types
    */
   switch (modalType) {
      case 'contact-luminary-apps':
         return <ModalContactLuminaryApps handleClose={handleClose} />
      default:
         return null
   }
}

const WebModals = () => {
   const { isOpen } = useAppSelector((state) => state.webModal)
   const dispatch = useAppDispatch()

   const handleClose = () => { dispatch(closeModal()) };
   const handleModalClick = (e: MouseEvent<HTMLDivElement>) => { e.stopPropagation() };

   if (!isOpen) { return null }
   return (
      <div className="fixed overflow-y-auto z-50 w-screen h-screen p-3 inset-0 md:flex md:items-center md:justify-center bg-lum-black bg-opacity-50" onClick={handleClose}>
         <div className="relative py-9 px-7 md:px-20 md:py-9 bg-[#F5F8F9] rounded-[12px] border border-neutral-400" onClick={handleModalClick}>
            <div className='absolute top-3 right-3 p-2 cursor-pointer rounded-xl group hover:brightness-90' onClick={handleClose}>
               <Icon className='fill-[#D3DEE1] ' name='XCross' height='18' width='18' />
            </div>

            <WebModalSelector handleClose={handleClose} />
         </div>
      </div>
   );
};

export default WebModals;
