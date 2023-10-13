'use client';
import React, { useState } from 'react';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../../common/components/grid/Grid';
import SearchBar from '../../../../../../../common/components/search-bar/SearchBar';
import TableList from '../../../../../../../common/components/table-list/TableList';
import { ColumnType } from '../../../../../../../common/components/table/tableTypes';
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../../store/slices/pageContext';

const configureActions = (arr: Array<any>) => {
   const copy = [...arr];
   return copy.map((obj: any, i: number) => {
      return {
         ...obj,
         actionsConfig: {
            teamlead: {
               disabled: false,
               color: obj?.teamLead ? 'cyan' : 'gray:450',
               ...(obj?.teamLead && { toolTip: 'Remove as Team Lead' }),
            },
            delete: true,
         },
      };
   });
};

const columns: ColumnType[] = [{ keyPath: ['user', 'fullName'] }];

interface Props {
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
   values: any;
   errors: any;
}
const TeamUsers = ({ values, errors, handleBlur, handleChange }: Props) => {
   const { users } = useAppSelector(selectPageContext);
   const [searchInput, setSearchInput] = useState<string>('');
   const [searchResults, setSearchResults] = useState<Array<any>>([]);

   const handleSearchInput = (e: any) => {
      if (!!!users.length) return;
      const searchVal = e.target.value;
      setSearchInput(searchVal);
      const tempUsers = [...users].filter(
         (user: any) =>
            !values?.teamUsers?.find((teamUser: any) => teamUser.userId === user.id && !teamUser.archived) &&
            user.fullName?.toLowerCase().includes(searchVal.toLowerCase())
      );
      setSearchResults([...tempUsers]);
   };

   const handleAddUserToTeam = (e: any, userToAdd: any) => {
      // see if team user already exists...
      const tempTeamUsers = [...values?.teamUsers];
      const foundTeamUserIndex = tempTeamUsers.findIndex((teamUser: any) => teamUser.userId === userToAdd.id);
      if (foundTeamUserIndex !== -1) tempTeamUsers[foundTeamUserIndex].archived = false;
      else tempTeamUsers.push({ user: userToAdd, userId: userToAdd.id, teamLead: false, archived: false, id: null });
      // const tempTeamUsers = [...values?.teamUsers, { user: userToAdd, userId: userToAdd.id, teamLead: false }];
      handleChange({ target: { type: 'text', name: 'teamUsers', value: tempTeamUsers } });
      // handleChange({ target: { type: 'text', name: 'teamUsers', value: configureActions(tempTeamUsers) } });
      setSearchInput('');
   };

   const handleArchiveUserFromTeam = (teamUserToArchive: any) => {
      const tempTeamUsers = [...values?.teamUsers].map((teamUser: any) => ({
         ...teamUser,
         ...(teamUser.userId === teamUserToArchive.userId && { archived: true, teamLead: false }),
      }));
      // handleChange({ target: { type: 'text', name: 'teamUsers', value: configureActions(tempTeamUsers) } });
      handleChange({ target: { type: 'text', name: 'teamUsers', value: tempTeamUsers } });
   };

   const handleActionClick = ({ actionKey, item, newData }: any) => {
      switch (actionKey) {
         case 'teamlead':
            // make the teamleaad icon cyan to show that the user is the team lead
            const tempTeamUsers = [...values?.teamUsers].map((teamUser: any) => {
               if (teamUser.userId === item.userId) return { ...teamUser, teamLead: !teamUser.teamLead };
               else return { ...teamUser, teamLead: false };
            });
            // move the team lead to the top of the list
            // .sort((a: any, b: any) => b.teamLead - a.teamLead);
            // handleChange({ target: { type: 'text', name: 'teamUsers', value: configureActions(tempTeamUsers) } });
            handleChange({ target: { type: 'text', name: 'teamUsers', value: tempTeamUsers } });
            break;
         case 'delete':
            handleArchiveUserFromTeam(item);
            break;
         default:
            console.log('Action not recognized');
            break;
      }
   };

   const activeTeamUsers = configureActions(values?.teamUsers?.filter((teamUser: any) => !teamUser.archived));

   return (
      <Explainer description='Select from users who will be a part of this team.'>
         <Grid>
            <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>Active Team Users</span>
            {/* <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Active Team Users</div> */}
            <TableList
               emptyStateDisplayText='No users associated to team. Add a user below'
               columns={columns}
               data={activeTeamUsers || []}
               actions={[
                  {
                     icon: 'Crown',
                     actionKey: 'teamlead',
                     toolTip: 'Make Team Lead',
                     callback: handleActionClick,
                  },
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Coordinator',
                     callback: handleActionClick,
                  },
               ]}
            />
            <SearchBar
               placeholder={'Add User to Team'}
               searchValue={searchInput}
               handleChange={handleSearchInput}
               searchResults={searchResults}
               onSelectSearchResult={handleAddUserToTeam}
               keyPath={['fullName']}
            />
         </Grid>
      </Explainer>
   );
};

export default TeamUsers;
