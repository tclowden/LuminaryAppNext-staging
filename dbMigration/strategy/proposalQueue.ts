import { BaseMigration } from './base';
import { MigrationStrategy } from './contracts/migrationContract';
import Logger from '../logger';
import { LumError } from '../../utilities/models/LumError';
import { Op } from 'sequelize';

// type AuditLog = { table: string; rowId: string; originalValue: any; newValue: any; modifiedById: string; modifiedAt: Date; };

export class ProposalQueueStrategy extends BaseMigration implements MigrationStrategy {
   public async run() {
      try {
         let proposalDataMigrated = false;
         while (!proposalDataMigrated) {
            let result;

            await this.proposalStatusTypesLookup();

            // get lookup data
            const { proposalStatusTypes } = await this.getLookupData();

            result = await this.migrateTableData(
               'proposals',
               'proposal_id',
               async (currRow: any) => {
                  // this will go to the proposalQueue & auditLogs table
                  let migratedRes = null;

                  const owner = await this.targetDb.users.findOne({ where: { oldId: currRow.owner } });
                  // const lead = await this.targetDb.leads.findOne({ where: { oldId: currRow.lead } });
                  const lead = await this.targetDb.leads.findOne({
                     where: {
                        [Op.or]: [{ oldId: currRow.lead }, { otherOldIds: { [Op.contains]: [currRow.lead] } }],
                     },
                  });
                  const completedBy = await this.targetDb.users.findOne({ where: { oldId: currRow.completed_by } });
                  const assignedTo = await this.targetDb.users.findOne({ where: { oldId: currRow.assigned_to } });
                  const assignedBy = await this.targetDb.users.findOne({ where: { oldId: currRow.assigned_by } });

                  const newStatus = proposalStatusTypes.find((st: any) => st.name === 'New'); // this is when a proposal is created
                  // const failedStatus = proposalStatusTypes.find((st: any) => st.name === 'Failed'); // this is the proposal_queue migration
                  // const missingInfoStatus = proposalStatusTypes.find((st: any) => st.name === 'Missing Information'); // there is no indicator in the current db to differ between 'missing info' and 'revision requested'
                  const unassignedStatus = proposalStatusTypes.find((st: any) => st.name === 'Unassigned');
                  const revisionStatus = proposalStatusTypes.find((st: any) => st.name === 'Revision');
                  const completedStatus = proposalStatusTypes.find((st: any) => st.name === 'Completed');
                  const inProgressStatus = proposalStatusTypes.find((st: any) => st.name === 'In Progress');

                  // AUDIT LOG
                  const revisionRequestedBy = this.targetDb.users.findOne({ where: { oldId: currRow.assigned_by } });
                  const revisionRequestedAt = !this.isProperDate(currRow.revision_requested_at)
                     ? !this.isProperDate(currRow?.date_added_for_proposal)
                        ? new Date()
                        : currRow?.date_added_for_proposal
                     : currRow?.revision_requested_at;

                  // reconfigure data
                  // some of the completed & completed_at fields are invlid... fix it
                  if (!!currRow?.completed && !currRow?.completed_at) {
                     // completed is true... but completed_at date is null
                     currRow['completed_at'] = currRow['date_added_for_proposal'];
                  } else if (!currRow?.completed && currRow?.completed_at) {
                     // completed is false... but complete_at date is set
                     currRow['completed'] = 1;
                  }
                  // else -- completed is false and completed_at is null
                  // else -- completed is true and completed_at is not null

                  //? Proposal Conditions: keys --> assigned_to, completed, revision_requested_at
                  //•• if status = new
                  //••
                  //•• •• if ( completed, assigned to someone, no revision requested ) => set "completed" status type
                  //•• •• if ( completed, assigned to someone, with revision requested ) => set "completed" status type
                  //•• •• if ( completed, not assigned to someone, no revision requested ) => set "completed" status type
                  //•• •• if ( completed, not assigned to someone, with revision requested ) => "set "completed" status type
                  //••
                  //•• •• if ( not completed, assigned to someone, no revision requested ) => set "in progress" status type
                  //•• •• if ( not completed, assigned to someone, with revision requested ) => set "revision" status type
                  //•• •• if ( not completed, not assigned to someone, no revision requested ) => set "unassigned" status type
                  //•• •• if ( not completed, not assigned to someone, with revision requested ) => set "revision" status type
                  //••
                  //••
                  //••
                  //•• if status = revision
                  //••
                  //•• •• DEFAULT => set "revision" status type

                  // do not need to see what proposal_status the curr row is anymore... those are kind of messed up, use the logic below
                  const isCompleted = !!currRow?.completed;
                  const isInProgress = !currRow?.completed && currRow?.assigned_to && !currRow?.revision_requested_at;
                  const isRevision = !currRow?.completed && currRow?.revision_requested_at;
                  const isUnassigned = !currRow?.completed && !currRow?.assigned_to && !currRow?.revision_requested_at;
                  // const isRevision = !currRow?.completed && currRow?.assigned_to && currRow?.revision_requested_at
                  // const isRevision = !currRow?.completed && !currRow?.assigned_to && currRow?.revision_requested_at

                  // create the proposal
                  const proposalCreated = await this.targetDb.proposalQueue.create({
                     oldId: currRow.proposal_id,
                     ownerId: owner?.id,
                     dueAt: this.isProperDate(currRow?.proposal_due) ? currRow?.proposal_due : null,
                     leadId: lead?.id,
                     submittedToSolo: currRow?.submitted_to_solo === 1 ? true : false,
                     completedById: completedBy?.id,
                     proposalStatusId: newStatus?.id,
                     assignedToId: assignedTo?.id,
                     assignedById: assignedBy?.id,
                     assignedAt: currRow?.assigned_at,
                     createdAt: this.isProperDate(currRow?.date_added_for_proposal)
                        ? currRow?.date_added_for_proposal
                        : new Date(),
                  });

                  // see if the proposal is completed
                  if (isCompleted) {
                     // const modifiedBy = await this.targetDb.users.findOne({ where: { oldId: currRow?.completed_by } });
                     const modifiedAt = this.isProperDate(currRow?.completed_at) ? currRow?.completed_at : new Date();

                     // update the proposal created
                     migratedRes = await this.targetDb.proposalQueue.update(
                        { proposalStatusId: completedStatus?.id },
                        { where: { id: proposalCreated?.id } }
                     );
                     // create audit log row
                     await this.targetDb.auditLogs.create({
                        table: 'proposalQueue',
                        rowId: proposalCreated?.id,
                        originalValue: JSON.stringify(inProgressStatus),
                        newValue: JSON.stringify(completedStatus),
                        modifiedById: completedBy?.id,
                        modifiedAt: modifiedAt,
                     });
                  } else if (isInProgress) {
                     // if not complete, not a revision, and assigned to someone
                     const modifiedAt = this.isProperDate(currRow?.assigned_at) ? currRow?.assigned_at : new Date();

                     // update the proposal created
                     migratedRes = await this.targetDb.proposalQueue.update(
                        { proposalStatusId: inProgressStatus?.id },
                        { where: { id: proposalCreated?.id } }
                     );

                     // create audit log row
                     await this.targetDb.auditLogs.create({
                        table: 'proposalQueue',
                        rowId: proposalCreated?.id,
                        originalValue: JSON.stringify(unassignedStatus),
                        newValue: JSON.stringify(inProgressStatus),
                        modifiedById: assignedBy?.id,
                        modifiedAt: modifiedAt,
                     });
                  } else if (isRevision) {
                     // update the proposal created
                     migratedRes = await this.targetDb.proposalQueue.update(
                        { proposalStatusId: revisionStatus?.id },
                        { where: { id: proposalCreated?.id } }
                     );

                     // create audit log row
                     await this.targetDb.auditLogs.create({
                        table: 'proposalQueue',
                        rowId: proposalCreated?.id,
                        originalValue: JSON.stringify(inProgressStatus),
                        newValue: JSON.stringify(revisionStatus),
                        modifiedById: revisionRequestedBy?.id,
                        modifiedAt: revisionRequestedAt,
                     });
                  } else if (isUnassigned) {
                     // update the proposal created
                     migratedRes = await this.targetDb.proposalQueue.update(
                        { proposalStatusId: unassignedStatus?.id },
                        { where: { id: proposalCreated?.id } }
                     );

                     // create audit log row
                     await this.targetDb.auditLogs.create({
                        table: 'proposalQueue',
                        rowId: proposalCreated?.id,
                        originalValue: JSON.stringify(newStatus),
                        newValue: JSON.stringify(unassignedStatus),
                        modifiedById: null,
                        modifiedAt: currRow?.assignedAt,
                     });
                  }

                  return migratedRes;
               },
               false
            );

            result = await this.migrateTableData(
               'proposal_queue',
               'id',
               async (currRow: any) => {
                  // this will go to the proposalQueue & proposalQueueNotes & auditLogs notes table
                  let migratedRes = null;

                  const salesRep = await this.targetDb.users.findOne({ where: { oldId: currRow.sales_rep } });
                  // const lead = await this.targetDb.leads.findOne({ where: { oldId: currRow.lead } });
                  const lead = await this.targetDb.leads.findOne({
                     where: {
                        [Op.or]: [{ oldId: currRow?.lead }, { otherOldIds: { [Op.contains]: [currRow?.lead] } }],
                     },
                  });

                  const failedStatus = proposalStatusTypes.find((st: any) => st.name === 'Failed');
                  const unassignedStatus = proposalStatusTypes.find((st: any) => st.name === 'Unassigned');
                  const newStatus = proposalStatusTypes.find((st: any) => st.name === 'New'); // this is when a proposal is created

                  const dueAt =
                     currRow?.appointment_time && this.isProperDate(currRow?.appointment_time)
                        ? this.subtractTwentyFourHrs(currRow?.appointment_time)
                        : null;

                  // create a new proposal wiht "New" type...
                  // that means the proposal hasn't been inspected yet
                  // create the proposal
                  const proposalCreated = await this.targetDb.proposalQueue.create({
                     oldId: currRow.id,
                     ownerId: salesRep?.id,
                     dueAt: dueAt,
                     leadId: lead?.id,
                     proposalStatusId: newStatus?.id,
                     createdAt: this.isProperDate(currRow?.created_at) ? currRow?.created_at : new Date(),
                  });

                  if (currRow?.failed_at) {
                     // proposal updated with an failed status
                     migratedRes = await this.targetDb.proposalQueue.update(
                        { proposalStatusId: failedStatus?.id },
                        { where: { id: proposalCreated?.id } }
                     );

                     if (currRow?.failed_notes) {
                        // create notes for the failed proposal
                        await this.targetDb.proposalQueueNotes.create({
                           proposalQueueId: proposalCreated?.id,
                           notes: currRow?.failed_notes,
                        });
                     }

                     // create audit log row
                     await this.targetDb.auditLogs.create({
                        table: 'proposalQueue',
                        rowId: proposalCreated?.id,
                        originalValue: JSON.stringify(newStatus),
                        newValue: JSON.stringify(failedStatus),
                        modifiedById: salesRep?.id,
                        modifiedAt: this.isProperDate(currRow?.failed_at) ? currRow?.failed_at : new Date(),
                     });
                  } else if (currRow?.passed_inspection_at) {
                     // proposal updated with an unassigned status
                     migratedRes = await this.targetDb.proposalQueue.update(
                        { proposalStatusId: unassignedStatus?.id },
                        { where: { id: proposalCreated?.id } }
                     );

                     await this.targetDb.auditLogs.create({
                        table: 'proposalQueue',
                        rowId: proposalCreated?.id,
                        originalValue: JSON.stringify(newStatus),
                        newValue: JSON.stringify(unassignedStatus),
                        modifiedById: salesRep?.id,
                        modifiedAt: this.isProperDate(currRow?.passed_inspection_at)
                           ? currRow?.passed_inspection_at
                           : new Date(),
                     });
                  }

                  return migratedRes;
               },
               false
            );

            result = await this.migrateTableData(
               'revisions_requested',
               'id',
               async (currRow: any) => {
                  // this will go to the proposalQueueNotes & auditLogs table
                  let migratedRes = null;

                  const proposal = await this.targetDb.proposalQueue.findOne({ where: { oldId: currRow.proposal } });
                  if (!proposal) return;

                  // just save the other_details notes for now...
                  const noteToSave = JSON.parse(currRow?.content)?.other_details;
                  if (!noteToSave || !noteToSave?.length) return;

                  // create notes for the failed proposal
                  migratedRes = await this.targetDb.proposalQueueNotes.create({
                     proposalQueueId: proposal?.id,
                     notes: currRow?.failed_notes,
                  });

                  return migratedRes;
               },
               false
            );

            const doneMigrating = await this.getProposalMigrateStatus();
            if (doneMigrating) proposalDataMigrated = true;
            // proposalDataMigrated = true;
         }
      } catch (error) {
         console.log('error:', error);
         Logger.error(`Code 500: ${error}`);
         throw new LumError(500, 'Error while migrating lead products');
      }
   }

