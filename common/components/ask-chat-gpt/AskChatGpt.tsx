'use client';

import { useState } from 'react';
import { selectUser } from '../../../store/slices/user';
import Button from '../button/Button';
import { useAppSelector } from '../../../store/hooks';
import Modal from '../modal/Modal';
import Grid from '../grid/Grid';
import Icon from '../Icon';
import Panel from '../panel/Panel';
import Input from '../input/Input';

const AskChatGpt = () => {
   const [askLuminaryResponse, setAskLuminaryResponse] = useState<any>(null);
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [promptText, setPromptText] = useState<any>();
   const user = useAppSelector(selectUser);
   const handleSetPromptText = (e: any) => {
      const { value } = e.target;

      console.log(value);
      setPromptText(value);
   };

   const handleSubmitPrompt = async () => {
      try {
         await askGpt(promptText);
      } catch (err) {
         console.log(err);
      }
   };

   async function askGpt(promptText: any) {
      if (promptText === '' || promptText === null) return;
      const request = await fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/openai`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
         },
         body: JSON.stringify({
            prompt: promptText,
         }),
      });

      const chatCompletion: any = await request.json();
      console.log('chatComplettion', chatCompletion?.response);
      setAskLuminaryResponse(chatCompletion?.response);
   }
   return (
      <>
         <Button
            color='blue:500'
            iconName='LuminaryAppsColorIconLogo'
            size='md'
            shadow
            onClick={() => {
               setIsModalOpen(!isModalOpen);
            }}>
            Chat GPT
         </Button>
         <Modal
            isOpen={isModalOpen}
            onClose={() => {
               setIsModalOpen(!isModalOpen);
               console.log('console closed');
            }}>
            <>
               <div className='flex mb-[15px]'>Hi, what can I help you with today?</div>
               <Grid columnCount={1}>
                  <div className='flex flex-row items-start gap-[10px]'>
                     <Input placeholder='Ask any question...' onInput={handleSetPromptText} />
                     <Button color='blue' onClick={handleSubmitPrompt}>
                        <Icon name={'LuminaryAppsColorIconLogo'} width={30} height={30}></Icon>
                     </Button>
                  </div>
               </Grid>
            </>
            {askLuminaryResponse && (
               <div className='mt-[20px] w-full'>
                  <Panel>{askLuminaryResponse}</Panel>
               </div>
            )}
         </Modal>
      </>
   );
};

export default AskChatGpt;
