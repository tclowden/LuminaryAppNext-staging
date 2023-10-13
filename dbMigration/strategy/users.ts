import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';

export class UsersStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         await this.migrateKeyTypes();

         const deepCopy = (data: any) => JSON.parse(JSON.stringify(data));

         const offices = await this.targetDb.offices.findAll({}).then(deepCopy);
         let keyTypes = await this.targetDb.keyTypesLookup.findAll({}).then(deepCopy);
         const registerKeyType = keyTypes?.find((keyType: any) => keyType?.name === 'register');
         const forgotPasswordKeyType = keyTypes?.find((keyType: any) => keyType?.name === 'forgot_password');

         let usersMigrated = false;
         while (!usersMigrated) {
            const userKeysToWrite: any[] = [];
            const results = await this.migrateTableData(
               'users',
               'user_id',
               async (pendingUser: any) => {
                  // USER DATA REFORMATTING
                  const userFirstName = pendingUser?.legal_first_name
                     ? pendingUser.legal_first_name
                     : pendingUser?.first_name;
                  const userPreferredFirstName = pendingUser?.legal_first_name ? pendingUser.first_name : null;

                  let officeId = null;
                  if (pendingUser?.office) {
                     const foundOffice = offices.find((office: any) => office?.oldId === pendingUser?.office);
                     if (foundOffice) officeId = foundOffice?.id;
                  }

                  // CREATE USER IN NEW DB
                  const newUser = await this.targetDb.users.create({
                     oldId: pendingUser.user_id,
                     firstName: userFirstName,
                     lastName: pendingUser.last_name,
                     preferredFirstName: userPreferredFirstName,
                     emailAddress: pendingUser.email_address,
                     // comment out password hash because everyone will have to reset their passwords anyway
                     // passwordHash: pendingUser.password_hash,
                     phoneNumber: pendingUser.phone_number,
                     prefersDarkMode: pendingUser.prefers_dark_mode,
                     profileUrl: pendingUser?.profile_url?.length > 255 ? null : pendingUser?.profile_url,
                     officeId: officeId,
                  });

                  // usersKeys
                  const keyTypesWithValue = [];
                  let keysToWrite = false;
                  if (pendingUser?.register_key) {
                     keyTypesWithValue.push({ ...registerKeyType, value: pendingUser?.register_key });
                     keysToWrite = true;
                  }
                  if (pendingUser?.forgot_key) {
                     keyTypesWithValue.push({ ...forgotPasswordKeyType, value: pendingUser?.forgot_key });
                     keysToWrite = true;
                  }

                  if (keysToWrite) {
                     keyTypesWithValue?.forEach((keyType: any) => {
                        userKeysToWrite.push({
                           userId: newUser.id,
                           keyTypeId: keyType?.id,
                           value: keyType?.value,
                           expiration: this.isProperDate(pendingUser?.register_timeout)
                              ? pendingUser?.register_timeout
                              : new Date(),
                           archived: true,
                        });
                     });
                     await this.targetDb.usersKeys.bulkCreate(userKeysToWrite);
                  }

                  // rolesOnUsers
                  if (pendingUser?.role) {
                     const newRole = await this.targetDb.roles.findOne({
                        where: { oldId: pendingUser?.role },
                     });
                     await this.targetDb.rolesOnUsers.create({ userId: newUser.id, roleId: newRole?.id });
                  }

                  // teamsUsers
                  // select all the teams the user is associated with
                  const allOfUsersTeams = await this.queryDb(
                     `SELECT * FROM ${process.env.ORIGIN_DATABASE}.user_in_team WHERE user = ?`,
                     [pendingUser.user_id]
                  ).then(deepCopy);

                  if (!!allOfUsersTeams?.length) {
                     for (const userTeam of allOfUsersTeams) {
                        const newTeam = await this.targetDb.teams.findOne({
                           where: { oldId: userTeam?.team },
                        });
                        await this.targetDb.teamsUsers.create({
                           userId: newUser?.id,
                           teamId: newTeam?.id,
                           teamLead: userTeam?.team_lead === 1 ? true : false,
                        });

                        // set migrated to true on user_in_team table...
                        // the reason i'm doing it here instead of it's own strategy is because the user_in_team table doesn't have a PK
                        // so while I have the current team (which is the id) & current user (which is the id)... just set migrated to 1
                        // maybe I don't have to have a migrated column on this table... becuase if the user was migrate, then the user_in_team was migrated...
                        // well, i'll do this anyway
                        await this.queryDb(
                           `UPDATE ${process.env.ORIGIN_DATABASE}.user_in_team SET migrated = 1 WHERE user = ? AND team = ?`,
                           [userTeam.user, userTeam.team]
                        );
                        // if (result) Logger.info(`Migrated! Rows affected: ${result?.affectedRows}`);
                     }
                  }

                  return true;
               },
               false
            );
            if (results) Logger.info(`Migrated users table`);

            const allMigrated = await this.getMigratedStatus('users');
            if (allMigrated) usersMigrated = true;
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating users');
      }
   }

   private async migrateKeyTypes() {
      // const result
      const alreadyInDb = await this.targetDb.keyTypesLookup.findOne({});
      if (alreadyInDb) {
         Logger.info(`Key types already exists in db...`);
         return;
      }

      const defaultTeamTypes = [{ name: 'register' }, { name: 'forgot_password' }];
      const result = await this.targetDb.keyTypesLookup.bulkCreate(defaultTeamTypes);

      if (result) Logger.info(`Migrated key types table`);
   }
}
