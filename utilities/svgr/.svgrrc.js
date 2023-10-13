module.exports = {
   typescript: true,
   // dimensions: false,
   // replaceAttrValues: {
   //    white: '{props.color || `#FFFFFF`}',
   //    '#FFFFFF': '{props.color || `#FFFFFF`}',
   //    black: '{props.color || `#000000`}',
   //    '#111111': '{props.color || `#000000`}',
   //    '#000': '{props.color || `#000000`}',
   //    '#eee': '{props.color || `#eee`}',
   //    '#7D8D9A': '{props.color || `#7D8D9A`}',
   // },
   ref: true,
   svgProps: {
      width: '{props.width || "100%"}',
      height: '{props.height || "100%"}',
   },
};
