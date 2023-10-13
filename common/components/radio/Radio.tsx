import styles from './Radio.module.css';

type Props = { label?: string };

const Radio = ({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & Props) => {
   return (
      <label className={`group text-lum-gray-700 dark:text-lum-white truncate ${styles.container}`}>
         {label || <>&nbsp;</>}
         <input className='hidden' type='radio' {...rest} />
         <span
            className={`block dark:bg-lum-gray-800 dark:group-hover:bg-lum-gray-750  dark:border-lum-gray-650 ${styles.checkmark}`}></span>
      </label>
   );
};

export default Radio;
