'use client';
import AuthProvider from '../../providers/AuthProvider';
import React, { useEffect, useState } from 'react';
import Sidebar from '../../features/components/sidebar/Sidebar';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import CallBar from '../../features/components/callbar/CallBar';
import { selectCallBarStatus } from '../../store/slices/twilio';
import { selectUser, updateUser } from '../../store/slices/user';
import { setAddToast } from '../../store/slices/toast';
import axios from 'axios';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
   const [showModal, setShowModal] = useState(false);

   // const callJustEnded = useAppSelector(selectCallJustEnded);
   // const userId = useAppSelector(selectUserId);
   // const leadId = useAppSelector(selectLeadId);
   const isCallBarShowing = useAppSelector(selectCallBarStatus);
   const dispatch = useAppDispatch();
   const user = useAppSelector(selectUser);

   useEffect(() => {
      // call utility initially on load or whenever the user object changes
      handleNotifyUserOfAppointment();

      // every one minute check to see if there are appointments coming & notify the user
      const userAppointmentInterval = setInterval(() => {
         handleNotifyUserOfAppointment();
      }, 60000); // every one minute

      // every 14.5 minutes, refresh the appts state inside the user slice to make sure to get the most recent appts
      const fetchUserApptsInterval = setInterval(() => {
         fetchUserAppts();
      }, 870000);

      return () => {
         clearInterval(userAppointmentInterval);
         clearInterval(fetchUserApptsInterval);
      };
   }, [user]);

   const handleNotifyUserOfAppointment = () => {
      // console.log('seeing if user has any appts to notify them...');
      // console.log('new Date(user?.appointments[1]):', new Date(user?.appointments[0].appointmentTime));
      if (!user) return;
      if (!user?.appointments?.length) return;
      // check to see if user has an appointment within 15 minutes or 1 minite
      user?.appointments?.forEach((appt: any) => {
         const apptTime = new Date(appt.appointmentTime);
         const now = new Date();

         // apptTime has passed
         if (now > apptTime) return;

         const timeDiff = apptTime.getTime() - now.getTime();
         const diffInMinutes = Math.round(timeDiff / (1000 * 60));

         if (diffInMinutes === 15 || diffInMinutes === 5 || diffInMinutes === 1) {
            dispatch(
               setAddToast({
                  iconName: 'AlarmClock',
                  details: [
                     {
                        label: 'Appt Scheduled!',
                        text: `Appointment scheduled for ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}!`,
                     },
                  ],
                  variant: 'warning',
                  animate: true,
                  // destinationRoute: '' // here we can route to where ever we want on click...
                  destinationRoute: '/admin/users',
               })
            );
         }
      });
   };

   const fetchUserAppts = async () => {
      console.log('fetching user appts...');
      if (!user?.id) return;
      const url = `${process.env.CLIENT_SITE}/api/v2/appointments/query`;
      const queryObj = { where: { createdById: user?.id } };
      const appts = await axios.post(url, queryObj, { headers: { Authorization: `Bearer ${user?.token}` } });
      if (!appts?.data && !appts?.data?.length) return;
      dispatch(
         updateUser({
            appointments: [...appts.data],
         })
      );
   };

   return (
      <AuthProvider>
         <CallBar />
         <div
            className={`absolute bottom-0 grid grid-cols-[250px_1fr] w-screen`}
            style={{ height: isCallBarShowing ? 'calc(100vh - 60px)' : '100vh' }}>
            <Sidebar></Sidebar>
            <div
               className={`p-[10px] min-h-[100%] w-[calc(100vw-250px)] overflow-x-hidden dark:bg-lum-gray-800 bg-lum-gray-100`}>
               <div className={`min-w-[535px] max-w-[1460px] mx-auto`}>{children}</div>
            </div>
         </div>
      </AuthProvider>
   );
};

export default AuthLayout;
