"use client";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.action";

import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{
        name: "",
        email: "",
        password: "",
        username: "",
      }}
      onSubmit={signUpWithCredentials}
    />
  );
};

export default SignUp;
