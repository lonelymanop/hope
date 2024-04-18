import { useNavigation } from "@react-navigation/native";
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as yup from 'yup';
import actions from '../redux/actions';
import FlashMessage from 'react-native-flash-message';
import { showMessage } from 'react-native-flash-message';

const schema = yup.object().shape({
  emailOrPhone: yup
    .string()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
      'Invalid email or phone number format'
    )
    .required('Email or Phone Number is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters long'),
});

export default function Login() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    try {
      // await schema.validate(formData, { abortEarly: false });
      const { email, password } = formData;
      const res = await actions.login({ email, password });
      console.log("Login successful:", res.data);
      showMessage({
        message: 'Login successful',
        type: 'success',
      });
      // Navigate to the desired screen after successful login
    } catch (err) {
      if (err.message === 'Invalid email or phone number format') {
        showMessage({
          message: 'Please enter a valid email or phone number',
          type: 'danger',
        });
      } else if (err.message === 'Email or Phone Number is required') {
        showMessage({
          message: 'Email or Phone Number is required',
          type: 'danger',
        });
      } else if (err.message === 'Password is required') {
        showMessage({
          message: 'Password is required',
          type: 'danger',
        });
      } else if (err.message === 'Password must be at least 6 characters long') {
        showMessage({
          message: 'Password must be at least 6 characters long',
          type: 'danger',
        });
      } else {
        showMessage({
          message: 'Invalid email or phone number or password',
          type: 'danger',
        });
      }
    }
  };

  return (
    <View className="flex-1  justify-center items-center bg-gray-100 px-4">
       <Text className="text-4xl font-bold mb-8 text-teal-500">Wareozo</Text>

      <View className="w-full mb-6">
        <TextInput
          className="bg-white rounded-lg px-4 py-3 w-full shadow-md"
          placeholder="Email or Phone Number"
          keyboardType="default"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
        />
      </View>

      <View className="w-full mb-6">
        <TextInput
          className="bg-white rounded-lg px-4 py-3 w-full "
          placeholder="Password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
        />
      </View>

      <View className="w-full mb-4 flex-row items-center justify-end">
        <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
          <Text className="text-teal-500 font-semibold">Forgotten Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-teal-500 rounded-lg px-4 py-3 w-full shadow-md mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity  onPress={() => navigation.navigate('Loginotp')}>
        <Text className="text-teal-500 font-semibold">
          Login with OTP
        </Text>
      </TouchableOpacity>

      <View className="flex flex-row justify-between items-center p-6">
        <View className="w-1/2 pr-5">
          <TouchableOpacity
            className="flex flex-row items-center justify-center p-3 rounded-[16px] bg-white shadow-md"
            onPress={() => console.log('Google button pressed')}
          >
            <Image
              source={require('../../assets/images/googleicon.png')}
              resizeMode="cover"
              className="w-6 h-6 mr-2"
            />
            <Text className="text-sm font-semibold text-black">Google</Text>
          </TouchableOpacity>
        </View>
        <View className="w-1/2 pl-5">
          <TouchableOpacity
            className="flex flex-row items-center justify-center p-3 rounded-[16px] bg-white shadow-md"
            onPress={() => console.log('Microsoft button pressed')}
          >
            <Image
              source={require('../../assets/images/microsoft.png')}
              resizeMode="cover"
              className="w-6 h-6 mr-2"
            />
            <Text className="text-sm font-semibold text-black">Microsoft</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mt-4">
        Don't have an account!{' '}
        <Text
          className="text-teal-500 font-semibold"
          onPress={() => navigation.navigate('Register1')}
        >
          Sign up now
        </Text>
      </Text>
      <FlashMessage position="center" />
    </View>
  );
}



///ForgetPassword


import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as yup from 'yup';
import actions from '../redux/actions';
import Toast from 'react-native-toast-message';

const emailSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
});

