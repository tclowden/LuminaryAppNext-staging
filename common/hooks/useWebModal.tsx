'use client'

import { closeModal as closeModalAction, openModal as openModalAciton } from '@/store/slices/webModalSlice';
import { useAppDispatch } from '@/store/hooks';
import { WebModalType } from '@/common/components/webModals/modals';

const useWebModal = () => {
   const dispatch = useAppDispatch()

   const openModal = (modalType: WebModalType) => {
      dispatch(openModalAciton(modalType));
   }

   const closeModal = () => {
      dispatch(closeModalAction());
   }

   return { openModal, closeModal }
};

export default useWebModal;
