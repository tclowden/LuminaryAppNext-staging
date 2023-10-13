// interface Action {
//    name: string;
//    execute: () => Promise<void>;
// }

// class Workflow {
//    private actions: Action[] = [];

//    constructor() {}

//    addAction(action: Action) {
//       this.actions.push(action);
//    }

//    async execute() {
//       for (const action of this.actions) {
//          try {
//             console.log(`Executing action: ${action.name}`);
//             await action.execute();
//             console.log(`Action ${action.name} executed successfully`);
//          } catch (error) {
//             console.error(`Error executing action ${action.name}: ${error}`);
//          }
//       }
//    }
// }

// // Example usage:

// const action1: Action = {
//    name: 'Action 1',
//    execute: async () => {
//       // Implement your action logic here
//       console.log('Action 1 executed');
//    },
// };

// const action2: Action = {
//    name: 'Action 2',
//    execute: async () => {
//       // Implement your action logic here
//       console.log('Action 2 executed');
//    },
// };

// const myWorkflow = new Workflow();
// myWorkflow.addAction(action1);
// myWorkflow.addAction(action2);

// myWorkflow.execute().then(() => {
//    console.log('Workflow completed');
// });
export {};
