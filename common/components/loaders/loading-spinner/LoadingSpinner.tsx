import Image from 'next/image';
import { useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/user';
import DarkSpinnerSrc from '../../../../public/assets/images/spinner-dark.png';
import LightSpinnerSrc from '../../../../public/assets/images/spinner-light.png';

type Props = {
   isOpen: boolean;
   size?: number;
   theme?: 'light' | 'dark';
};

const LoadingSpinner = ({ isOpen, size = 25, theme }: Props) => {
   const user = useAppSelector(selectUser);
   const isDarkMode = theme ? !!(theme === 'light') : user.prefersDarkMode ? true : false;

   return (
      <>
         {isOpen ? (
            isDarkMode ? (
               <Image
                  src={DarkSpinnerSrc}
                  alt={'Dark Mode Spinner'}
                  className='animate-spin'
                  style={{ animationDirection: 'reverse' }}
                  width={size}
                  priority
               />
            ) : (
               <Image
                  src={LightSpinnerSrc}
                  alt={'Light Mode Spinner'}
                  className='animate-spin'
                  style={{ animationDirection: 'reverse' }}
                  width={size}
                  priority
               />
            )
         ) : null}
      </>
   );
};

export default LoadingSpinner;
