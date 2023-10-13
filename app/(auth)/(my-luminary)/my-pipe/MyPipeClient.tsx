'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Grid from '../../../../common/components/grid/Grid';
import PageContainer from '../../../../common/components/page-container/PageContainer';
import SearchBar from '../../../../common/components/search-bar/SearchBar';
import Tabs from '../../../../common/components/tabs/Tabs';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectUser } from '../../../../store/slices/user';
import BoardView from './(partials)/BoardView';
import ListView from './(partials)/ListView';

const tabs = [
   { name: 'List', iconName: 'ListBullets' },
   { name: 'Board', iconName: 'BoardView' },
];
interface Props {
   myPipe: Array<any>;
}

const MyPipeClient = ({ myPipe }: Props) => {
   const user = useAppSelector(selectUser);
   const dispatch = useAppDispatch();
   const router = useRouter();
   const [usersPipe, setUsersPipe] = useState<Array<any>>([]);
   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<any[]>([]);
   const [activeNavIndex, setActiveNavIndex] = useState<number>(0);

   useEffect(() => {
      const leadsToStore = myPipe?.map((lead: any, i: number) => ({
         ...lead,
         actionsConfig: {
            edit: { disabled: false },
            delete: { disabled: false },
         },
      }));
      setUsersPipe(leadsToStore);
   }, []);

   const handleSearchInput = (e: any) => {
      if (!!!usersPipe.length) return;
      const searchVal = e.target.value;
      setSearchInput(searchVal);
      const tempPipe = [...usersPipe].filter(
         (lead: any) =>
            lead.fullName.toLowerCase().includes(searchVal.toLowerCase()) ||
            lead.status.name.toLowerCase().includes(searchVal.toLowerCase())
      );
      setSearchResults([...tempPipe]);
   };

   return (
      <>
         <PageContainer
            breadcrumbsChildren={
               <>
                  <Tabs tabs={tabs} activeTabIndex={activeNavIndex} setActiveTabIndex={setActiveNavIndex} />
                  <SearchBar
                     placeholder={'Search Roles...'}
                     searchValue={searchInput}
                     handleChange={handleSearchInput}
                     searchResults={searchResults}
                     onSelectSearchResult={(e: any, result: any) => {
                        // if (result.id) router.push(`/admin/roles/${result.id}`);
                        // else console.log('hmmm.... no role id for result:', result);
                     }}
                     keyPath={['fullName']}
                  />
               </>
            }>
            <Grid>
               {tabs[activeNavIndex].name === 'List' && (
                  <ListView usersPipe={!!searchInput?.length ? searchResults : usersPipe} />
               )}
               {tabs[activeNavIndex].name === 'Board' && (
                  <BoardView usersPipe={!!searchInput?.length ? searchResults : usersPipe} />
               )}
            </Grid>
         </PageContainer>
      </>
   );
};

export default MyPipeClient;
