import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { TextField, Button, Stack, Box, Typography, Checkbox, FormControlLabel, colors } from '@mui/material';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import style from './style.css'
const validationSchema = Yup.object().shape({
  email: Yup.string().email('ایمیل نا معتبر').required('ایمیل خود را وارد کنید'),
  password: Yup.string().required('پسورد خود را وارد کنید'),
});

const Login = ({props}) => {
  const Navigate = useNavigate()
  const [show,setShow] = useState(props)
  const handleShow = ()=>{
    setShow(false)
  }
  const handleSubmit = (values) => {
    // اینجا می‌توانید داده‌های فرم را به سرور ارسال کنید یا عملیات مورد نظر خود را انجام دهید
    console.log(values);
  };

  return (
    <Box overflow={'hidden'} visibility={show?'visible':'hidden'}>
    <Box onClick={()=>{handleShow()}} sx={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: '110' }}></Box>
    <Stack sx={{ direction: 'ltr', width: '300px', position: 'fixed', top: '30%', left: '50%', zIndex: '111', backgroundColor: '#fff', border: '1px black solid', borderRadius: '10px', alignItems: 'center', justifyContent: 'center', gap: '10px', transform: 'translate(-50%,-50%)' }}>
      <Stack borderBottom={'1px gray solid'} p={1} justifyContent={'space-between'} alignItems={'center'} width={'100%'} direction={'row'}>
        <box-icon onClick={()=>{handleShow()}} name='x'></box-icon>
        <Typography fontSize={'1.2rem'}>ورود</Typography>
      </Stack>
      <Stack sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={()=>{Navigate('/login-register') ;handleShow()}} sx={{ color: '#fff !important', width: '90%' }} type="" color='success' variant="contained" >
          عضویت در سایت
        </Button>
      </Stack>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form  style={{width:'100%'}}>
            <Box sx={{ margin:'0 15px' }}>
              <Field
                as={TextField}
                name="email"
                label="ایمیل"
                variant="outlined"
                margin="normal"
                fullWidth
                error={errors.email && touched.email}
                helperText={errors.email && touched.email ? errors.email : ''}
                style={{width:'100%'}}
              />
            </Box>
            <Box sx={{margin:'0 15px'}}>
              <Field
                as={TextField}
                name="password"
                label="پسورد"
                type="password"
                variant="outlined"
                margin="normal"
                fullWidth
                error={errors.password && touched.password}
                helperText={errors.password && touched.password ? errors.password : ''}
              />
            </Box>
            <Stack py={1} borderBottom={'1px gray solid'} alignItems={'center'} justifyContent={'center'} width={'100%'}>
              <Stack px={2} width={'100%'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} sx={{ direction: 'rtl' }}>
                <FormControlLabel sx={{ marginRight: '0' }} control={<Checkbox defaultChecked />} label="مرا به خاطر بسپار" />
                <Button sx={{padding: '2px', marginLeft: '15px',backgroundColor:'#ebebeb'}} type=""  variant="contained" >
                  بازیابی رمز
                </Button>
              </Stack>
            </Stack>
            <Stack  py={.6} px={2} direction={'row'} alignItems={'center'} justifyContent={'space-between'} width={'100%'}>
              <Button style={{ margin: '5px 5px' }} type="submit" variant="contained" sx={{ backgroundColor: "#ebebeb"}}>
                لغو
              </Button>

              <Button sx={{ margin: '5px 5px',color:'#fff !important'}} type="submit" variant="contained" color="success">
                ورود<box-icon color='#fff' name='log-in'></box-icon>
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

    </Stack>
    </Box>
  );
};

export default Login;
