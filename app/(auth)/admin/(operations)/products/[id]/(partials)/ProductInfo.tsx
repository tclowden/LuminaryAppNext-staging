'use client';
import React, { useState } from 'react';
import DropDown from '../../../../../../../common/components/drop-down/DropDown';
import Explainer from '../../../../../../../common/components/explainer/Explainer';
import Grid from '../../../../../../../common/components/grid/Grid';
import Input from '../../../../../../../common/components/input/Input';
import Textarea from '../../../../../../../common/components/textarea/Textarea';
import { camelCaseToTitleCase } from '../../../../../../../utilities/helpers';
import { Color, ProductIcon } from '../types';

interface Props {
   productName?: string;
   primary: boolean;
   description?: string;
   iconColor?: string;
   iconName?: string;
   colors: Array<Color>;
   icons: Array<ProductIcon>;
   formErrors?: any;
   handleChange: (e: any) => void;
   handleBlur: (e: any) => void;
}

const ProductInfo = ({
   productName,
   description,
   primary,
   iconColor,
   iconName,
   colors,
   icons,
   formErrors,
   handleChange,
   handleBlur,
}: Props) => {
   const handleColorSelect = (e: any, selectedColor: Color) => {
      // need to change it via the useForm hook & via redux...
      handleChange({ target: { type: 'text', value: selectedColor.iconConfig.color, name: 'iconColor' } });
   };

   const handleIconSelect = (e: any, selectedIcon: ProductIcon) => {
      handleChange({ target: { type: 'text', value: selectedIcon.iconConfig.name, name: 'iconName' } });
   };

   const handlePrimarySelect = (e: any, selectedPrimaryOption: { value: 'Yes' | 'No' }) => {
      handleChange({
         target: { type: 'text', value: selectedPrimaryOption.value === 'Yes' ? true : false, name: 'primary' },
      });
   };

   return (
      <Explainer
         title='Product Info'
         description='Give your Product a name and select an icon. Is this a primary product?'>
         <Input
            data-test={'name'}
            label='Product Name'
            value={productName || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            name={'name'}
            placeholder='Enter a Product Name'
            required
            errorMessage={formErrors?.name}
         />
         <Textarea
            data-test={'description'}
            label='Description'
            name='description'
            value={description || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={'Enter Product Description'}
            errorMessage={formErrors?.description}
            isRequired
         />
         <Grid columnCount={3} responsive>
            <DropDown
               data-test={'iconColor'}
               label='Color'
               options={colors}
               selectedValues={
                  iconColor
                     ? [
                          {
                             displayName: iconColor.charAt(0).toUpperCase() + iconColor.slice(1),
                             iconConfig: { name: 'Rectangle', color: iconColor },
                          },
                       ]
                     : []
               }
               placeholder='Select Icon Color'
               keyPath={['displayName']}
               name='iconColor'
               onBlur={handleBlur}
               onOptionSelect={handleColorSelect}
               errorMessage={formErrors?.iconColor}
               required
            />
            <DropDown
               searchable
               data-test={'iconName'}
               label='Icon'
               options={icons}
               selectedValues={
                  iconName
                     ? [
                          {
                             displayName: camelCaseToTitleCase(iconName),
                             iconConfig: { name: iconName, color: iconColor || 'gray:400' },
                          },
                       ]
                     : []
               }
               placeholder='Select Icon'
               keyPath={['displayName']}
               name='iconName'
               onBlur={handleBlur}
               onOptionSelect={handleIconSelect}
               errorMessage={formErrors?.iconName}
               required
            />
            <DropDown
               data-test={'primary'}
               label='Primary Product'
               selectedValues={[{ value: primary ? 'Yes' : 'No' }]}
               keyPath={['value']}
               placeholder={'Is this a Primary Product?'}
               options={[{ value: 'Yes' }, { value: 'No' }]}
               onOptionSelect={handlePrimarySelect}
            />
         </Grid>
      </Explainer>
   );
};

export default ProductInfo;
