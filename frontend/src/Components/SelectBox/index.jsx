import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
export default function SelectBox({ title, list }) {
    const [age, setAge] = React.useState('');
    const handleChange = (event) => {
        setAge(event.target.value);
    };
    const items = list?.map((e,Index) => {
        return <MenuItem key={Index} value={e}>{e}</MenuItem>;
    });
    return (
        <Box sx={{ minWidth: 120}} style={{direction:'rtl !important'}}>
        <FormControl fullWidth style={{direction:'rtl !important'}}>
          <InputLabel id="demo-simple-select-label" style={{direction:'rtl !important'}}>Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Age"
            onChange={handleChange}
            style={{direction:'rtl !important'}}
          >
            {items}
          </Select>
        </FormControl>
      </Box>
    );
}
