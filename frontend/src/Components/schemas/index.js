import * as yup from "yup";

const english = /^[a-zA-Z]*$/;
const persian = /^[\u0600-\u06FF\s]+$/;
const phoneNumber = /(\+?98|098|0|0098)?(9\d{9})/;

export const basicSchema = yup.object().shape({
    username: yup.string().matches(english , {message: "نام كاربری انتخابی شما ، شامل كاراكترهای غیر معتبر است."}),
    fullname: yup.string().matches(persian , {message: "نام كاربری انتخابی شما ، شامل كاراكترهای غیر معتبر است."}),
    phone: yup.number(),
    email: yup.string().email("لطفاً ایمیل را به شکل صحیح وارد کنید"),
    password: yup.string().min(5 , ""),
    confirmPassword: yup.string().oneOf([yup.ref('password') , null] , ""),
    state: yup.string(),
    city: yup.string(),
    address: yup.string(),
    postalcode: yup.number("لطفاً کد پستی را به شکل صحیح وارد کنید").positive().integer(),
    captcha: yup.string()
});

