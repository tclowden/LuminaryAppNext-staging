'use client';

import React from 'react';
import Icon from '../../../../../../common/components/Icon';
import InputAddress, { AddressDetails } from '../../../../../../common/components/input-address/InputAddress';
import Grid from '../../../../../../common/components/grid/Grid';

interface Props {
   addressDetails?: AddressDetails;
   setAddressDetails: (addressDetails?: AddressDetails) => void;
   show: boolean;
}

const Map = ({ addressDetails, setAddressDetails, show }: Props) => {
   return (
      <>
         {show && (
            <>
               <InputAddress
                  draggableMarker={!addressDetails?.addressVerified}
                  showMapWhenAddressSelected
                  addressDetails={addressDetails}
                  onAddressSelect={setAddressDetails}
               />
               {/* Address details */}
               {addressDetails && !!Object.keys(addressDetails)?.length && (
                  <>
                     <Grid columnCount={3} responsive columnMinWidth='150px'>
                        <div className='flex flex-col'>
                           <span className='text-[10px] text-lum-gray-450'>Street Address</span>
                           <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                              {addressDetails?.streetAddress}
                           </span>
                        </div>
                        <div className='flex flex-col'>
                           <span className='text-[10px] text-lum-gray-450'>City</span>
                           <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                              {addressDetails?.city}
                           </span>
                        </div>
                        <div className='flex flex-col'>
                           <span className='text-[10px] text-lum-gray-450'>State</span>
                           <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                              {addressDetails?.state}
                           </span>
                        </div>
                        <div className='flex flex-col'>
                           <span className='text-[10px] text-lum-gray-450'>Zip Code</span>
                           <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                              {addressDetails?.zipCode}
                           </span>
                        </div>
                        <div className='flex flex-col'>
                           <span className='text-[10px] text-lum-gray-450'>Latitude</span>
                           <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                              {addressDetails?.latLng.lat}
                           </span>
                        </div>
                        <div className='flex flex-col'>
                           <span className='text-[10px] text-lum-gray-450'>Longitude</span>
                           <span className='text-[14px] text-lum-gray-700 dark:text-lum-white'>
                              {addressDetails?.latLng.lng}
                           </span>
                        </div>
                     </Grid>
                     <Grid>
                        <div className='flex flex-row items-center justify-center gap-x-2'>
                           <span
                              className={`${
                                 addressDetails?.addressVerified ? 'text-lum-green-500' : 'text-lum-red-500'
                              }`}>
                              Address Verified
                           </span>
                           <Icon
                              name='CheckMarkCircle'
                              color={`${addressDetails?.addressVerified ? 'green' : 'red'}`}
                              width={20}
                              height={20}
                           />
                           {/* {verifyingAddress ? (
                              <LoadingSpinner isOpen={verifyingAddress} />
                           ) : (
                              <Icon
                                 name='CheckMarkCircle'
                                 color={`${addressDetails?.addressVerified ? 'green' : 'red'}`}
                                 width={20}
                                 height={20}
                              />
                           )} */}
                        </div>
                     </Grid>
                  </>
               )}
            </>
         )}
      </>
   );
};

export default Map;
