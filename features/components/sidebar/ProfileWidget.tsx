import Image from 'next/image';
import defaultImageSrc from '../../../public/assets/images/profile.jpg';

type Props = {
   name: string;
   phone: number | string;
   profileImageSrc: string | undefined | null;
};
const ProfileWidget = ({ name, phone, profileImageSrc }: Props) => {
   const displayPhoneNumber = (phoneNumber: number | string): string | null => {
      const cleaned = ('' + phoneNumber).replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
         return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
      return null; // return null if phone number is invalid
   };
   return (
      <div className='flex flex-col items-center'>
         <div className='relative w-[74px] h-[74px]'>
            <Image
               className='rounded-full'
               src={profileImageSrc || defaultImageSrc}
               alt='Profile Image'
               style={{ objectFit: 'cover' }}
               fill
               sizes='74px'
            />
         </div>
         <span className='mt-[3px] text-[15px] text-lum-white font-medium leading-[20px]'>{name}</span>
         {displayPhoneNumber(phone) && (
            <span className='text-[12px] text-lum-gray-450 leading-[20px]'>{displayPhoneNumber(phone)}</span>
         )}
      </div>
   );
};

export default ProfileWidget;
