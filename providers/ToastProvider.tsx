'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Toast from '../features/components/toast/Toast';
import { ToastWithId } from '../store/slices/toast';
import { RootState } from '../store/store';

type ToastStylesState = { [index: string | number]: { [index: string]: string } };

const TOAST_OFFSET = 10;
const TOAST_POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

const ToastProvider = ({ children, ...otherProps }: { children: React.ReactNode }) => {
   const toastState = useSelector((state: RootState) => state.toast);
   const [toastStyles, setToastStyles] = useState<ToastStylesState>({});

   useEffect(() => {
      const calculateToastPositions = () => {
         const toastStylesState: ToastStylesState = {};

         TOAST_POSITIONS.forEach((position) => {
            // Filter toasts by position
            const positionFilteredToasts = toastState.toasts.filter((toast) => {
               if (!toast.position && position === 'bottom-left') return true;
               return toast.position === position;
            });
            // if no toasts in position, then skip to next position
            if (!positionFilteredToasts.length) return;

            const [yStyle, xStyle] = position.split('-');
            // Loop through each positionFilteredToasts and determine styles based on previous toast index, and then set styleState
            positionFilteredToasts.reverse().forEach((toast: any, index: number) => {
               const styles: any = { [xStyle]: `${TOAST_OFFSET}px`, [yStyle]: `${TOAST_OFFSET}px` };
               if (index > 0) {
                  toastStylesState[toast.id] = styles;
                  const prevToastId = positionFilteredToasts[index - 1].id;
                  const prevToastYPosition = +toastStylesState[prevToastId][yStyle].replace('px', '');
                  const prevToastHeight =
                     positionFilteredToasts[index - 1].details.length > 1
                        ? 52 + 38 * (positionFilteredToasts[index - 1].details.length - 1)
                        : 50;

                  styles[yStyle] = `${prevToastYPosition + prevToastHeight + TOAST_OFFSET}px`;
               }
               // Set toast styles with toast id as the index
               toastStylesState[toast.id] = styles;
            });
         });
         setToastStyles({ ...toastStylesState });
      };

      calculateToastPositions();
   }, [toastState.toasts]);

   return (
      <>
         {toastState.toasts.map((toast: ToastWithId) => (
            <Toast key={toast.id} {...toast} styles={toastStyles[toast.id]} />
         ))}
         {children}
      </>
   );
};

export default ToastProvider;
