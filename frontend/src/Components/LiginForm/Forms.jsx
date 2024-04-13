import { Field, Formik, Form } from "formik";
import CustomInput from "./CustomInput";
import { basicSchema } from "../schemas/index";
import CustomSelect from "./CustomSelect";
import CustomTextarea from "./CustomTextarea";
import { Cities } from "../constants/CitiesData";
import { useEffect, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import Captcha from "./Captcha";
import './style.css'
export default function Forms() {
  const [state, setState] = useState("");
  const [cities, setCities] = useState([]);
  const randomString = Math.random().toString(36).slice(8);
  const [captcha, setCaptcha] = useState(randomString);
  const [showElement, setShowElement] = useState(false);
  async function onSubmit(values, action) {
    if (values.username || values.fullname || values.phone || values.password === "") {
      setShowElement(true);}
    if (captcha == values.captcha) {
      await new Promise(res => setTimeout(res, 1000));
      action.resetForm();}}
  return (
    <div className="container">
      {showElement && <div className={`${showElement && 'alert-shown'}`}>{<FaInfoCircle color="#f43d3d" />}<p>لطفا گزینه های ضروری را تکمیل کنید </p></div>}
      <h1>ثبت نام</h1>
      <Formik initialValues={{
        username: "",
        fullname: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
        state: "",
        city: "",
        address: "",
        postalcode: "",
        captcha: "",}}
        validationSchema={basicSchema}
        onSubmit={onSubmit}>
        {(props) => (
          <Form>
            {captcha !== props.values.captcha && props.values.captcha !== "" && <div className='alert-shown'>{<FaInfoCircle color="#f43d3d" />}<p>لطفا کد امنیتی را درست وارد نمایید</p></div>}{
              useEffect(() => {
                setState(props.values.state);
                setCities(Cities.find((city) => city.name === props.values.state));
                setShowElement(false);
              }, [props.values])}
            <CustomInput label="نام کاربری" icon={true} name="username" type="text" information="فقط استفاده از حروف انگلیسی مجاز است." />
            <hr />
            <CustomInput label="نام و نام خانوادگی" icon={true} name="fullname" type="text" information="لطفا نام و نام خانوادگی را بصورت کامل و به فارسی وارد کنید." />
            <hr />
            <CustomInput label="شماره موبایل" name="phone" icon={true} type="tel" />
            <hr />
            <CustomInput label="آدرس ایمیل" name="email" type="email" />
            <hr />
            <CustomInput label="کلمه عبور" name="password" icon={true} type="password" />
            {/\d/.test(props.values.password) || props.values.password.length >= 8 ? (<p className="passwordError" style={{ color: "green" }}>امن</p>) : null}
            {props.values.password !== "" && props.values.password.length < 8 && <p className="passwordError" style={{ color: "red" }}>ناامن</p>}
            <hr />
            <CustomInput label="تکرار رمز عبور" name="confirmPassword" icon={true} type="password" />
            <hr />
            <div className="select_container">
              <CustomSelect name="state" label="استان و شهر" classname="select_item">
                <option>-انتخاب استان-</option>
                {Cities.map((state) =>
                  <option key={state.name} value={state.name}>{state.name}
                  </option>)}
              </CustomSelect>
              <CustomSelect name="city" className="select_city">
                <option>-انتخاب شهر-</option>{
                  state && cities.cities.map((city) =>
                    <option key={city.name} value={city.name}>{city.name}</option> )}
              </CustomSelect>
            </div>
            <hr />
            <CustomTextarea name="address" label="نشانی">
            </CustomTextarea>
            <hr />
            <CustomInput label="کد پستی" name="postalcode" type="text" />
            <hr />
            <Captcha name="captcha" type="text" label="کد مقابل را وارد کنید" captcha={captcha} oncaptcha={setCaptcha} />
            <hr />
            <button type="submit">تکمیل ثبت نام</button>
            {props.values.password !== props.values.confirmPassword &&
              <div className="error_container">
                <h3>خطا!!</h3>
                <p>کلمه رمزهای وارد شده شبیه هم نیستند</p>
              </div>}
          </Form>)}
      </Formik>
    </div>
  )
}

