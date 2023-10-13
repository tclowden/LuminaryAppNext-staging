import { useCallback } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { setAddToast } from '../../store/slices/toast';

const useToaster = () => {
   const dispatch = useAppDispatch();

   const makeToast = useCallback((success: boolean = true, text: string) => {
      dispatch(
         setAddToast({
            iconName: success ? 'CheckMarkCircle' : 'XMarkCircle',
            details: [{ label: success ? 'Success' : 'Error', text }],
            variant: success ? 'success' : 'danger',
            autoCloseDelay: 5,
         })
      );
   }, []);
   return makeToast;
};

export default useToaster;
