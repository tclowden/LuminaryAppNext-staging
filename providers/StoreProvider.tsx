'use client';

// Wrap your application/component with this wrapper to access global state via the client

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';

// const SetInitStore = ({ children }: any) => {
//    const dispatch = useAppDispatch();
//    const user = useAppSelector(selectUser);

//    useEffect(() => {
//       const asyncInitStore = async () => {
//          console.log('now initiating store....');
//          // const authToken: string | undefined = Cookies.get('LUM_AUTH');
//          const authToken: string | null = user.token;

//          await Promise.allSettled([fetchSidebarData(authToken)]).then((results: any) => {
//             const [sidebarDataResults] = results.map((result: any) => {
//                if (result.status === 'fulfilled') return result.value;
//             });

//             // if (permissionsDataResults) dispatch(setPermissions(permissionsDataResults));
//             if (sidebarDataResults) dispatch(setSidebar(sidebarDataResults));
//          });
//       };

//       if (user.id) asyncInitStore();
//    }, [user.id]);

//    const fetchPermissionsData = async (authToken: string | null) => {
//       if (!authToken) return console.log('not getting token...');
//       return axios
//          .get(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/permissions`, {
//             headers: { Authorization: `Bearer ${authToken}`, 'Content-type': 'application/json' },
//          })
//          .then((res: any) => {
//             // if (!!res.data) dispatch(setPermissions(res.data));
//             if (!!res.data) return res.data;
//             else console.log('trouble fetching permissions...', res);
//          })
//          .catch((err: any) => {
//             console.log('err:', err);
//          });
//    };

//    const fetchSidebarData = (authToken: string | null) => {
//       if (!authToken) return console.log('not getting token...');
//       return axios
//          .get(`${process.env.NEXT_PUBLIC_LUMINARY_DB_API}/pages`, {
//             headers: { Authorization: `Bearer ${authToken}` },
//          })
//          .then((res: any) => {
//             // if (!!res.data) dispatch(setSidebar(res.data));
//             if (!!res.data) return res.data;
//             else console.log('hmmm... what is res.data??', res.data);
//          })
//          .catch((err: any) => {
//             console.log('err:', err);
//          });
//    };

//    return (
//       <>
//          {children}
//       </>
//    );
// };

const StoreProvider = ({ children, ...otherProps }: { children: React.ReactNode }) => {
   return <Provider store={store}>{children}</Provider>;
};

export default StoreProvider;
