// import db from '@/sequelize/models';
import Ably from 'ably/promises';
import 'dotenv/config';

export const ringRole = async ({
   incomingCall,
   lead,
   notifiedChannels,
   action,
}: {
   incomingCall: any;
   lead: any;
   notifiedChannels: Array<string>;
   action: any;
}) => {
   try {
      const client = new Ably.Realtime(`${process.env.ABLY_ROOT_KEY}`);
      if (!action?.roleIdsToDial?.length) throw new Error('No role ids were provided to call users with given roles');
      const roleId = action.roleIdsToDial[0];
      // const role = await db.roles.findByPk(roleId);

      // if (!role) throw new Error(`Role with id ${roleId} does not exist`);

      const channel = client.channels.get(roleId);
      await channel.publish({
         name: 'incoming-call',
         data: {
            incomingCall,
            lead,
            notifiedChannels,
         },
      });

      return { success: true };
   } catch (err: any) {
      console.log('err:', err);
      throw new Error(err);
   }
};
