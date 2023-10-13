'use client';
import { useEffect, useState } from 'react';
import { Bucket } from '../../../app/(auth)/admin/(organization)/buckets/(partials)/types';
import DropDown from '../../../common/components/drop-down/DropDown';
import { BucketResponse } from './types';

type Props = {
   buckets: BucketResponse[];
   onBucketSelect: (selectedBucket: BucketResponse) => void;
   selectedBucket: BucketResponse | null;
};

const BucketsDropDown = ({ buckets, onBucketSelect, selectedBucket }: Props) => {
   const [activeBucket, setActiveBucket] = useState<BucketResponse | null>();

   useEffect(() => {
      if (selectedBucket) {
         setActiveBucket(selectedBucket);
      }
   }, []);

   const handleUpdateActiveBucket = (e: any, updatedActiveBucket: BucketResponse) => {
      setActiveBucket(updatedActiveBucket);
      onBucketSelect(updatedActiveBucket);
   };

   return (
      <DropDown
         name='Bucket'
         options={buckets || []}
         selectedValues={activeBucket ? [activeBucket] : []}
         keyPath={['name']}
         placeholder='Choose Bucket'
         onOptionSelect={handleUpdateActiveBucket}
      />
   );
};

export default BucketsDropDown;
