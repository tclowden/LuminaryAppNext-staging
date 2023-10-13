import { twMerge } from 'tailwind-merge';

// accept?: string; // ex) ".jpg, .jpeg, .png" || "image/*,.pdf" || ".doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document

interface Props {
   onInput: (e: any) => void;
   children: React.ReactNode;
   buttonClassName?: string;
}

const UploadFileButton = ({
   onInput,
   children,
   buttonClassName,
   ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & Props) => {
   return (
      <>
         <label
            htmlFor='file-upload'
            className={twMerge(`
               flex justify-center items-center group rounded text-lum-white max-h-[40px] px-[20px] text-[14px] bg-lum-blue-500 enabled:hover:bg-lum-blue-400 enabled:active:bg-lum-blue-600 cursor-pointer
               ${rest?.disabled ? 'cursor-not-allowed opacity-25' : ''}
               ${buttonClassName ? buttonClassName : ''}
            `)}>
            <span className={`flex items-center justify-center`}>{children}</span>
         </label>

         <input id='file-upload' className='hidden' type='file' onInput={(e: any) => onInput(e)} {...rest} />
      </>
   );
};

export default UploadFileButton;
