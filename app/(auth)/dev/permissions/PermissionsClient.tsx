'use client';
import React from 'react';

interface Props {
   allPermissions: any;
}

const PermissionsClient = ({ allPermissions }: Props) => {
   console.log('allPermissions:', allPermissions);
   return <div>PermissionsClient</div>;
};

export default PermissionsClient;
