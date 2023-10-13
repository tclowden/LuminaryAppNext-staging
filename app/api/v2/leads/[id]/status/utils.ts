export async function triggerWebHookStatusRule(payload: any, authToken: any) {
   console.log('Hello from triggerWebHookStatusRule()');

   return new Promise(async (resolve, reject) => {
      try {
         await fetch(`${process.env.CLIENT_SITE}/api/v2/statuses/webhooks`, {
            method: 'POST',
            body: JSON.stringify({
               statusId: payload.newStatus.id,
               leadId: payload.leadId,
            }),
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
         }).then(async (res) => {
            const data = await res.json();
            console.log('statuses/webhooks::::::::', data);
            resolve(true);
         });
      } catch (err: any) {
         console.log('ERROR AT triggerWebHookStatusRule()::::::::: : ', err);
         reject(err);
      }
   });
}
export async function humanAnsweredStatusRule(payload: any) {
   console.log('Hello from humanAnsweredStatusRule()');

   return { data: 'true' };
}

export async function askAppointmentOutcomeStatusRule(payload: any) {
   console.log('Hello from askAppointmentOutcome()');
   // console.log('Logs the outcome of appointment kept question: ', payload);

   // return new Promise((resolve, reject) => {
   //    try {
   //       resolve(true);
   //    } catch (err: any) {
   //       reject(err);
   //    }
   // });

   return { data: 'true' };
}
export async function hiddenStatusRule(payload: any) {
   console.log('Hello from hiddenStatusRule()');

   return { data: 'true' };
}
export async function requireNoteStatusRule(payload: any) {
   console.log('Hello from requireNoteStatusRule()');
   return new Promise(async (resolve, reject) => {
      try {
         const note = await fetch(`${process.env.CLIENT_SITE}/api/v2/notes`, {
            method: 'PUT',
            body: JSON.stringify({
               content: payload.note,
               leadId: payload.leadId,
               createdById: payload.userId,
            }),
         }).then((response) => response.json());
         resolve(note);
      } catch (err: any) {
         console.log('ERR: ', err);
         reject(err);
      }
   });
}
export async function bucketStatusRule(payload: any) {
   console.log('Hello from bucketStatusRule()');

   return { data: 'true' };
}
export async function hideIfContactedStatusRule(payload: any) {
   console.log('Hello from hideIfContactedStatusRule()');

   return { data: 'true' };
}
export async function dollarPerLeadStatusRule(payload: any) {
   console.log('Hello from dollarPerLeadStatusRule()');

   return { data: 'true' };
}

/**
 *
 *
 */
export async function scheduledStatusRule(payload: any) {
   console.log('Hello from scheduledStatusRule()');
   return new Promise(async (resolve, reject) => {
      try {
         const { userId, leadId, scheduledStatusDate } = payload;

         const newAppointment = await fetch(`${process.env.CLIENT_SITE}/api/v2/leads/${leadId}/appointments`, {
            method: 'PUT',
            body: JSON.stringify({
               appointmentTime: scheduledStatusDate,
               leadId: leadId,
               kept: false,
               createdById: userId,
               assignedRepId: userId,
               appointmentType: 'User Scheduled',
            }),
         }).then((response) => response.json());
         resolve(newAppointment);
      } catch (err: any) {
         console.log('ERR: ', err);
         reject(err);
      }
   });
}
export async function pipeStatusRule(payload: any) {
   console.log('Hello from pipeStatusRule()');

   return { data: 'true' };
}
export async function doNotContactStatusRule(payload: any) {
   console.log('Hello from doNotContactStatusRule()');

   return { data: 'true' };
}
export async function requireNumberOfCallsStatusRule(payload: any) {
   console.log('Hello from requireNumberOfCallsStatusRule()');

   return { data: 'true' };
}
export async function removeFromPipeStatusRule(payload: any) {
   console.log('Hello from removeFromPipeStatusRule()');

   return { data: 'true' };
}
