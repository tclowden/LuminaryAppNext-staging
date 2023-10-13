import { useState } from 'react';

import Grid from '@/common/components/grid/Grid';
import Modal from '@/common/components/modal/Modal';
import Radio from '@/common/components/radio/Radio';

import { PRODUCTS } from '@/utilities/luminaryConstants';

type Props = {
   isOpen: boolean,
   onClose: (value: React.SetStateAction<boolean>) => void,
   selectedProductName: string,
   setSelectedProductName: (React.Dispatch<React.SetStateAction<string>>) | ((productName: string) => void)
};

function FilterEventsModal({isOpen, onClose, setSelectedProductName, selectedProductName}: Props) {

   const [tempSelectedProduct, setTempSelectedProduct] = useState(selectedProductName);

    const handleFilter = () => {
      setSelectedProductName(tempSelectedProduct); 
      onClose(false); 
   };

   const handleResetFilter = () => {
      setSelectedProductName('');
      onClose(false);
   }
    
    const handleRadioToggle = (productName: string) => {
      setTempSelectedProduct(productName);
     };

   return (
      <Modal
         isOpen={isOpen}
         onClose={onClose}
         primaryButtonText={'Filter'}
         title='Filter Events by Product'
         secondaryButtonText='Reset filter'
         secondaryButtonCallback={handleResetFilter}
         primaryButtonCallback={handleFilter}
         >
         <Grid columnCount={3} columnGap={72} className='justify-items-start' responsive>
         {PRODUCTS.map((product) => (
                  <Radio
                     key={product.name}
                     checked={product.name === tempSelectedProduct}
                     name={product.name}
                     label={product.name}
                     value={product.name}
                     onChange={() => handleRadioToggle(product.name)}
                  />
               ))}
               
         </Grid>
      </Modal>
   );
}

export default FilterEventsModal;