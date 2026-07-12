import UserForm from "#components/UserForm";
import type { UserFormProps } from "#components/UserForm";
import { API } from "../utils/api";


export default function UpdateUser() {
  const props: UserFormProps = {
    path: API.users.base(),
    title: "Update User",
    redirect: "/dashboard",
    reqMethod: "PUT",
    submitBtnName: "Update"
  }

  return (
    <UserForm {...props}/>
  );
}
