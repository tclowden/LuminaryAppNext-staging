import { NextRequest, NextResponse } from 'next/server';
import { LumError } from '@/utilities/models/LumError';
import db from '@/sequelize/models';
async function createNewProposalOption(request: NextRequest, options: { params: { id: string } }) {
   try {
      const { id } = options.params;
      if (!id) throw new LumError(400, `Invalid Id in params.`);

      const reqBody = await request.json();

      console.log('request body', reqBody);

      const leadResults = await db.proposalQueue.update(
         { proposalStatus: reqBody.proposalStatusId },
         {
            where: {
               id: id,
            },
         }
      );

      return NextResponse.json({ success: true, leadResults }, { status: 200 });
   } catch (error) {
      console.log(error);
   }

   return NextResponse.json({ success: false }, { status: 500 });
}

export { createNewProposalOption as GET };

// Set someone up on the proposal queue
async function addProposalOptionToQueue(request: NextRequest) {
   console.log(request);

   // See if status of a lead is Appointment scheduled
   // then if htey are, add to proposalQueue

   /* Here's a peek at the old php code
    // Create the due date for proposal queue
    seems like we're trying to make sure the scheduled pitch, and junior engineer set are different. Maybe not applicable.
    if ($lead_data[0]['status_name'] != "Scheduled Pitch" && $lead_data[0]['status_name'] != 'Junior Engineer Set') {


    // Create the due date for proposal queue
      $day_before = date('Y-m-d', strtotime($input['appointment_date']));
      $proposal_due = $day_before . 'T' . $input['appointment_time'];

      // Check to see if a proposal already exists
      $has_proposals = $api->Crud->read('SELECT * FROM proposals WHERE lead = ?', array($input['lead_id']));

      if (empty($has_proposals)) {
         $api->Crud->change('INSERT INTO proposal_queue (lead, sales_rep, appointment_time) VALUES (?, ?, ?)', array($input['lead_id'], $lead_data[0]['owner'], $proposal_due));
      } else {
         $api->Crud->change('UPDATE proposals SET owner = ?, proposal_due = ?, completed = 0, disqualified = 0 WHERE proposal_id = ?', array($lead_data[0]['owner'], $proposal_due, $has_proposals[0]['proposal_id']));
      }

    */

   return NextResponse.json({ success: true }, { status: 200 });
}
export { addProposalOptionToQueue as POST };
