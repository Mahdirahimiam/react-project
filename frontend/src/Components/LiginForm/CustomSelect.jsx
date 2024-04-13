import { useField } from "formik"

export default function CustomSelect({label, classname, ...props}) {
  
    
    const[field , meta] = useField(props);


    return (
        <div className={classname}>
            <label>{label}</label>
            <select {...field} {...props} />

            {meta.touched && meta.error && <p>{meta.error}</p>}
        </div>
  )
}