   private subtractTwentyFourHrs(d: any) {
      // Step 1: Convert the given date string into a Date object
      let givenDate = new Date(d);
      // Step 2: Subtract 24 hours (24 * 60 * 60 * 1000 milliseconds) from the given date
      let twentyFourHoursAgo = new Date(givenDate.getTime() - 24 * 60 * 60 * 1000);
      // Step 3: Format the new date as a string with the same format as the given date
      let formattedTimestamp = twentyFourHoursAgo.toISOString();

      return formattedTimestamp;
   }

   private async getLookupData() {
      const proposalStatusTypes = await this.targetDb.proposalStatusTypesLookup.findAll({});

      return { proposalStatusTypes };
   }

   private async proposalStatusTypesLookup() {
      // const result
      const alreadyInDb = await this.targetDb.proposalStatusTypesLookup.findOne({});
      if (alreadyInDb) return;

      const defaultTypes = [
         { name: 'New' }, // will be new, uninspected proposals
         { name: 'Revision' },
         { name: 'Failed' },
         { name: 'Unassigned' }, // will be new, passed inspected proposals
         // { name: 'Missing Information' },
         { name: 'Completed' },
         { name: 'In Progress' },
      ];
      const result = await this.targetDb.proposalStatusTypesLookup.bulkCreate(defaultTypes);

      if (result) Logger.info(`Migrated proposalStatusTypesLookup table`);
   }

   private async getProposalMigrateStatus() {
      const proposalTotalCount = await this.getRowCount('proposals').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const proposalMigratedCount = await this.getRowCount('proposals', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const proposalQueueTotalCount = await this.getRowCount('proposal_queue').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const proposalQueueMigratedCount = await this.getRowCount('proposal_queue', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );

      Logger.info(`Migrated ${proposalMigratedCount} proposal rows`);
      Logger.info(`Migrated ${proposalQueueMigratedCount} proposal_queue rows`);
      Logger.info(`Migrated ${proposalMigratedCount + proposalQueueMigratedCount} proposals`);
      if (proposalTotalCount > proposalMigratedCount) return false;
      if (proposalQueueTotalCount > proposalQueueMigratedCount) return false;

      const revisionsRequestedTotalCount = await this.getRowCount('revisions_requested').then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      const revisionsRequestedMigratedCount = await this.getRowCount('revisions_requested', true).then(
         (res) => JSON.parse(JSON.stringify(res))[0].count
      );
      Logger.info(`Migrated ${revisionsRequestedMigratedCount} proposal notes`);
      if (revisionsRequestedTotalCount > revisionsRequestedMigratedCount) return false;

      return true;
   }
}
