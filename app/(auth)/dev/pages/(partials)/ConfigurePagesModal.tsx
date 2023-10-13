'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Grid from '../../../../../common/components/grid/Grid';
import LoadingBackdrop from '../../../../../common/components/loaders/loading-spinner/LoadingBackdrop';
import Modal from '../../../../../common/components/modal/Modal';
import TableList from '../../../../../common/components/table-list/TableList';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';

const configureTableListActions = (arr: Array<any>) => {
   // make a copy
   const copy = [...arr];

   // sort by displayOrder
   // create the actionsConfig
   const configuredArr = copy
      .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
      .map((obj: any, i: number) => {
         const initVal = copy[0].displayOrder;
         const maxVal = copy.reduce((acc: any, val: any) => {
            return (acc = acc > val.displayOrder ? acc : val.displayOrder);
         }, initVal);
         const minVal = copy.reduce((acc: any, val: any) => {
            return (acc = acc < val.displayOrder ? acc : val.displayOrder);
         }, initVal);
         return {
            ...obj,
            actionsConfig: {
               moveup: obj.displayOrder === minVal ? false : true,
               movedown: obj.displayOrder === maxVal ? false : true,
            },
         };
      });

   return configuredArr;
};

const tableListColumns: ColumnType[] = [{ keyPath: ['name'], title: 'Name', colSpan: 2 }];

interface Props {
   allPages: any;
   setOpenEditPagesModal: (prevState: boolean) => void;
   openEditPagesModal: boolean;
}

const ConfigurePagesModal = ({ allPages, setOpenEditPagesModal, openEditPagesModal }: Props) => {
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const router = useRouter();

   const [pageData, setPageData] = useState<Array<any>>([]);
   const [isSaving, setIsSaving] = useState<boolean>(false);

   const [openScriptModal, setOpenScriptModal] = useState<boolean>(false);
   const [scriptResults, setScriptResults] = useState<string>('');

   useEffect(() => {
      if (!!allPages?.pages?.length) {
         // get only the apps
         setPageData(configureTableListActions(allPages.raw.filter((page: any) => !page.parentPageId)));
         // setOnlyAppData(configureTableListActions(allPages.raw.filter((page: Page) => !page.parentPageId)));
      }
   }, [allPages]);

   const handleTableListActionsClick = ({ actionKey, newData }: any) => {
      switch (actionKey) {
         case 'moveup':
         case 'movedown':
            // setMultiValues([...newData]);
            setPageData([...newData]);
            break;
         default:
            console.log(`${actionKey} not supported.`);
      }
   };

   const handleSubmitNewDisplayOrder = async (e: any) => {
      setIsSaving(true);
      const userAuthToken = user.token;

      // copy
      // reformat data & delete uneccesary keys
      const dataToSave = pageData.map((app: any, i: number) => {
         const copy = { ...app };
         // delete unneccesary keys
         delete copy['actionsConfig'];
         // refresh displayOrder to not skip a number
         copy['displayOrder'] = i + 1;
         return copy;
      });

      // need to make a controller/route to save the update an array of pages
      try {
         // const url = `${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/pages`;
         // const url = `${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/pages/script`;
         const url = `/api/v2/pages/script`;
         const result = await axios.put(url, dataToSave, { headers: { Authorization: `Bearer ${userAuthToken}` } });

         if (result.status === 200) {
            // refresh the page so it will hit the page.tsx call again
            // router.refresh();
            // setTimeout(() => {
            //    setIsSaving(false);
            //    setOpenEditPagesModal(false);
            //    dispatch(
            //       setAddToast({
            //          details: [{ label: 'Success', text: 'Pages Successfully Saved' }],
            //          iconName: 'CheckMarkCircle',
            //          variant: 'success',
            //          autoCloseDelay: 5,
            //       })
            //    );
            // }, 500);
            setIsSaving(false);
            setOpenEditPagesModal(false);
            setScriptResults(result.data);
            setOpenScriptModal(true);
         }
      } catch (err: any) {
         console.log('err saving pages', err);
         setIsSaving(false);
         const errMsg = err.response?.data?.error?.errorMessage || 'Changes Not Saved';
         dispatch(
            setAddToast({
               iconName: 'XMarkCircle',
               details: [{ label: 'Error', text: errMsg }],
               variant: 'danger',
               autoCloseDelay: 5,
            })
         );
      }
   };

   const toReplace: any = {
      '<break>': '\n',
      '<break2>': '\n\n',
      '<tab>': '  ',
   };
   const formatterRegex = /<break>|<tab>|<break2>/g;

   return (
      <>
         <Modal
            isOpen={openEditPagesModal}
            onClose={(e: any) => {
               // warning close modal here...
               setOpenEditPagesModal(false);
               //  resetEditStageConfig(initEditStageConfig);
            }}
            size={'default'}
            zIndex={100}
            title={`Change Display Order for Apps`}
            primaryButtonText={'Save'}
            primaryButtonCallback={handleSubmitNewDisplayOrder}>
            <TableList
               // tableTitle={`${values?.pageType}`}
               rowReorder
               rowReorderKeyPath={['displayOrder']}
               columns={tableListColumns}
               data={[...pageData]}
               actions={[
                  { icon: 'UnionUp', actionKey: 'moveup', toolTip: 'Move Up', callback: handleTableListActionsClick },
                  {
                     icon: 'UnionDown',
                     actionKey: 'movedown',
                     toolTip: 'Move Down',
                     callback: handleTableListActionsClick,
                  },
               ]}
            />
         </Modal>
         <Modal
            isOpen={openScriptModal}
            primaryButtonCallback={(e: any) => {
               // copy to clipboard
               if (typeof scriptResults === 'string') {
                  navigator.clipboard.writeText(
                     scriptResults?.replace(formatterRegex, (m: any) => toReplace[m]).replace('*indent*', '   ')
                  );
                  dispatch(
                     setAddToast({
                        iconName: 'CheckMarkCircle',
                        details: [{ label: 'Success', text: 'Code copied to clipboard!' }],
                        variant: 'success',
                        autoCloseDelay: 5,
                     })
                  );
               }
            }}
            primaryButtonText={'Copy To Clipboard'}
            onClose={(e: any) => {
               console.log('closing');
               setOpenScriptModal(false);
               setScriptResults('');
            }}
            title={'Code To Copy'}>
            <Grid>
               {/* <div>Copy Code Below</div> */}
               <div className='whitespace-pre bg-lum-gray-50 py-4 px-6 rounded'>
                  <div className='text-[12px] italic bg-lum-gray-50 max-h-[60vh] overflow-y-auto text-lum-orange-800 overflow-x-scroll'>
                     {typeof scriptResults === 'string' &&
                        scriptResults?.replace(formatterRegex, (m: any) => toReplace[m]).replace('*indent*', '   ')}
                  </div>
               </div>
            </Grid>
         </Modal>
         <LoadingBackdrop isOpen={isSaving} zIndex={101} />
      </>
   );
};

export default ConfigurePagesModal;
