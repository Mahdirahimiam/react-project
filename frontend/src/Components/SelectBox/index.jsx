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
        <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{width:'100%',border:'1px solid #dadada',borderRadius:'10px',height:'35px'}}>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={age}
                    label="Age"
                    onChange={handleChange}
                >
                <InputLabel id="demo-simple-select-label">{title}</InputLabel>
                {items}
                </Select>
            </FormControl>
        </Box>
    );
}