const resetPasswordSchema = yup.object().shape({
  email: yup.string().email('Invalid email format').required('Email is required'),
  oldPassword: yup.string().required('Current password is required'),
  newPassword: yup.string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: yup.string()
    .required('Confirm password is required')
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

export default function ForgottenPassword({ navigation }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showResetPasswordFields, setShowResetPasswordFields] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetPasswordError, setResetPasswordError] = useState({});

  const handleForgottenPassword = async () => {
    try {
      await emailSchema.validate({ email }, { abortEarly: false });
      try {
        const res = await actions.ForgotPassword({ email });
        console.log("Forgot Password Response ==>>>>>", res);
        Toast.show({
          type: 'success',
          text1: 'Password reset email sent',
          text2: 'Please check your email for instructions to reset your password',
        });
        setFormData((prevFormData) => ({ ...prevFormData, email }));
        setShowResetPasswordFields(true);
      } catch (error) {
        console.log("Error during password reset:", error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to send password reset email. Please try again.',
        });
      }
    } catch (err) {
      setEmailError(err.errors[0]);
    }
  };

  const handleResetPassword = async () => {
    try {
      // await resetPasswordSchema.validate(formData, { abortEarly: false });
      try {
        const { email, oldPassword, newPassword, confirmPassword } = formData;
        const res = await actions.resetPassword({ email, oldPassword, newPassword, confirmPassword });
        console.log("Reset Password Response ==>>>>>", res);
        Toast.show({
          type: 'success',
          text1: 'Password reset successful',
          text2: 'You can now login with your new password',
        });
        navigation.navigate('Login');
      } catch (error) {
        console.log("Error during password reset:", error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to reset password. Please try again.',
        });
      }
    } catch (err) {
      const errors = {};
      err.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setResetPasswordError(errors);
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError('');
  };

  const handleFormDataChange = (field, text) => {
    setFormData((prevFormData) => ({ ...prevFormData, [field]: text }));
    setResetPasswordError((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  return (
    <View className="flex-1 justify-center  px-4  ">

      <View className=' flex items-center mb-5' >

        <Image
          source={require('../../assets/images/wlogo.png')}
          resizeMode={'contain'}
          style={{ width: 200, height: 65 }}
        />
      </View>
      <Text className="text-xl mb-5 font-bold">Forgotten Password</Text>

      {!showResetPasswordFields && (
        <>
          <View className="w-full mb-6">

            <TextInput
              className="border border-gray-100 rounded-lg p-3 mb-4 focus:border-teal-500"
              value={email}
              onChangeText={handleEmailChange}
              placeholder="Email"
              keyboardType="email-address"
            />

            {emailError && <Text className="text-red-500 mt-1">{emailError}</Text>}
          </View>

          <TouchableOpacity
            className="bg-[#01c8a7] rounded-lg px-4 py-3 w-full shadow-md mb-4"
            onPress={handleForgottenPassword}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Send Reset Link
            </Text>
          </TouchableOpacity>

          <Text className="mt-4 text-center">
            Already have an account?{' '}
            <Text className="text-teal-500 font-semibold" onPress={() => navigation.navigate('Login')}>Login</Text>
          </Text>
        </>
      )}

      {showResetPasswordFields && (
        <>
          <View className="w-full mb-4">
          <TextInput
              className="border border-gray-100 rounded-lg p-3 mb-4 focus:border-teal-500"
              placeholder="Email"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => handleFormDataChange('email', text)}
              editable={false}
            />



            {resetPasswordError.email && <Text className="text-red-500 mt-1">{resetPasswordError.email}</Text>}
          </View>

          <View className="w-full mb-4">
          <TextInput
              className="border border-gray-100 rounded-lg p-3 mb-4 focus:border-teal-500"
              placeholder="Current Password"
              secureTextEntry
              value={formData.oldPassword}
              onChangeText={(text) => handleFormDataChange('oldPassword', text)}
            />
            {resetPasswordError.oldPassword && <Text className="text-red-500 mt-1">{resetPasswordError.oldPassword}</Text>}
          </View>

          <View className="w-full mb-4">
          <TextInput
              className="border border-gray-100 rounded-lg p-3 mb-4 focus:border-teal-500"
              placeholder="New Password"
              secureTextEntry
              value={formData.newPassword}
              onChangeText={(text) => handleFormDataChange('newPassword', text)}
            />
            {resetPasswordError.newPassword && <Text className="text-red-500 mt-1">{resetPasswordError.newPassword}</Text>}
          </View>

          <View className="w-full mb-6">
          <TextInput
              className="border border-gray-100 rounded-lg p-3 mb-4 focus:border-teal-500"
              placeholder="Confirm Password"
              secureTextEntry
              value={formData.confirmPassword}
              onChangeText={(text) => handleFormDataChange('confirmPassword', text)}
            />
            {resetPasswordError.confirmPassword && <Text className="text-red-500 mt-1">{resetPasswordError.confirmPassword}</Text>}
          </View>

          <TouchableOpacity
            className="bg-[#01c8a7] rounded-lg px-4 py-3 w-full shadow-md mb-4"
            onPress={handleResetPassword}
          >
            <Text className="text-white text-lg font-semibold text-center">
              Reset Password
            </Text>
          </TouchableOpacity>

          <Text className="mt-4 text-center">
        Already have an account?{' '}
        <Text className="text-teal-500 font-semibold" onPress={() => navigation.navigate('Login')}>Login</Text>
      </Text>
        </>
      )}
    </View>
  );
}


//Loginotp


import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import * as yup from 'yup';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import actions from '../redux/actions';

const schema = yup.object().shape({
    credential: yup.string().required('Email or phone number is required'),
});

export default function Login() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({ credential: '' });
    const [errors, setErrors] = useState({});
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(0);
    const [credentialOTPSent, setCredentialOTPSent] = useState('');
    const otpInputRefs = Array(6).fill().map(() => React.createRef());

    const handleSendOTP = async () => {
        try {
            await schema.validate(formData, { abortEarly: false });
            const { credential } = formData;
            // Replace with your actual OTP sending logic
            const res = await actions.sendotp({ email: credential });
            console.log("OTP sent successfully:", credential);

            showMessage({
                message: 'OTP sent successfully',
                description: `OTP sent to ${credential}`,
                type: 'success',
            });
            setTimer(60); // Set the timer to 60 seconds
            setOtpSent(true);
            setCredentialOTPSent(credential);
        } catch (err) {
            const errors = {};
            if (err.inner && Array.isArray(err.inner)) {
                err.inner.forEach((error) => {
                    errors[error.path] = error.message;
                });
            }
            setErrors(errors);
        }
    };

    const handleOTPVerification = async () => {
        try {
            const { credential } = formData;
            const res = await actions.login({ email: credential, otp });
            console.log("OTP verification successful:", res.data);
            showMessage({
                message: 'Login successful',
                type: 'success',
            });
            // Navigate to the desired screen after successful login
        } catch (error) {
            console.log("Error during OTP verification:", error.message);
            showMessage({
                message: 'Error',
                description: 'Invalid OTP. Please try again.',
                type: 'danger',
            });
        }
    };

    const handleResendOTP = async () => {
        try {
            const { credential } = formData;
            const res = await actions.sendotp({ email: credential });

            console.log("OTP sent successfully:", res.data);
            showMessage({
                message: 'OTP sent successfully',
                description: `OTP sent to ${credential}`,
                type: 'success',
            });
            setTimer(60); // Set the timer to 60 seconds
        } catch (err) {
            const errors = {};
            if (err.inner && Array.isArray(err.inner)) {
                err.inner.forEach((error) => {
                    errors[error.path] = error.message;
                });
            }
            setErrors(errors);
        }
    };

    useEffect(() => {
        let interval = null;
        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer(timer - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [otpSent, timer]);

    const handleOTPChange = (index, value) => {
        const newOTP = otp.split('');
        newOTP[index] = value;
        setOtp(newOTP.join(''));

        if (value !== '' && index < 5) {
            otpInputRefs[index + 1].current.focus();
        } else if (value === '' && index > 0) {
            otpInputRefs[index - 1].current.focus();
        }
    };

    return (
        <View className="flex-1 justify-center items-center  px-5">
            <View className=' flex items-center mb-5' >

                <Image
                    source={require('../../assets/images/wlogo.png')}
                    resizeMode={'contain'}
                    style={{ width: 200, height: 65 }}
                />
            </View>
            {!otpSent && (
                <View className="w-full mb-6">

                    <TextInput
                        className={`border border-gray-100 rounded-lg p-3 mb-4 focus:border-teal-500 ${errors.credential ? 'border-2 border-red-500' : ''}`}
                        placeholder="Email or Phone Number"
                        keyboardType={/^\d+$/.test(formData.credential) ? 'phone-pad' : 'email-address'}
                        value={formData.credential}
                        onChangeText={(text) => setFormData({ ...formData, credential: text })}
                    />
                    {errors.credential && <Text className="text-red-500 mb-2">{errors.credential}</Text>}
                    <TouchableOpacity
                        className="bg-teal-500 rounded-lg px-4 py-3 shadow-md"
                        onPress={handleSendOTP}
                    >
                        <Text className="text-white font-bold text-center">Send OTP</Text>
                    </TouchableOpacity>
                </View>
            )}

            {otpSent && (
                <View className="w-full mb-6">
                    <Text className="text-gray-700 mb-2">OTP sent to {credentialOTPSent}</Text>
                    <View className="w-full mb-6 flex-row justify-between">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                            <TextInput
                                key={index}
                                ref={otpInputRefs[index]}
                                className="bg-white rounded-lg px-4 py-3 w-[50px] shadow-md text-center"
                                placeholder="_"
                                keyboardType="numeric"
                                maxLength={1}
                                value={otp[index] || ''}
                                onChangeText={(text) => handleOTPChange(index, text)}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && otp[index] === '') {
                                        if (index > 0) {
                                            otpInputRefs[index - 1].current.focus();
                                        }
                                    }
                                }}
                            />
                        ))}
                    </View>
                    <View className="flex-row justify-between">
                        <TouchableOpacity
                            className="bg-teal-500 rounded-lg px-4 py-3 flex-1 mr-2 shadow-md"
                            onPress={handleOTPVerification}
                        >
                            <Text className="text-white font-semibold text-lg text-center">Verify OTP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-teal-500 rounded-lg px-4 py-3 flex-1 shadow-md"
                            onPress={handleResendOTP}
                        >
                            <Text className="text-white font-semibold text-lg text-center">Resend OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <Text className="text-gray-700 mb-4">
                Don't have an account!{' '}
                <Text
                    className="text-teal-500 font-bold"
                    onPress={() => navigation.navigate('Register1')}
                >
                    Sign up now
                </Text>
            </Text>
            <FlashMessage position="top" />
        </View>
    );
}