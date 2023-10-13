import { useState } from 'react';
import Chip from '../../../../../common/components/chip/Chip';
import SearchBar from '../../../../../common/components/search-bar/SearchBar';
import Panel from '../../../../../common/components/panel/Panel';

const users = [
   { id: 1, name: 'Buster Bluth' },
   { id: 2, name: 'George Michael' },
   { id: 3, name: 'Gob Bluth' },
   { id: 4, name: 'Tobias Fünke' },
   { id: 5, name: 'Lucille Bluth' },
   { id: 6, name: 'Lindsay Fünke' },
];

const SearchBarTabPage = () => {
   const [searchValue, setSearchValue] = useState<string>('');
   const [searchResults, setSearchResults] = useState<any[]>(users);
   const [userChips, setUserChips] = useState<{ id: number | string; name: string }[]>([]);

   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchString = e.target.value;
      setSearchValue(searchString);
      const unSelectedUsers = users.filter((user) => !userChips.find((chip) => user.id === chip.id));
      const searchMatchUsers = unSelectedUsers.filter((user) =>
         user.name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase())
      );
      setSearchResults(searchMatchUsers);
   };

   const handleAddUser = (e: any, result: any) => {
      const filteredUserChips = userChips.filter((chip) => chip.name !== result.name);
      setUserChips([...filteredUserChips, result]);
      setSearchValue('');
   };

   const handleRemoveChip = (e: any, value: string | number) => {
      const filteredChips = userChips.filter((userChip) => userChip.name !== value);
      setUserChips([...filteredChips]);
   };

   return (
      <Panel title={'SearchBar w/ Chips'}>
         <div className='grid gap-[20px]'>
            <SearchBar
               label={'Users'}
               placeholder={'Search User...'}
               searchValue={searchValue}
               handleChange={handleSearchChange}
               searchResults={searchResults}
               onSelectSearchResult={handleAddUser}
               keyPath={['name']}
            />
            <div className='flex flex-wrap items-center gap-[5px]'>
               {userChips.map((chip) => (
                  <Chip key={chip.id} value={chip.name} onClick={handleRemoveChip} />
               ))}
            </div>
            <div className='rounded bg-lum-gray-100 dark:bg-lum-gray-700 p-4 whitespace-pre text-lum-pink-600'>
               {`type SearchBarProps = {\n   label?: string;\n   placeholder?: string;\n   searchValue: string;\n   handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;\n   searchResults: any[];\n   onSelectSearchResult: (result: any) => void;\n   keyPath: string;\n};`}
            </div>
         </div>
      </Panel>
   );
};

export default SearchBarTabPage;
