import ErrorClient from '@/common/components/error-client/ErrorClient';
import PageProvider from '@/providers/PageProvider';
import { fetchDbApi } from '@/serverActions';
import CallRouteClient from './CallRouteClient';

interface Props {
   params: { id: string };
}

const CallRoute = async ({ params }: Props) => {
   const callRouteId = params.id !== 'new' ? params.id : null;

   let phoneNumbersData: any = null;
   let statusesData: any = null;
   let callRouteTypesData: any = null;
   let actionTypesData: any = null;
   let callRouteData: any = null;
   let usersData: any = null;
   let rolesData: any = null;

   await Promise.allSettled(
      callRouteId
         ? [
              getPhoneNumbers(),
              getStatuses(),
              getCallRouteTypes(),
              getCallRouteActionTypes(),
              getUsers(),
              getRoles(),
              getCallRoute(callRouteId),
           ]
         : [getPhoneNumbers(), getStatuses(), getCallRouteTypes(), getCallRouteActionTypes(), getUsers(), getRoles()]
   ).then((results: any) => {
      const [
         phoneNumbersResult,
         statusesResult,
         callRouteTypesResult,
         callRouteActionTypesResult,
         usersResult,
         rolesResult,
         callRouteResult,
      ] = handleResults(results);
      if (phoneNumbersResult) phoneNumbersData = phoneNumbersResult;

      if (statusesResult) statusesData = statusesResult;

      if (callRouteTypesResult) callRouteTypesData = callRouteTypesResult;

      if (callRouteActionTypesResult) actionTypesData = callRouteActionTypesResult;

      if (usersResult) usersData = usersResult;

      if (rolesResult) rolesData = rolesResult;

      if (callRouteResult) callRouteData = callRouteResult;
   });

   if (callRouteId && !callRouteData?.id) {
      return (
         <ErrorClient
            errorMessage={`Looks like this Call Route does not exist`}
            primaryBtnText='Create New Call Route'
            primaryBtnRoute={'/admin/call-routing/new'}
         />
      );
   }

   return (
      <PageProvider>
         <CallRouteClient
            phoneNumbersData={!!phoneNumbersData?.length ? phoneNumbersData : []}
            statusesData={!!statusesData?.length ? statusesData : []}
            callRouteTypesData={!!callRouteTypesData?.length ? callRouteTypesData : []}
            actionTypesData={!!actionTypesData?.length ? actionTypesData : []}
            usersData={!!usersData?.length ? usersData : []}
            rolesData={!!rolesData?.length ? rolesData : []}
            callRouteData={callRouteData}
         />
      </PageProvider>
   );
};

export default CallRoute;

const handleResults = (results: any) => {
   return results.map((result: any) => {
      if (result.status === 'fulfilled') return result.value;
   });
};

const getPhoneNumbers = () => {
   // GET phone numbers that aren't used in other call-routes or assigned to a user
   return fetchDbApi(`/api/v2/phone-numbers/query`, {
      method: 'POST',
      body: JSON.stringify({
         include: [
            {
               model: 'phoneNumbersOnCallRoutes',
               required: false,
               as: 'callRoutesOnPhoneNumber',
               attributes: [],
            },
            {
               model: 'phoneNumbersOnUsers',
               required: false,
               as: 'usersOnPhoneNumber',
               attributes: [],
            },
         ],
         where: {
            '$callRoutesOnPhoneNumber.phoneNumberId$': null,
            '$usersOnPhoneNumber.phoneNumberId$': null,
         },
      }),
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const getStatuses = () => {
   // GET statuses that aren't used in other call-routes
   return fetchDbApi(`/api/v2/statuses/query`, {
      method: 'POST',
      body: JSON.stringify({
         include: [
            {
               model: 'statusesOnCallRoutes',
               required: false,
               as: 'callRoutesOnStatus',
               attributes: [],
            },
         ],
         where: {
            '$callRoutesOnStatus.statusId$': null,
         },
      }),
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const getCallRouteTypes = () => {
   return fetchDbApi(`/api/v2/call-routes/types`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const getCallRouteActionTypes = () => {
   return fetchDbApi(`/api/v2/call-routes/action-types`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const getCallRoute = (callRouteId: string) => {
   return fetchDbApi(`/api/v2/call-routes/${callRouteId}`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const getUsers = () => {
   return fetchDbApi(`/api/v2/users`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};

const getRoles = () => {
   return fetchDbApi(`/api/v2/roles`, {
      method: 'GET',
      cache: 'no-store',
   }).catch((err) => console.error('err', err));
};
