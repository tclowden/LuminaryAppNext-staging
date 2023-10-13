'use client';
import React from 'react';
import { fillColorObject } from '../../utilities/colors/colorObjects';
import { LuminaryColors } from '../types/LuminaryColors';
import * as icons from './icons';

export type IconColors = LuminaryColors | `${string}:${number}`;

type Props = {
   name: string;
   color?: IconColors;
};

const Icon = ({ name, color, ...rest }: React.SVGProps<SVGSVGElement> & Props): JSX.Element | any => {
   const iconColorClasses = fillColorObject[color as keyof object];

   if (icons && icons[name as keyof object])
      return React.createElement(icons[name as keyof object], {
         className: `
            ${iconColorClasses}
         `,
         ...rest,
      });
   return null;
};

export default Icon;
