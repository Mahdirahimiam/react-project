import React, { useContext, useState } from 'react';
import { Formik, Form } from "formik";
import CustomInput from "./CustomInput";
import { basicSchema } from "../schemas";
import CustomSelect from "./CustomSelect";
import CustomTextarea from "./CustomTextarea";
import { Cities } from "../constants/CitiesData";
import { FaInfoCircle } from "react-icons/fa";
import Captcha from "./Captcha";
import 'react-toastify/ReactToastify.css';
import Toast from '../Toast';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../Utils/authContext';

export default function Forms() {
  const [state, setState] = useState("");
  const [cities, setCities] = useState([]);
  const [captcha, setCaptcha] = useState(Math.random().toString(36).slice(8));
  const [showElement, setShowElement] = useState(false);
  const [toast, setToast] = useState({ type: 'info', message: '',ran:Math.random() })
  const handleToken = useContext(AuthContext)
  async function onSubmit(values, { setSubmitting, resetForm }) {
    if (
      values.username.trim() === ""  ||    values.fullname.trim() === ""  ||    values.phone.trim() === ""  ||    values.password.trim() === ""
    ) {
      setShowElement(true);
      return;
    }
    if (captcha !== values.captcha) {
      setToast({ type: 'error', message: "کد امنیتی صحیح نمی باشد!" })
      return;
    }

    try {
      setSubmitting(true);
      fetch(process.env.REACT_APP_BASE_URL + "/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          fullName: values.fullname,
          password: values.password,
          email: values.email,
          phone: values.phone,
          state: values.state,
          city: values.cities,
          postCode: values.postalcode,
          address: values.address,
          role: ""
        }),
      }).then(res=>{res.json()})
      .then((data=>{
        console.log(data)
        setToast({ type: 'success', message: "ثبت نام با موفقیت انجام شد!" })
        resetForm();
        Navigate('/');
      }))
      }
    

     
    catch (error) {
      console.error("Error:", error);
      setToast({ type: 'error', message: "مشکلی در ثبت نام شما وجود دارد. لطفا بعدا دوباره امتحان کنید!" })
    } finally {
      setSubmitting(false);
    }
  }

  return (<>
    <Toast type={toast.type} message={toast.message} ran={toast.ran}/>
    <div className="container">
      {showElement && (
        <div className="alert-shown">
          <FaInfoCircle color="#f43d3d" />
          <p>لطفا گزینه های ضروری را تکمیل کنید</p>
        </div>
      )}

      <h1>ثبت نام</h1>

      <Formik
        initialValues={{
          username: "",
          fullname: "",
          phone: "",
          email: "",
          password: "",
          confirmPassword: "",
          state: "",
          cities: [],
          address: "",
          postalcode: "",
          captcha: "",
        }}
        validationSchema={basicSchema}
        onSubmit={onSubmit}
      >
        {(props) => (
          <Form>
            {captcha !== props.values.captcha && props.values.captcha !== "" && (
              <div className="alert-shown">
                <FaInfoCircle color="#f43d3d" />
                <p>لطفا کد امنیتی را درست وارد نمایید</p>
              </div>
            )}

            <CustomInput label="نام کاربری" icon={true} name="username" type="text" information="فقط استفاده از حروف انگلیسی مجاز است." />
            <hr className="hr" />

            <CustomInput label="نام و نام خانوادگی" icon={true} name="fullname" type="text" information="لطفا نام و نام خانوادگی را بصورت کامل و به فارسی وارد کنید." />
            <hr className="hr" />

            <CustomInput label="شماره موبایل" name="phone" icon={true} type="tel" />
            <hr className="hr" />

            <CustomInput label="آدرس ایمیل" name="email" type="email" />
            <hr className="hr" />

            <CustomInput label="کلمه عبور" name="password" icon={true} type="password" />
            {/\d/.test(props.values.password) || props.values.password.length >= 8 ? (
              <p className="passwordError" style={{ color: "green" }}>
                امن
              </p>
            ) : (
              <p className="passwordError" style={{ color: "red" }}>
                ناامن
              </p>
            )}
            <hr className="hr" />
            <CustomInput label="تکرار رمز عبور" name="confirmPassword" icon={true} type="password" />
            <hr className="hr" />

            <div className="select_container">
              <CustomSelect
                value={props.values.state}
                onChange={(e) => {
                  setState(e.target.value);
                  setCities(Cities.find((city) => city.name === e.target.value).cities);
                  setShowElement(false);
                  props.setFieldValue("state", e.target.value);
                }}
                name="state"
                label="استان و شهر"
                classname="select_item"
              >
                <option>-انتخاب استان-</option>
                {Cities.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </CustomSelect>

              <CustomSelect
                value={props.values.cities}
                name="cities"
                className="select_city"
                onChange={(e) => {
                  props.setFieldValue("cities", e.target.value);
                  setShowElement(false);
                }}
              >
                <option>-انتخاب شهر-</option>
                {state &&
                  Cities.find((city) => city.name === state).cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
              </CustomSelect>
            </div>
            <hr className="hr" />

            <CustomTextarea name="address" label="نشانی"></CustomTextarea>
            <hr className="hr" />

            <CustomInput label="کد پستی" name="postalcode" type="text" />
            <hr className="hr" />

            <Captcha name="captcha" type="text" label="کد مقابل را وارد کنید" captcha={captcha} oncaptcha={setCaptcha} />
            <hr className="hr" />
            <button className="button-login" type="submit">
              تکمیل ثبت نام
            </button>

            {props.values.password !== props.values.confirmPassword && (
              <div className="error_container">
                <h3>خطا!!</h3>
                <p>کلمه رمزهای وارد شده شبیه هم نیستند</p>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  </>
  );
}