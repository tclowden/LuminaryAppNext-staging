'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Button from '../../../../../common/components/button/Button';
import ConfirmModal from '../../../../../common/components/confirm-modal/ConfirmModal';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import SearchBar from '../../../../../common/components/search-bar/SearchBar';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { selectPageContext, setPageContext } from '../../../../../store/slices/pageContext';
import { setAddToast } from '../../../../../store/slices/toast';
import { selectUser } from '../../../../../store/slices/user';

const columns: ColumnType[] = [
   { keyPath: ['name'], title: 'Utitlity Company Name', colSpan: 2 },
   { keyPath: ['teamUsersCount'], title: 'Team Members', colSpan: 1 },
   { keyPath: ['teamLead', 'fullName'], title: 'Team Lead', colSpan: 1 },
];

interface Props {}
const TeamsClient = ({}: Props) => {
   const router = useRouter();
   const contextData = useAppSelector(selectPageContext);
   // const test = useAppSelector(memoizedPageContextSelector);
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<Array<string>>([]);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [teamToRemove, setTeamToRemove] = useState<any>({});

   useEffect(() => {
      if (!!contextData?.teams?.length) {
         const tempTeams = [...contextData?.teams].map((team: any) => {
            return {
               ...team,
               teamUsersCount: team.teamUsers.length.toString(),
               teamLead: team.teamUsers?.find((teamUser: any) => teamUser.teamLead)?.user || { fullName: '' },
               actionsConfig: { delete: true, edit: true },
            };
         });
         dispatch(setPageContext({ teams: tempTeams }));
      }
   }, []);

   const handleSearchInput = (e: any) => {
      const searchVal = e.target.value;
      setSearchInput(searchVal);
      const { teams } = contextData;
      const tempTeams = [...teams].filter((uc: any) => uc.name.includes(searchVal));
      setSearchResults(tempTeams);
   };

   const handleActionClick = ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            const randomStr = Math.random().toString().slice(2, 7);
            router.push(`/admin/teams/${item.id}?${randomStr}`);
            break;
         case 'delete':
            setTeamToRemove(item);
            setOpenConfirmModal(true);
            break;
         default:
            break;
      }
   };

   const handleArchiveTeam = async (id: number) => {
      if (!id) return;
      const userAuthToken = user.token;

      await axios
         .delete(`/api/v2/teams/${id}`, {
            headers: { Authorization: `Bearer ${userAuthToken}` },
         })
         .then((res: any) => {
            console.log('Result archiving team:', res);
            const tempTeams = [...contextData?.teams].filter((team: any) => team.id !== id);
            dispatch(setPageContext({ teams: tempTeams }));
            dispatch(
               setAddToast({
                  details: [{ label: 'Success', text: 'Team Successfully Deleted' }],
                  iconName: 'CheckMarkCircle',
                  variant: 'success',
                  autoCloseDelay: 5,
               })
            );
         })
         .catch((err: any) => {
            console.log('err', err);
            const errMsg = err.response?.data?.error?.errorMessage || 'Changes Not Saved';
            dispatch(
               setAddToast({
                  iconName: 'XMarkCircle',
                  details: [{ label: 'Error', text: errMsg }],
                  variant: 'danger',
                  autoCloseDelay: 5,
               })
            );
         });
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Button
                     data-test={'createBtn'}
                     iconName={'Plus'}
                     color={'blue'}
                     onClick={(e: any) => {
                        console.log('create new team:');
                        router.push('/admin/teams/new');
                     }}>
                     New Team
                  </Button>
                  <SearchBar
                     placeholder='Search'
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={(e: any, result: any) => {
                        console.log('team:', result);
                        if (result.id) router.push(`/admin/teams/${result.id}`);
                     }}
                     keyPath={['name']}
                  />
               </>
            }>
            <Table
               columns={columns}
               data={contextData?.teams}
               pagination
               actions={[
                  { icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Team', callback: handleActionClick },
                  { icon: 'TrashCan', actionKey: 'delete', toolTip: 'Delete Team', callback: handleActionClick },
               ]}
            />
         </PageContainer>
         <ConfirmModal
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               handleArchiveTeam(teamToRemove.id);
            }}
            value={'utility company, "' + teamToRemove?.name + '"'}
         />
      </>
   );
};

export default TeamsClient;
