// import db from '@/sequelize/models';
import Ably from 'ably/promises';
import 'dotenv/config';

export const ringUser = async ({
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
      if (!action?.userIdsToDial?.length) throw new Error('No user ids were provided to call specific user');
      const userId = action.userIdsToDial[0];
      // const user = await db.users.findByPk(userId, {
      //    include: {
      //       model: db.phoneNumbersOnUsers,
      //       as: 'phoneNumbersOnUser',
      //       required: false,
      //       include: { model: db.phoneNumbers, required: false },
      //    },
      // });
      // if (!user) throw new Error(`User with id ${userId} does not exist`);

      // if (!user?.phoneNumbersOnUser.length) throw new Error('User has no phoneNumbers');

      // const primaryPhoneNumberOnUser =
      //    user?.phoneNumbersOnUser.find((numOnUser: any) => numOnUser.isPrimary) || user?.phoneNumbersOnUser[0];

      // if (!primaryPhoneNumberOnUser) throw new Error('User has no phone number');

      // const userPhoneNumber = primaryPhoneNumberOnUser.phoneNumber?.number;

      // if (!userPhoneNumber) throw new Error('User does not have phone number');

      const channel = client.channels.get(userId);
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
