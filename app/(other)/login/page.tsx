import React from 'react';
import LoginClient from './LoginClient';

const Login = () => {
   // because this part of the app isn't wrapper in the Auth Provider, we need to do some simple auth checking in this component
   return <LoginClient />;
};

export default Login;
