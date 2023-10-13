'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from '../../../../../../../common/components/modal/Modal';
import Panel from '../../../../../../../common/components/panel/Panel';
import SearchBar from '../../../../../../../common/components/search-bar/SearchBar';
import Table from '../../../../../../../common/components/table/Table';
import { ColumnType } from '../../../../../../../common/components/table/tableTypes';
import { useAppDispatch, useAppSelector } from '../../../../../../../store/hooks';
import { selectUser } from '../../../../../../../store/slices/user';
import ConfirmModal from '../../../../../../../common/components/confirm-modal/ConfirmModal';
import { selectPageContext, setPageContext } from '@/store/slices/pageContext';
import { fetchCoordinators, fetchCoordinatorsOnProduct, handleResults } from './utilities';
import { formatCoordinatorsOnProduct } from './formatters';

const getRolesNamesString = (roles: Array<any>) => {
   let roleNames = '';
   roles?.forEach((role: any) => (roleNames += role.name + ', '));
   return roleNames.substring(0, roleNames.length - 2);
};

const configureActions = (arr: Array<any>) => {
   const copy = [...arr];
   return copy.map((obj: any, i: number) => {
      return {
         ...obj,
         actionsConfig: {
            delete: true,
         },
      };
   });
};

const coordinatorsColumns: ColumnType[] = [
   { keyPath: ['productCoordinator', 'name'], title: 'Coordinator Name', colSpan: 2 },
   { keyPath: ['productCoordinator', 'roleNames'], title: 'Roles', colSpan: 2 },
];

interface Props {
   // containersCollapsed?: boolean | { required: boolean; other: boolean };
   // onContainerCollapse: (bool: boolean) => void;
   coordinatorsOnProduct: Array<any>;
   coordinatorsOnProductCount: number;
   setValue: (name: string, value: any) => void;
}

