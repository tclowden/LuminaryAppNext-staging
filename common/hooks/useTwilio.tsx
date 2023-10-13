'use client';
import { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { initDevice } from '../../store/slices/twilio';

const useTwilio = () => {
   let dispatch = useAppDispatch();
   useEffect(() => {
      dispatch(initDevice());
   }, []);
};

export default useTwilio;
