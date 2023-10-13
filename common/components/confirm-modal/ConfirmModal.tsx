'use client';
import React from 'react';
import Modal from '../modal/Modal';

interface Props {
   value?: string;
   handleOnClose: (e: any) => void;
   handleOnConfirm: (e: any) => void;
   open: boolean;
   zIndex?: number;
   confirmationText?: string;
}

const ConfirmModal = ({ value, open, handleOnClose, handleOnConfirm, zIndex = 100, confirmationText }: Props) => {
   return (
      <Modal
         isOpen={open}
         onClose={handleOnClose}
         size='small'
         // closeOnBackdropClick
         zIndex={zIndex}
         title={'Confirmation'}
         primaryButtonText={'Confirm'}
         secondaryButtonText={'Cancel'}
         primaryButtonCallback={handleOnConfirm}>
         <div>{confirmationText ? confirmationText : `Are you sure you want to delete ${value}?`}</div>
      </Modal>
   );
};

export default ConfirmModal;