const Coordinators = ({
   // containersCollapsed,
   // onContainerCollapse,
   coordinatorsOnProduct,
   coordinatorsOnProductCount,
   setValue,
}: Props) => {
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);

   const { product, coordinators } = useAppSelector(selectPageContext);

   const [fetchDataInit, setFetchDataInit] = useState<boolean>(false);
   const [openAddCoordOptions, setOpenAddCoordOptions] = useState<boolean>(false);
   const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
   const [coordToRemove, setCoordToRemove] = useState<any>({});
   const [coordSearchVal, setCoordSearchVal] = useState<string>('');

   useEffect(() => {
      const runAsync = async () => {
         // fetch all coordinators when container isn't collapsed...
         // doing this on the client for speed purposes
         // we will also restrucutre the coordinators on product the first time around as well
         if (!coordinators?.fetched && fetchDataInit) {
            console.log('fetching coordinators...');

            let tempCoords: any = fetchCoordinators(user?.token || undefined);

            let tempCoordsOnProduct: any = [];
            const coordsOnProductAlreadyFetch = !!coordinatorsOnProduct?.length;

            if (coordsOnProductAlreadyFetch) tempCoordsOnProduct = [...coordinatorsOnProduct];
            else tempCoordsOnProduct = fetchCoordinatorsOnProduct(user?.token || undefined, product?.id);

            [tempCoords, tempCoordsOnProduct] = await Promise.allSettled([tempCoords, tempCoordsOnProduct])
               .then(handleResults)
               .catch((err) => {
                  console.log('err', err);
               });

            tempCoordsOnProduct = formatCoordinatorsOnProduct(tempCoordsOnProduct);

            dispatch(setPageContext({ coordinators: { data: tempCoords, fetched: true } }));
            setValue('coordinatorsOnProduct', configureActions(tempCoordsOnProduct));
         }
      };

      runAsync();
   }, [fetchDataInit, coordinators]);

   const handleAddCoordinator = (e: any, coordToAdd: any) => {
      // make a copy
      const tempCoordsOnProduct = [...coordinatorsOnProduct];
      // see if the coordinator existed at one point within the product
      // e.g. they deleted the coordinatator then added it back
      const coordFoundIndex = tempCoordsOnProduct.findIndex(
         (coordOnProd: any) => coordOnProd.productCoordinatorId === coordToAdd.id
      );
      if (coordFoundIndex !== -1) {
         // if found...
         // grab the element & splice it out of the original array
         const tempCoord = tempCoordsOnProduct.splice(coordFoundIndex, 1)[0];
         // change the archived key from the obj to false
         tempCoord['archived'] = false;
         // // remove the delete:true key from the obj
         // delete tempCoord['delete'];
         // move the item to the end of the array
         tempCoordsOnProduct.push(tempCoord);
      } else {
         // if not found... add the object
         const roles = coordToAdd?.rolesOnProductCoordinator.map((roleOnProdCoord: any) => roleOnProdCoord?.role);
         tempCoordsOnProduct.push({
            productCoordinatorId: coordToAdd.id,
            productCoordinator: { ...coordToAdd, roleNames: getRolesNamesString(roles) },
         });
      }
      setValue('coordinatorsOnProduct', configureActions(tempCoordsOnProduct));
      setOpenAddCoordOptions(false);
      setCoordSearchVal('');
   };

   const handleDeleteCoord = (item: any) => {
      // setOpenConfirmModal(true);
      // whenever a coordinator is removed, need to go through everything dependant on the coordinator & remove it from that list as well
      // dependants --> nothing

      // remove the coordinator from the product
      const copyCoordsOnProd = [...coordinatorsOnProduct].map((coord: any) => {
         return {
            ...coord,
            ...(coord.productCoordinatorId === item.productCoordinatorId && { archived: true }),
         };
      });
      setValue('coordinatorsOnProduct', copyCoordsOnProd);
   };

   const handleActionClick = ({ event, actionKey, item }: { event: any; actionKey: string; item: any }) => {
      switch (actionKey) {
         case 'delete':
            setOpenConfirmModal(true);
            setCoordToRemove(item);
            // handleDeleteCoord(item);
            break;
         default:
            break;
      }
   };

   // create a filtered array for the coordinators to select to add to product
   const coordSearchResults = [...coordinators?.data].filter((coord: any) => {
      const coordExists = coordinatorsOnProduct?.find((c: any) => c.productCoordinatorId === coord.id && !c.archived);
      if (!coordExists) return coord.name.toLowerCase().includes(coordSearchVal.toLowerCase());
   });

   return (
      <>
         <Panel
            title={`Coordinators (${coordinatorsOnProductCount})`}
            collapsible
            // isCollapsed={typeof containersCollapsed === 'boolean' ? containersCollapsed : false}
            // onCollapseBtnClick={() => onContainerCollapse(!containersCollapsed)}
            isCollapsed
            onCollapseBtnClick={() => {
               setFetchDataInit(true);
            }}
            showChildButton={coordinators?.fetched}
            childBtnDataTestAttribute={'addCoordinatorChildBtn'}
            disableChildButton={!coordSearchResults.length}
            childButtonText={openAddCoordOptions ? 'Close' : 'Add New Coordinator'}
            childButtonCallback={(e: any) => {
               setOpenAddCoordOptions(!openAddCoordOptions);
               // reset the search val
               setCoordSearchVal('');
            }}
            childButtonChildren={
               <>
                  {openAddCoordOptions && (
                     <SearchBar
                        placeholder='Search'
                        handleChange={(e: any) => {
                           setCoordSearchVal(e.target.value);
                        }}
                        searchResults={coordSearchResults}
                        searchValue={coordSearchVal}
                        keyPath={['name']}
                        onSelectSearchResult={handleAddCoordinator}
                        defaultShowOptions
                        listContainerMaxHeight={200}
                     />
                  )}
               </>
            }>
            <Table
               theme='secondary'
               isLoading={!coordinators?.fetched}
               loadingTableHeight={160}
               hideHeader={!coordinators?.fetched || !coordinatorsOnProduct?.filter((c: any) => !c?.archived).length}
               columns={coordinatorsColumns}
               data={coordinatorsOnProduct?.filter((coord: any) => !coord?.archived)}
               actions={[
                  {
                     icon: 'TrashCan',
                     actionKey: 'delete',
                     toolTip: 'Delete Coordinator',
                     callback: handleActionClick,
                  },
               ]}
            />
         </Panel>
         <ConfirmModal
            open={openConfirmModal}
            handleOnClose={(e: any) => {
               setOpenConfirmModal(!openConfirmModal);
            }}
            handleOnConfirm={(e: any) => {
               setOpenConfirmModal(false);
               handleDeleteCoord(coordToRemove);
            }}
            value={'coordinator, "' + coordToRemove?.productCoordinator?.name + '"'}
         />
      </>
   );
};

export default Coordinators;
