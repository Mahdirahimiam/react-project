import { useField } from "formik"

export default function CustomTextarea({label , ...props}) {
  
    
    const[field , meta] = useField(props);


    return (
        <div className="grid">
            <label>{label}</label>
            <textarea {...field} {...props} />

            {meta.touched && meta.error && <p>{meta.error}</p>}
        </div>
  )
}
