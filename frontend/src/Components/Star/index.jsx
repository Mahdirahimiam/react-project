import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

export default function BasicRating({rate}) {
  const [value, setValue] = React.useState(rate);
  return (
    <Box
      sx={{
        '& > legend': { mt: 2 },
        direction:'ltr !important'
      }}
    >
      <Rating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
}
