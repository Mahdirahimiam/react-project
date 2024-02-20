import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
function Formik() {
  const validationSchema = yup.object({
    userName: yup.string().required('required'),
    password: yup.string().required('required')
  })
  const Formik = useFormik({
    initialValues: {
      userName: '',
      password: ''
    },
    onSubmit: (values) => {
      console.log(values);
    },
    // validate:(values)=>{
    //   const errors={}
    //   if(!values.userName){
    //     errors.userName='required'
    //   }
    //   if(!values.password){
    //     errors.password='required'
    //   }
    //   return errors
    // }
    validationSchema
  })
  console.log(Formik.touched);
  return (
    <form onSubmit={Formik.handleSubmit}>
      <label htmlFor="userName">username</label>
      <input onBlur={Formik.handleBlur}
        id='userName'
        type='text' value={Formik.values.userName} onChange={Formik.handleChange} name='userName' />
      {Formik.errors.userName && Formik.touched.userName && <div className='error'>{Formik.errors.userName}</div>}
      <label htmlFor="password">password</label>
      <input {...Formik.getFieldProps('password')} id='password' type='password' name='password' />
      {Formik.errors.password && Formik.touched.password && <div className='error'>{Formik.errors.password}</div>}
      <button type='submit'>submit</button>
    </form>
  )
}

export default Formik