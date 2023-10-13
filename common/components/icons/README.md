# Icons

-  <b style="color:red">DO NOT MANUALLY ADD A COMPONENT INTO THIS FOLDER!</b>

### How To Create An Icon Component

-  Add svg to directory `public/assets/icons`
-  Delete all `fill` attributes from the svg
-  Run command `npm run build:svg`
-  DONE! Should see a component in this folder representing the icon you added.

### How To Use The Icon Component

-  Import the `<Icon />` component from `common/components/icon`
-  The `<Icon />` component has a property `name`... You it to call the icon you want... Example below
   -  `<Icon name="ChevronDown" />`
-  If you want to change the styles of it... just use the `style` or `className` prop. Example below
   -  `<Icon name="LeadSources" className="fill-lum-gray-600 w-[60px] h-[60px]" />`
