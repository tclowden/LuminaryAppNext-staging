'use client';

import { useRouter } from 'next/navigation';
import Button from '../../../../common/components/button/Button';
import { ColumnType } from '../../../../common/components/table/tableTypes';
import PageContainer from '../../../../common/components/page-container/PageContainer';
import Table from '../../../../common/components/table/Table';
import { useEffect, useState } from 'react';
import ConfirmModal from '../../../../common/components/confirm-modal/ConfirmModal';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/user';
import { setAddToast } from '../../../../store/slices/toast';
import ConfigurePagesModal from './(partials)/ConfigurePagesModal';
import Modal from '../../../../common/components/modal/Modal';
import Grid from '../../../../common/components/grid/Grid';

const recurseTableData = (arr: Array<Page>): Array<Page> => {
   return arr
      .map((page: Page) => ({
         ...page,
         expandableData: recurseTableData([...page?.pages, ...page?.sections]),
         actionsConfig: { edit: true, delete: true },
      }))
      .sort((a, b) => a?.displayOrder - b?.displayOrder);
};

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Name', colSpan: 2 },
   {
      keyPath: ['showOnSidebar'],
      title: 'Show On Sidebar',
      colSpan: 2,
      render: ({ item }) => (item.showOnSidebar ? 'Yes' : 'No'),
   },
];

type Page = {
   id: number;
   name: string | undefined;
   iconName: string | undefined;
   iconColor: string | undefined;
   route: string | undefined;
   displayOrder: number;
   showOnSidebar: boolean;
   parentPageId: number | undefined;
   sections: Page[];
   pages: Page[];
};

type Props = {
   allPages: { pages: Page[]; raw: Page[] };
};

const PagesClient = ({ allPages }: Props) => {
   const dispatch = useAppDispatch();
   const router = useRouter();
   const user = useAppSelector(selectUser);
   const [pageData, setPageData] = useState<Array<Page>>([]);
   const [openEditPagesModal, setOpenEditPagesModal] = useState<boolean>(false);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [pageToRemove, setPageToRemove] = useState<any>({});

   const [openScriptModal, setOpenScriptModal] = useState<boolean>(false);
   const [scriptResults, setScriptResults] = useState<string>('');

   useEffect(() => {
      if (!!allPages?.pages?.length) {
         setPageData(recurseTableData([...allPages.pages]));
      }
   }, [allPages]);

   const handlePageActionClick = ({ actionKey, item }: { actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            router.push(`/dev/pages/${item?.id}`);
            break;
         case 'delete':
            console.log('delete');
            setPageToRemove(item);
            setOpenConfirmModal(true);
            break;
         default:
            console.log(`${actionKey} not supported.`);
            break;
      }
   };

   const handleArchivePage = async (pageToRemove: any) => {
      // await fetch(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/pages/script/archive/${pageToRemove?.id}`, {
      //    method: 'GET',
      //    headers: {
      //       'Content-type': 'application/json',
      //       Authorization: `Bearer ${user.token}`,
      //    },
      // })
      await fetch(`/api/v2/pages/script/${pageToRemove?.id}`, {
         method: 'DELETE',
         headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
         },
      })
         .then(async (res) => {
            const results = await res.json();
            if (results.error) throw new Error(results.error.errorMessage);
            setOpenConfirmModal(false);
            setScriptResults(results);
            setOpenScriptModal(true);
            // dispatch(
            //    setAddToast({
            //       iconName: 'CheckMarkCircle',
            //       details: [{ label: 'Success', text: 'Page Was Deleted' }],
            //       variant: 'success',
            //       autoCloseDelay: 5,
            //    })
            // );
            // router.refresh();
         })
         .catch((err) => {
            console.error('err:', err);
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: 'Could Not Delete Page' }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   const toReplace: any = {
      '<break>': '\n',
      '<break2>': '\n\n',
      '<tab>': '  ',
   };
   const formatterRegex = /<break>|<tab>|<break2>/g;

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button
                     onClick={() => {
                        setOpenEditPagesModal(true);
                     }}>
                     Change Display Order
                  </Button>
                  <Button
                     iconName='Plus'
                     color='blue'
                     onClick={() => {
                        router.push(`/dev/pages/new`);
                     }}>
                     New Page
                  </Button>
               </>
            }>
            <Table
               columns={columns}
               data={pageData}
               expandableRows
               actions={[
                  {
                     icon: 'Edit',
                     actionKey: 'edit',
                     toolTip: 'Edit Page',
                     callback: handlePageActionClick,
                  },
                  { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Field', callback: handlePageActionClick },
               ]}
            />
         </PageContainer>

         {/* Modal to edit pages as a whole... displayOrder for now */}
         <ConfigurePagesModal
            setOpenEditPagesModal={setOpenEditPagesModal}
            openEditPagesModal={openEditPagesModal}
            allPages={allPages}
         />

         {/* confirm modal when archiving a page */}
         <ConfirmModal
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               handleArchivePage(pageToRemove);
            }}
            value={`Are you sure you want to delete page, "${pageToRemove?.name}"`}
         />

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
      </>
   );
};

export default PagesClient;
