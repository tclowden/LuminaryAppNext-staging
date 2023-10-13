import { useState } from 'react';
import Input from '../../../../../common/components/input/Input';
import Panel from '../../../../../common/components/panel/Panel';

const InputTabPage = () => {
   const [firstName, setFirstName] = useState<string>('');
   const [phoneNumber, setPhoneNumber] = useState<string>('');
   const [password, setPassword] = useState<string>('');

   return (
      <Panel title={'Inputs'}>
         <div className='grid grid-cols-2 gap-[20px]'>
            <span className='col-span-2'>
               <Input
                  label='First Name'
                  placeholder='First Name...'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  errorMessage={
                     firstName.toLocaleLowerCase() === 'greg'
                        ? `Come on... That can't be your real name right? Please enter something better. I don't expect much, but try your best at least`
                        : undefined
                  }
                  required
               />
            </span>
            <Input
               label='Phone Number Field'
               placeholder='(123) 456-7890'
               type='tel'
               value={phoneNumber}
               onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Input
               label='Password Field'
               placeholder='Password'
               type='password'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
            />
            <div className='col-span-2 rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
               {`type InputProps = {\n    label?: string;\n    iconName?: string;\n    errorMessage?: string;\n    isRequired?: boolean;\n};`}
            </div>
         </div>
      </Panel>
   );
};

export default InputTabPage;
