'use server';
import { ActionProps } from './actionData';
import { AutomationActionExecutionType, AutomationExecutionResult } from '../actionsServer';
interface ExecutionProps extends ActionProps, AutomationActionExecutionType {}

export const execute = async ({
   leadId,
   orderId,
   executorId,
   prevValue,
   newValue,
   options,
}: ExecutionProps): Promise<AutomationExecutionResult> => {
   const {} = options;

   try {
      // helper_functions: {
      // change_condition: (origin: any) => {
      // // reset all
      // let oldValueInputElement = document.querySelector('#condition-select-value');
      // if (oldValueInputElement) {
      //    oldValueInputElement.remove();
      // }

      // let inputFieldLabel = document.querySelector('#condition-select-input-field-label');
      // if (inputFieldLabel) {
      //    inputFieldLabel.remove();
      // }

      // let inputFieldChoice = document.querySelector('#condition-select-input-field');
      // if (inputFieldChoice) {
      //    inputFieldChoice.remove();
      // }

      // let taskLabel = document.querySelector('#condition-select-task-label');
      // if (taskLabel) {
      //    taskLabel.remove();
      // }

      // let taskChoice = document.querySelector('#condition-select-task');
      // if (taskChoice) {
      //    taskChoice.remove();
      // }

      // document.querySelector('#condition-value-label').style.display = 'block';

      // // then rebuild each
      // if (origin.value === 'stage') {
      //    document.querySelector(
      //       '#condition-relation'
      //    ).innerHTML = `<option value="equal">= (equal to)</option> <option value="not_equal">!= (not equal to)</option><option value="empty"> (empty)</option><option value="not_empty"> (not empty)</option>`;
      //    document
      //       .querySelector('#condition-select-value-previous-sibling')
      //       .insertAdjacentHTML(
      //          'afterend',
      //          `<select id="condition-select-value"><option value="">Loading...</option></select>`
      //       );

      //    let url = '/api/v1/ops/products/stages/';
      //    if (g.options.ops_limit_product != null) {
      //       url += '?product=' + g.options.ops_limit_product;
      //    }

      //    let selectElement = document.querySelector('#condition-select-value');
      //    apiCall((results) => {
      //       if (results.success) {
      //          selectElement.innerHTML = '';
      //          for (let r of results.message) {
      //             let value = r['id'];
      //             let text = r['name'];
      //             selectElement.innerHTML += `<option value="${value}">${text}</option>`;
      //          }
      //          if (!results.message || results.message.length < 1) {
      //             selectElement.innerHTML += `<option value="-1">No Stages found...</option>`;
      //          }
      //       } else {
      //          console.log(results);
      //       }
      //       selectElement.value = selectElement.dataset.futureValue;
      //       if (selectElement.value == '') {
      //          selectElement.value = selectElement.options[0].value;
      //       }
      //    }, url);
      // } else if (origin.value === 'field') {
      //    document.querySelector('#condition-relation').innerHTML = `
      //           <option value="equal">= (equal to)</option>
      //           <option value="not_equal">!= (not equal to)</option>
      //           <option value="less">< (less than)</option>
      //           <option value="greater">> (greater than)</option>
      //           <option value="empty"> (empty)</option>
      //           <option value="not_empty"> (not empty)</option>
      //           <option value="contains"> (contains)</option>
      //           <option value="does_not_contain"> (does not contain)</option>
      //           <option value="contained_in"> (contained in)</option>
      //           <option value="not_contained_in"> (not contained in)</option>
      //           `;
      //    document
      //       .querySelector('#condition-select-value-previous-sibling')
      //       .insertAdjacentHTML('afterend', `<input id="condition-select-value">`);
      //    document
      //       .querySelector('#condition-select')
      //       .insertAdjacentHTML(
      //          'afterend',
      //          `<label id="condition-select-input-field-label">Choose Input Field</label><select id="condition-select-input-field"><option value="">Loading...</option></select>`
      //       );

      //    let url = '/api/v1/ops/products/fields/';
      //    if (g.options.ops_limit_product != null) {
      //       url += '?product=' + g.options.ops_limit_product;
      //    }

      //    let selectElement = document.querySelector('#condition-select-input-field');
      //    apiCall((results) => {
      //       if (results.success) {
      //          selectElement.innerHTML = '';
      //          for (let r of results.message) {
      //             let value = r['id'];
      //             let text = r['name'];
      //             selectElement.innerHTML += `<option value="${value}">${text}</option>`;
      //          }
      //          // if (!results.message || results.message.length < 1) {
      //          //     selectElement.innerHTML += `<option value="-1">No Input Fields found...</option>`
      //          // }
      //       } else {
      //          console.log(results);
      //       }

      //       selectElement.innerHTML += `<option value="install_signed_date">Install Signed Date</option>`;

      //       selectElement.value = selectElement.dataset.futureValue;
      //       if (selectElement.value == '') {
      //          selectElement.value = selectElement.options[0].value;
      //       }
      //    }, url);
      // } else if (origin.value === 'task') {
      //    document.querySelector('#condition-value-label').style.display = 'none';
      //    document.querySelector(
      //       '#condition-relation'
      //    ).innerHTML = `<option value="complete"> (complete)</option><option value="not_complete"> (not complete)</option>`;
      //    document
      //       .querySelector('#condition-select')
      //       .insertAdjacentHTML(
      //          'afterend',
      //          `<label id="condition-select-task-label">Choose Task</label><select id="condition-select-task"><option value="">Loading...</option></select>`
      //       );

      //    let url = '/api/v1/ops/products/tasks/';
      //    if (g.options.ops_limit_product != null) {
      //       url += '?product=' + g.options.ops_limit_product;
      //    }

      //    let selectElement = document.querySelector('#condition-select-task');
      //    apiCall((results) => {
      //       if (results.success) {
      //          selectElement.innerHTML = '';
      //          for (let r of results.message) {
      //             let value = r['id'];
      //             let text = r['name'];
      //             selectElement.innerHTML += `<option value="${value}">${text}</option>`;
      //          }
      //          if (!results.message || results.message.length < 1) {
      //             selectElement.innerHTML += `<option value="-1">No Tasks found...</option>`;
      //          }
      //       } else {
      //          console.log(results);
      //       }
      //       selectElement.value = selectElement.dataset.futureValue;
      //       if (selectElement.value == '') {
      //          selectElement.value = selectElement.options[0].value;
      //       }
      //    }, url);
      // } else if (origin.value === 'install_date') {
      //    document
      //       .querySelector('#condition-select-value-previous-sibling')
      //       .insertAdjacentHTML('afterend', `<input id="condition-select-value">`);
      //    document.querySelector('#condition-relation').innerHTML = `
      //           <option value="less">< (less than)</option>
      //           <option value="greater">> (greater than)</option>
      //           <option value="empty"> (empty)</option>
      //           <option value="not_empty"> (not empty)</option>
      //           <option value="contains"> (contains)</option>
      //           <option value="does_not_contain"> (does not contain)</option>
      //       `;
      // } else if (origin.value === 'sales_team') {
      //    document.querySelector(
      //       '#condition-relation'
      //    ).innerHTML = `<option value="equal">= (equal to)</option> <option value="not_equal">!= (not equal to)</option>`;
      //    document
      //       .querySelector('#condition-select-value-previous-sibling')
      //       .insertAdjacentHTML(
      //          'afterend',
      //          `<select id="condition-select-value"><option value="">Loading...</option></select>`
      //       );

      //    let url = '/api/v1/ops/sales/team/leads/';

      //    let selectElement = document.querySelector('#condition-select-value');
      //    apiCall((results) => {
      //       if (results.success) {
      //          selectElement.innerHTML = '';
      //          for (let r of results.message) {
      //             let value = r['user_id'];
      //             let text = r['user_name'];
      //             selectElement.innerHTML += `<option value="${value}">${text}</option>`;
      //          }
      //          if (!results.message || results.message.length < 1) {
      //             selectElement.innerHTML += `<option value="-1">No Sales Team Leads found...</option>`;
      //          }
      //       } else {
      //          console.log(results);
      //       }
      //       selectElement.value = selectElement.dataset.futureValue;
      //       if (selectElement.value == '') {
      //          selectElement.value = selectElement.options[0].value;
      //       }
      //    }, url);

      //    // Copied from "field", allow checking of any value in the table of electrical company
      // } else if (origin.value === 'electrical_company') {
      //    document.querySelector('#condition-relation').innerHTML = `
      //           <option value="equal">= (equal to)</option>
      //           <option value="not_equal">!= (not equal to)</option>
      //           <option value="less">< (less than)</option>
      //           <option value="greater">> (greater than)</option>
      //           <option value="empty"> (empty)</option>
      //           <option value="not_empty"> (not empty)</option>
      //           <option value="contains"> (contains)</option>
      //           <option value="does_not_contain"> (does not contain)</option>
      //           <option value="contained_in"> (contained in)</option>
      //           <option value="not_contained_in"> (not contained in)</option>
      //           `;
      //    document
      //       .querySelector('#condition-select-value-previous-sibling')
      //       .insertAdjacentHTML('afterend', `<input id="condition-select-value">`);
      //    document
      //       .querySelector('#condition-select')
      //       .insertAdjacentHTML(
      //          'afterend',
      //          `<label id="condition-select-input-field-label">Choose Input Field</label><select id="condition-select-input-field"><option value="">Loading...</option></select>`
      //       );

      //    let url = '/api/v1/ops/products/fields/';
      //    if (g.options.ops_limit_product != null) {
      //       url += '?product=' + g.options.ops_limit_product;
      //    }

      //    let selectElement = document.querySelector('#condition-select-input-field');

      //    let electricalCompanyFields = [
      //       'id',
      //       'name',
      //       'connection_fee',
      //       'additional_cost',
      //       'state',
      //       'net_meter',
      //       'special_notes',
      //    ];
      //    let electricalCompanyFieldNames = [
      //       'ID',
      //       'Name',
      //       'Connection Fee',
      //       'Additional Cost',
      //       'State',
      //       'Net Meter',
      //       'Special Notes',
      //    ];

      //    selectElement.innerHTML = '';

      //    for (let i = 0; i < electricalCompanyFields.length; i++) {
      //       selectElement.innerHTML += `<option value="${electricalCompanyFields[i]}">${electricalCompanyFieldNames[i]}</option>`;
      //    }
      // }
      // },
      // },
      // options_onload: () => {
      // g.helpers['conditional']['change_condition']({
      //    value: 'stage',
      // });
      // }, // for setting up lists and such
      // options_gather: () => {
      // handle the actions list after this
      // g.tempActionDetails.afterSplitTarget = document.querySelector('#conditional-insert-action-where').value; // yes, no, delete

      // // actual values
      // let condition = document.querySelector('#condition-select');
      // // (All Conditions)
      // let equivBox = document.querySelector('#condition-relation');
      // let equivalence = document.querySelector('#condition-relation').value;

      // let valBox = document.querySelector('#condition-select-value');
      // let condition_value = '';
      // if (valBox) {
      //    condition_value = valBox.value;
      // }

      // // Selected Input Field
      // let inputFieldBox = document.querySelector('#condition-select-input-field');
      // let inputField = '';
      // if (inputFieldBox) inputField = inputFieldBox.value;

      // // Selected Task
      // let taskBox = document.querySelector('#condition-select-task');
      // let selected_task = '';
      // if (taskBox) selected_task = taskBox.value;

      // let input_or_electrical = condition == 'field' ? '(Input Field) ' : 'Electrical Company:'; // the 'electrical_company' option reuses the same box as 'field' but the user doens't know that. This makes it clear for the user what is going on

      // let pretty_condition = inputFieldBox
      //    ? input_or_electrical + inputFieldBox.options[inputFieldBox.selectedIndex].text
      //    : condition.options[condition.selectedIndex].text;
      // let pretty_equivalence = equivBox.options[equivBox.selectedIndex].text;
      // let pretty_condition_value = valBox
      //    ? valBox.options
      //       ? valBox.options[valBox.selectedIndex].text
      //       : valBox.value
      //    : '';

      // let value = {
      //    condition: condition.value,
      //    equivalence: equivalence,
      //    condition_value: condition_value,
      //    inputField: inputField,
      //    taskId: selected_task,
      //    flow_id: this_flow_id,
      // };
      // let pretty_value = `Is ${pretty_condition} ${pretty_equivalence} ${pretty_condition_value}?`;
      // if (taskBox)
      //    pretty_value = `Is ${pretty_condition}: ${taskBox.options[taskBox.selectedIndex].text
      //       } ${pretty_equivalence}?`;
      // return [value, pretty_value];
      // },
      // options_spread: (old_value) => {
      // try {
      //    old_value = JSON.parse(old_value);
      // } catch (error) {
      //    /* no error, might accidentally be JSON.stringify-ed */
      // }
      // document.querySelector('#condition-select').value = old_value.condition;
      // g.helpers['conditional']['change_condition']({
      //    value: old_value.condition,
      // });

      // document.querySelector('#condition-relation').value = old_value.equivalence;
      // if (document.querySelector('#condition-select-value')) {
      //    document.querySelector('#condition-select-value').value = old_value.condition_value;
      //    document.querySelector('#condition-select-value').dataset.futureValue = old_value.condition_value;
      // }
      // if (document.querySelector('#condition-select-input-field')) {
      //    document.querySelector('#condition-select-input-field').value = old_value.inputField;
      //    document.querySelector('#condition-select-input-field').dataset.futureValue = old_value.inputField;
      // }
      // if (document.querySelector('#condition-select-task')) {
      //    document.querySelector('#condition-select-task').dataset.futureValue = old_value.taskId;
      // }

      // // this function gets called when an action is edited, but not when a new action is created, so we can hide the section here
      // document.querySelector('#condition-insert-point').style.display = 'none';
      // },

      return {
         success: true,
         message: ``,
         results: null,
      };
   } catch (error: any) {
      return {
         success: false,
         message: `Error`,
         results: error.message,
         status: 'Failed',
      };
   }
};
