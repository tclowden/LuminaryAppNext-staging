import Button from '../../../../../common/components/button/Button';
import Panel from '../../../../../common/components/panel/Panel';

const ButtonTabPage = () => {
   const handleHrefButton = () => {
      console.log('Button w/ href clicked!');
      console.log('Now, rerouting will occur!');
   };

   return (
      <div className='flex flex-col gap-4'>
         <Panel title='Buttons'>
            <div className='grid gap-2'>
               <div className='flex flex-wrap gap-2'>
                  <Button color='blue'>color - blue</Button>
                  <Button color='cyan'>color - cyan</Button>
                  <Button color='green'>color - green</Button>
                  <Button color='yellow'>color - yellow</Button>
                  <Button color='orange'>color - orange</Button>
                  <Button color='red'>color - red</Button>
                  <Button color='pink'>color - pink</Button>
                  <Button color='purple'>color - purple</Button>
                  <Button color='gray'>color - gray</Button>
                  <Button color='light'>color - light</Button>
                  <Button color='dark'>color - dark</Button>
                  <Button color='black'>color - black</Button>
                  <Button color='white'>color - white</Button>
                  <Button color='transparent'>color - transparent</Button>
               </div>
               <div className='flex flex-wrap gap-2'>
                  <Button>Default Button</Button>
                  <Button iconName='Warning'>Icon w/ Text</Button>
                  <Button onClick={handleHrefButton} href='/dashboard'>
                     Button w/ href
                  </Button>
               </div>
               <div className='flex flex-wrap gap-2'>
                  <Button iconName='Bell' />
                  <Button iconName='TrashCan' color='transparent' />
                  <Button color='yellow' iconName='Warning' />
               </div>
               <div className='flex flex-wrap gap-2'>
                  <Button size='xs' color='blue'>
                     size - xs
                  </Button>
                  <Button size='sm' color='blue'>
                     size - sm
                  </Button>
                  <Button color='blue'>size - md (Default)</Button>
                  <Button size='lg' color='blue'>
                     size-lg
                  </Button>
                  <Button size='xl' color='blue'>
                     size-xl
                  </Button>
               </div>
               <div className='flex flex-wrap gap-2'>
                  <Button iconName='Bell' size='xs' />
                  <Button iconName='Bell' size='sm' />
                  <Button iconName='Bell' size='md' />
                  <Button iconName='Bell' size='lg' />
               </div>
               <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
                  {`type ButtonProps = {\n    size?: 'xs' | 'sm' | 'md' | 'lg';\n    color?: 'blue' | 'cyan' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple' | 'gray' | 'light' | 'dark' | 'transparent';\n    iconName?: string;\n    onClick?: (e: any) => void;\n    href?: string;\n    children?: React.ReactNode;\n}`}
               </div>
            </div>
         </Panel>
      </div>
   );
};

export default ButtonTabPage;
