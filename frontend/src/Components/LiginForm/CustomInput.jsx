import { useField } from "formik";
import { FaInfoCircle } from "react-icons/fa";

export default function CustomInput({label , icon = false , information , ...props}) {
  
    
    const[field , meta] = useField(props);
  
    return (
    <div>
      <div className="grid">
      <div className="flex">
          <label>{label}</label>

            {icon && <span className="info">{<FaInfoCircle color="#f43d3d" />}</span>}
          </div>
        <div className="flex">
        <input {...field} {...props} />

        </div>
        {information && <p className="information">{information}</p>}
          
      </div>

        {meta.touched && meta.error && <p className="error">{meta.error}</p>}
    </div>
  )
}
