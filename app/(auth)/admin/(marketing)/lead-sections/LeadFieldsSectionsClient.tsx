'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Input from '../../../../../common/components/input/Input';
import PageContainer from '../../../../../common/components/page-container/PageContainer';
import Table from '../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../common/components/table/tableTypes';

const columns: ColumnType[] = [
   {
      keyPath: ['name'],
      title: 'Section Name',
      colSpan: 1,
   },
];

type Props = {
   leadFieldsSectionsData: Array<any>;
};

const LeadFieldsSectionsClient = ({ leadFieldsSectionsData }: Props) => {
   const router = useRouter();
   const [leadFieldsSections, setLeadFieldsSections] = useState<Array<any>>([]);
   const [searchValue, setSearchValue] = useState<string>('');

   useEffect(() => {
      setLeadFieldsSections(() => {
         return addTableItemConfig([...leadFieldsSectionsData]);
      });
   }, [leadFieldsSectionsData]);

   const addTableItemConfig = (data: Array<any>) => {
      return data.map((leadFieldsSection: any) => ({
         ...leadFieldsSection,
         actionsConfig: { edit: !!leadFieldsSection?.editable },
      }));
   };

   const handleSearch = (e: any) => {
      const searchString = e.target.value;
      setSearchValue(searchString);
      setLeadFieldsSections(() => {
         const tempData = [...leadFieldsSectionsData].filter((leadFieldsSection) =>
            leadFieldsSection?.label.toLowerCase().includes(searchString.toLowerCase())
         );
         return addTableItemConfig(tempData);
      });
   };

   const handleActionClick = ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'edit':
            router.push(`/admin/lead-sections/${item.id}`);
            break;
         default:
            break;
      }
   };
   return (
      <PageContainer
         breadcrumbsChildren={
            <Input iconName='MagnifyingGlass' value={searchValue} onChange={handleSearch} border shadow />
         }>
         <Table
            columns={columns}
            data={leadFieldsSections}
            actions={[{ icon: 'Edit', actionKey: 'edit', toolTip: 'Edit Section', callback: handleActionClick }]}
         />
      </PageContainer>
   );
};

export default LeadFieldsSectionsClient;
