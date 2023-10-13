'use client'; // Error components must be Client components

import { useEffect } from 'react';
import Button from '../common/components/button/Button';

interface Props {
   error: Error;
   reset: () => void;
}

const AuthError = ({ error, reset }: Props) => {
   useEffect(() => {
      // Log the error to an error reporting service
      console.log(error);
   }, [error]);

   return (
      <div>
         <h2>There was an error:</h2>
         <h4>{error.message}</h4>
         <br />
         <Button
            onClick={
               // Attempt to recover by trying to re-render the segment
               () => reset()
            }>
            Try again
         </Button>
      </div>
   );
};

export default AuthError;
