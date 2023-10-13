/**
 * This is an example of an automation action. It is not used in the app, but it is a good starting point for creating a new action.
 */
import React, { useState, useEffect } from 'react';
import Input from '@/common/components/input/Input';
import { AutomationActionProps, AutomationActionType } from './actions';

/**
 * This is the ActionProps interface. It is used in the Modal and Tile components.
 * @param <{T}> options These are the options that are saved to the database. They are passed to the Modal and Tile components.
 */
interface ActionProps
   extends AutomationActionProps<{
      exampleProp: string;
   }> {}

/**
 * This is the Modal component. It is shown when the user clicks on the action in the automation builder.
 * @param options These are initialized or recieved from the database
 * @param onData This function saves the options to the automation builder.
 * @returns React Component
 */
const Modal = ({ options, onData }: ActionProps) => {
   const [exampleProp, setExampleProp] = useState(options.exampleProp || '');

   useEffect(() => {
      onData({ exampleProp });
   }, [exampleProp]);

   return <Input label='Example Prop' value={exampleProp} onChange={(e) => setExampleProp(e.currentTarget.value)} />;
};

/**
 * This is the Tile component. It is shown in the automation builder.
 * @param options The options are passed from the Modal component onData({}) to the Tile component.
 * @returns React Component
 */
const Tile = ({ options }: ActionProps) => {
   return <div>{options.exampleProp}</div>;
};

/**
 * This is the action object. It is exported and used in features/components/automations/actions/index.tsx
 * @param type This is the type of action. It is used in the database.
 * @param name This is the name of the action. It is used in the database.
 * @param prettyName This is the pretty name of the action. It is shown in the automation builder.
 * @param description This is the description of the action. It is shown in the automation builder.
 * @param iconName This is the name of the icon to show in the automation builder.
 * @param Modal This is the Modal component.
 * @param Tile This is the Tile component.
 */
// @ts-ignore
export const actionExample: AutomationActionType = {
   types: ['workflow'],
   name: '',
   prettyName: '',
   description: '',
   iconName: '',
};
