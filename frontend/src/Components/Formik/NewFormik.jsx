import React from 'react'
import { Formik,Form,Field,ErrorMessage } from 'formik'
import * as yup from 'yup'
function newFormik() {
    const initialValues={
        name:'',
        password:''
    }
    const onSubmit=(values)=>{
        console.log(values);
    }
    const validationSchema=yup.object({
        name:yup.string().required('required'),
        password:yup.string().required('required!')
    })
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form >
            <label htmlFor="name"></label>
            <Field type='text' id="name" name="name"></Field>
            <ErrorMessage name='name'></ErrorMessage>
        </Form>
    </Formik>
  )
}

export default newFormik