DropDown Component
This is a React component that implements a dropdown menu. It can be used to select one or more options from a list of options.

Props
The component accepts the following props:

label?: string: An optional label for the dropdown.
placeholder?: string: A placeholder text to be displayed when no option is selected.
selectedValues: Array<any>: An array of selected object(s) of options.
keyPath: string[]: An array of strings that represent the path to the value of the option object to be displayed.
options: Array<any>: An array of options to be displayed in the dropdown.
onOptionSelect: (e: any, arg: any) => void: A callback function that is called when an option is selected.
multiSelect?: boolean: A boolean value that indicates whether the dropdown supports multiple selections.
required?: boolean: A boolean value that indicates whether the dropdown is required.
className?: string: A string that represents the class name of the component.

```
import DropDown from './DropDown';

const options = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' },
];

const MyComponent = () => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleOptionSelect = (e, arg) => {
    setSelectedValues(arg.selectedValues);
  };

  return (
    <DropDown
      label="Select an option"
      placeholder="Select an option"
      selectedValues={selectedValues}
      keyPath={['name']}
      options={options}
      onOptionSelect={handleOptionSelect}
      multiSelect={false}
      required={true}
      className="my-custom-class"
    />
  );
};

```
