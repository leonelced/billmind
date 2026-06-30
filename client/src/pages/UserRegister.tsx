import UserForm from "#components/UserForm";
import type { UserFormProps } from "#components/UserForm";


export default function Register() {
  const props: UserFormProps = {
    path: "/api/users",
    title: "Create your account",
    redirect: "/login",
    reqMethod: "POST",
    submitBtnName: "Create Account",
    isRegistration: true,
  }

  return (
    <UserForm {...props}/>
  );
}
