'use client';
import React from 'react';
import Explainer from '../../../../../../common/components/explainer/Explainer';
import Panel from '../../../../../../common/components/panel/Panel';
import TableList from '../../../../../../common/components/table-list/TableList';
import { ColumnType } from '../../../../../../common/components/table/tableTypes';

export const configureChildrenPages = (arr: Array<any>) => {
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

const columns: ColumnType[] = [
   {
      keyPath: ['name'],
      title: 'Name',
      colSpan: 1,
      render: ({ item }) => {
         return (
            <span className='flex justify-between'>
               {item.name} <span className='text-lum-gray-250'>{item.route ? '(Page)' : '(Section)'}</span>
            </span>
         );
      },
   },
];

interface Props {
   childrenPages: Array<any>;
   setMultiValues: (data: any) => void;
}

const ChildrenPages = ({ childrenPages, setMultiValues }: Props) => {
   const handleActionClick = ({ actionKey, item, newData }: any) => {
      switch (actionKey) {
         case 'moveup':
         case 'movedown':
            setMultiValues({
               childrenPages: configureChildrenPages([...newData]),
            });
            break;
         default:
            console.log('Action not recognized');
            break;
      }
   };

   return (
      // <Explainer description='Adjust the display order for sections and pages'>
      // <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Reorder Sections & Pages</div>
      <Panel title={'Nested Sections & Pages'} collapsible>
         <TableList
            rowReorder
            rowReorderKeyPath={['displayOrder']}
            columns={columns}
            data={[...childrenPages]}
            actions={[
               { icon: 'UnionUp', actionKey: 'moveup', toolTip: 'Move Up', callback: handleActionClick },
               {
                  icon: 'UnionDown',
                  actionKey: 'movedown',
                  toolTip: 'Move Down',
                  callback: handleActionClick,
               },
            ]}
         />
      </Panel>
      // </Explainer>
   );
};

export default ChildrenPages;
