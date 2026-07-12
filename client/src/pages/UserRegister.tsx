import UserForm from "#components/UserForm";
import type { UserFormProps } from "#components/UserForm";
import { API } from "../utils/api";


export default function Register() {
  const props: UserFormProps = {
    path: API.users.base(),
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
