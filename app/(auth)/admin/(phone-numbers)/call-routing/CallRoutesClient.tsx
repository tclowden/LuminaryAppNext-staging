'use client';

import Button from '@/common/components/button/Button';
import Input from '@/common/components/input/Input';
import Modal from '@/common/components/modal/Modal';
import PageContainer from '@/common/components/page-container/PageContainer';
import TableCellLink from '@/common/components/table-cell-link/TableCellLink';
import Table from '@/common/components/table/Table';
import { ColumnType } from '@/common/components/table/tableTypes';
import ToggleSwitch from '@/common/components/toggle-switch/ToggleSwitch';
import useToaster from '@/common/hooks/useToaster';
import { fetchDbApi, revalidate } from '@/serverActions';
import { getObjectProp } from '@/utilities/helpers';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CallRoute {
   id: string;
   name: string;
   active: boolean;
}

type Props = { callRoutesData: Array<CallRoute> };

const CallRoutesClient = ({ callRoutesData }: Props) => {
   const router = useRouter();
   const makeToast = useToaster();

   const [callRoutes, setCallRoutes] = useState<Array<CallRoute>>([...callRoutesData]);
   const [callRoutesTableData, setCallRoutesTableData] = useState<Array<any>>([...callRoutesData]);

   const [searchValue, setSearchValue] = useState<string>('');

   const [callRouteToRemove, setCallRouteToRemove] = useState<any>({});
   const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

   useEffect(() => {
      setCallRoutes((prevState) => {
         const tempState = [...prevState];
         const dataToStore = addTableItemConfig(tempState);
         setCallRoutesTableData(dataToStore);
         return dataToStore;
      });
   }, [callRoutesData]);

   useEffect(() => {
      setCallRoutesTableData(addTableItemConfig(callRoutes));
   }, [callRoutes]);

   const columns: ColumnType[] = [
      {
         title: 'Route Name',
         render: ({ item }: { item: any }) => (
            <TableCellLink path={`/admin/call-routing/${item.id}`}>{item.name}</TableCellLink>
         ),
      },
      {
         title: 'Assigned To',
         colSpan: 1,
         render: ({ item }: { item: any }) => {
            const callRouteTypeId = getObjectProp(item, ['type', 'id']);

            if (callRouteTypeId === 'effeae2e-b875-4508-b7c4-41a390c8d85f') {
               // PHONE NUMBER TYPE ID
               return !!getObjectProp(item, ['phoneNumbersOnCallRoute']).length ? (
                  `${item.phoneNumbersOnCallRoute.length} Number${item.phoneNumbersOnCallRoute.length > 1 ? 's' : ''}`
               ) : (
                  <span className='text-lum-gray-300'>Not Yet Assigned</span>
               );
            } else if (callRouteTypeId === 'aa8deed6-1bb5-4de1-b387-033e68c34c49') {
               // STATUS TYPE ID
               return !!getObjectProp(item, ['statusesOnCallRoute']).length ? (
                  `${item.statusesOnCallRoute.length} Status${item.statusesOnCallRoute.length > 1 ? 'es' : ''}`
               ) : (
                  <span className='text-lum-gray-300'>Not Yet Assigned</span>
               );
            } else {
               return <span className='text-lum-gray-300'>Not Yet Assigned</span>;
            }
         },
      },
      {
         title: 'Active?',
         render: ({ item }: { item: any }) => (
            <ToggleSwitch checked={item?.active} onChange={() => handleActivateCallRoute(item)} />
         ),
      },
   ];

   const addTableItemConfig = (data: Array<CallRoute>) => {
      return data.map((callRoute: CallRoute) => ({
         ...callRoute,
         actionsConfig: { edit: true, delete: true },
      }));
   };

   const handleSearch = (searchString: string) => {
      setSearchValue(searchString);
      setCallRoutesTableData(() => {
         const tempData = [...callRoutes].filter(
            (callRoute) => callRoute?.name && callRoute.name.toLowerCase().includes(searchString.toLowerCase())
         );
         return addTableItemConfig(tempData);
      });
   };

   const handleActionKey = async ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            await revalidate({ path: '/admin/call-routing/*' });
            router.push(`/admin/call-routing/${item?.id}`);
            break;
         case 'delete':
            setCallRouteToRemove(item);
            setShowConfirmModal(true);
            break;
         default:
            console.log(`Action, "${actionKey}", not supported`);
      }
   };

   const handleArchiveCallRoute = async (callRouteToRemoveId: string) => {
      return fetchDbApi(`/api/v2/call-routes/${callRouteToRemoveId}`, {
         method: 'DELETE',
      })
         .then(async () => {
            makeToast(true, 'Call Route Was Deleted');
            setShowConfirmModal(false);
            setCallRoutes((prevState: Array<CallRoute>) => {
               return [...prevState].filter((callRoute: CallRoute) => callRoute.id !== callRouteToRemoveId);
            });
         })
         .catch((err) => {
            console.log('err:', err);
            makeToast(false, 'Call Route Was Not Deleted');
         });
   };

   const handleActivateCallRoute = (callRoute: CallRoute) => {
      fetchDbApi(`/api/v2/call-routes/activate/${callRoute?.id}`, {
         method: 'PUT',
         body: JSON.stringify({
            active: !callRoute?.active,
         }),
      })
         .then(() => {
            makeToast(true, 'Call Route Was Updated');
            setCallRoutes((prevState: any) => {
               const tempState = [...prevState];
               const foundCallRoute = tempState.find((cRoute) => cRoute.id === callRoute.id);
               if (!foundCallRoute) return prevState;
               foundCallRoute.active = !callRoute.active;
               return tempState;
            });
         })
         .catch((err) => {
            console.log('err:', err);
            makeToast(false, 'Call Route Was Not Updated');
         });
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button
                     color='blue'
                     onClick={() => {
                        router.push('/admin/call-routing/new');
                     }}>
                     {'+ New Route'}
                  </Button>
                  <Input
                     iconName='MagnifyingGlass'
                     value={searchValue}
                     onChange={(e) => handleSearch(e.target.value)}
                     border
                     shadow
                     onClearInput={() => handleSearch('')}
                  />
               </>
            }>
            <Table
               columns={columns}
               data={callRoutesTableData}
               actions={[
                  {
                     icon: 'Edit',
                     actionKey: 'edit',
                     toolTip: 'Edit Call Route',
                     callback: handleActionKey,
                  },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Call Route',
                     callback: handleActionKey,
                  },
               ]}
            />
         </PageContainer>
         <Modal
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            size='small'
            title={'Delete Call Route'}
            primaryButtonText={'Delete'}
            secondaryButtonText={'Cancel'}
            primaryButtonCallback={(e: any) => {
               handleArchiveCallRoute(callRouteToRemove?.id);
            }}
            primaryButtonColor={'red'}>
            <div>Are you sure you want to DELETE call route: {`"${callRouteToRemove?.name}"`}?</div>
         </Modal>
      </>
   );
};

export default CallRoutesClient;
