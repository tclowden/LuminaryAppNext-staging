import styles from './Checkbox.module.css';

type Props = {
   label?: string;
   className?: string; // For additional styling. Useful in the case of putting checkboxes in a dropdown
};

const Checkbox = ({ className, label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & Props) => {
   return (
      <label
         onClick={(e: any) => {
            e.stopPropagation();
         }}
         className={`
            group 
            text-lum-gray-700 dark:text-lum-white
            ${styles.container} 
            ${className && className}
         `}>
         {label ? <span>{label}</span> : <>&nbsp;</>}
         <input type='checkbox' {...rest} />
         <span
            className={`dark:bg-lum-gray-800 dark:group-hover:bg-lum-gray-750 dark:border-lum-gray-650 ${styles.checkmark}`}></span>
      </label>
   );
};

export default Checkbox;
