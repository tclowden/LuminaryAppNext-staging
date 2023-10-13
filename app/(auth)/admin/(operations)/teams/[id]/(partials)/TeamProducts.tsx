'use client';
import React from 'react';
import Checkbox from '../../../../../../../common/components/checkbox/Checkbox';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../../common/components/grid/Grid';
import { useAppSelector } from '../../../../../../../store/hooks';
import { selectPageContext } from '../../../../../../../store/slices/pageContext';

interface Props {
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
   values: any;
   errors: any;
}

const TeamProducts = ({ values, errors, handleBlur, handleChange }: Props) => {
   const { products } = useAppSelector(selectPageContext);

   const handleCheckProduct = (e: any, selectedProduct: any) => {
      // see if wanting to add or take away
      const addProduct = e.target.checked;
      // see if product already exists in teamProducts, get index of product
      const prodAlreadyAssociatedWithTeamIndex = values?.teamProducts?.findIndex(
         (teamProd: any) => teamProd.productId === selectedProduct.id
      );

      let tempTeamProducts = [...values?.teamProducts];
      // if add product is true & didn't find a product associated with the team
      if (addProduct && prodAlreadyAssociatedWithTeamIndex === -1) {
         // add product
         tempTeamProducts = [
            ...tempTeamProducts,
            { productId: selectedProduct.id, product: selectedProduct, archived: false, id: null },
         ];
      }
      // if add product is true && did find a product associated with the team
      else if (addProduct && prodAlreadyAssociatedWithTeamIndex !== -1) {
         // using the index, set archived to false of the teamProducts array
         tempTeamProducts[prodAlreadyAssociatedWithTeamIndex].archived = false;
      }
      // if add product is false && did find a product associated with the team
      else if (!addProduct && prodAlreadyAssociatedWithTeamIndex !== -1) {
         // using the index, set archived to true of the teamProducts array
         tempTeamProducts[prodAlreadyAssociatedWithTeamIndex].archived = true;
      }
      // if add product is false && didn't find a product associated with the team
      else if (!addProduct && prodAlreadyAssociatedWithTeamIndex === -1) {
         // hmmm... do nothing?
         // we should never get here because all products are default not associated with the team
         console.log('should not be getting here!');
      }

      // set new teamProducts array
      handleChange({ target: { type: 'text', name: 'teamProducts', value: tempTeamProducts } });
   };

   return (
      <Explainer description='Select a product(s) associated to this team'>
         <Grid>
            <span className='text-[12px] text-lum-gray-500 dark:text-lum-gray-300'>
               Products
               <span className='pl-[3px]'>*</span>
            </span>
            {/* <div className='text-[16px] text-lum-gray-700 dark:text-lum-gray-300'>Products</div> */}
            <Grid columnCount={2} responsive>
               {products?.map((product: any) => {
                  const isChecked = values?.teamProducts?.some(
                     (teamProd: any) => teamProd.productId === product.id && !teamProd.archived
                  );
                  return (
                     <Checkbox
                        key={product.id}
                        name={product.name}
                        label={product.name}
                        checked={isChecked}
                        onChange={(e: any) => {
                           handleCheckProduct(e, product);
                        }}
                     />
                  );
               })}
            </Grid>
         </Grid>
      </Explainer>
   );
};

export default TeamProducts;
