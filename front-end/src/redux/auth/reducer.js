import {
   USER_LOGOUT, USER_LOGIN_SUCCESSFUL,
   GUEST_SEND_PHONE, GUEST_SEND_PHONE_SUCCESSFUL, GUEST_SEND_OTP_SUCCESSFUL, GUEST_REGISTER_SUCCESSFUL, RESET_STEP_REGISTER,
   FORGOT_PASSWORD_SEND_PHONE_SUCCESSFUL, FORGOT_PASSWORD_SET_STEP, FORGOT_PASSWORD_CANCEL_REQUEST_SUCCESSFUL, 
   FORGOT_PASSWORD_RESET_PASSWORD_SUCCESSFUL, FORGOT_PASSWORD_SEND_OTP_SUCCESSFUL, SAVE_TIME_OUT_OTP
} from "./action";

import _ from "lodash"

const initialState = {
   isLoggedIn: false,
   token: '',

   otpID: null,        //request ID for each OTP code
   stepRecoverPassword: 0,
   isResetPasswordSuccess: false,
   savedTimeOut : 0,

   // Register State
   stepRegister: 0,
   phoneNumber: 0,
   fullName: '',
   dob: '',          //convert to Date types on React
   gender: '',
   isRegisterSuccess: false
}

export const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case USER_LOGOUT: {
         let newState = { ...state, isLoggedIn: false, token: '' }
         return newState;
      }
      case USER_LOGIN_SUCCESSFUL: {
         let newState = { ...state, isLoggedIn: true, token: action?.token }
         return newState;
      }

      //================== CASE: Recovery Password ==================
      case FORGOT_PASSWORD_SEND_PHONE_SUCCESSFUL: {
         let newState = { ...state, otpID: action?.requestID, stepRecoverPassword: 1, isResetPasswordSuccess: false }
         return newState;
      }
      case FORGOT_PASSWORD_SEND_OTP_SUCCESSFUL: {
         let newState = { ...state, stepRecoverPassword: 2 }
         return newState;
      }
      case FORGOT_PASSWORD_RESET_PASSWORD_SUCCESSFUL: {
         let newState = { ...state, isResetPasswordSuccess: true }
         return newState;
      }
      case FORGOT_PASSWORD_CANCEL_REQUEST_SUCCESSFUL: {
         let newState = { ...state, otpID: null, stepRecoverPassword: 0, isResetPasswordSuccess: false }
         return newState;
      }
      case FORGOT_PASSWORD_SET_STEP: {
         let newState;
         if (action?.step === 0)
            newState = { ...state, otpID: null, stepRecoverPassword: 0, isResetPasswordSuccess: false, savedTimeOut: 0 };
         else
            newState = { ...state, stepRecoverPassword: action?.step };
         return newState;
      }
      case SAVE_TIME_OUT_OTP: {
         let newState = { ...state, savedTimeOut: action?.time }
         return newState;
      }
      //================== CASE: REGISTER ==================
      case GUEST_SEND_PHONE: {
         let newState = { ...state, isRegisterSuccess: false }
         return newState;
      }
      case GUEST_SEND_PHONE_SUCCESSFUL: {
         let newState = {
            ...state,
            stepRegister: 1,
            phoneNumber: action?.phoneNumber,
            fullName: action?.fullName,
            dob: action?.dob,
            gender: action?.gender,
            otpID: action?.requestID
         }
         return newState;
      }
      case GUEST_SEND_OTP_SUCCESSFUL: {
         let newState = { ...state, stepRegister: 2, stepRecoverPassword: 2 }
         return newState;
      }
      case GUEST_REGISTER_SUCCESSFUL: {
         let newState = { ...state, otpID: null, phoneNumber: 0, stepRecoverPassword: 0, isRegisterSuccess: true }
         return newState;
      }
      case RESET_STEP_REGISTER: {
         let newState
         if (action?.step === 0)
            newState = { ...state, stepRegister: 0, otpID: null, phoneNumber: 0, isRegisterSuccess: false, savedTimeOut: 0 };
         else
            newState = { ...state, stepRegister: action?.stepRegister, otpID: null, phoneNumber: 0, isRegisterSuccess: false };
         return newState;
      }
      default: {
         return state;
      }
   }
}
