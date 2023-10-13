'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import solarHouseBlue from '../../../../../public/assets/proposal/images/solar-house-blue.jpg';
import ssOrangWhiteLogo from '../../../../../public/assets/proposal/logos/ss-orang-white-logo.png';
import shineHomeLogo1Green from '../../../../../public/assets/proposal/logos/shine-home-logo-1-green.png';
import shineAirLogo from '../../../../../public/assets/proposal/logos/shine-air-logo.png';
import Modal from '../../../../../common/components/modal/Modal';
import Button from '../../../../../common/components/button/Button';
import PageProvider from '../../../../../providers/PageProvider';
import ConfigProposalClient from '../ConfigProposalClient';
import { proposalTypes } from '../dummyData';
import Cookies from 'js-cookie';
import axios from 'axios';

interface Props {
   showEditModal: boolean;
   setShow: (show: boolean) => void;
   proposalId: any;
   leadId: string;
   proposalData: any;
   setPreviewUrl: any;
   previewURL: any;
}

const Edit = ({ showEditModal, setShow, proposalId, leadId, proposalData, setPreviewUrl, previewURL }: Props) => {
   const [products, setProducts] = useState({});
   const [productConfig, setProductConfig] = useState({});
   const close = () => {
      console.log('Closing');
   };

   useEffect(() => {
      const userAuthToken = Cookies.get('LUM_AUTH');
      axios({
         method: 'get',
         url: `/api/v2/proposal-options/settings`,
         headers: {
            Authorization: `Bearer ${userAuthToken}`,
         },
      })
         .then(function (response) {
            // Proposal Option information
            console.log('proposal option info', response.data);

            interface products {
               id: string;
               name: string;
               createdAt: string;
               updatedAt: string;
            }

            // products types

            setProducts(() => {
               let formattedProducts: any;
               formattedProducts = {};
               response.data.products.forEach((e: products) => {
                  const keyName = e.name;
                  formattedProducts[keyName as keyof Object] = false;
               });

               return formattedProducts;
            });

            // setTypes residential commercial etc

            setProductConfig(() => response.data.productOptions);
         })
         .catch(function (error) {
            console.log(error);
         });
   }, []);
   return (
      <>
         <Modal isOpen={showEditModal} onClose={setShow} size={'large'}>
            <ConfigProposalClient
               proposalId={proposalId}
               leadId={leadId}
               defaultProducts={products}
               defaultProposalTypes={proposalTypes}
               proposalData={proposalData}
               setPreviewUrl={setPreviewUrl}
               previewURL={previewURL}
               productConfig={productConfig}
            />
         </Modal>
      </>
   );
};

export default Edit;
