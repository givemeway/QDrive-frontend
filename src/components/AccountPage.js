import { useEffect, useState } from "react";
import Tabs from "./SharedTab";
import { useDispatch } from "react-redux";
import { AccountGeneral } from "./AccountGeneral.js";
import { AccountSecurity } from "./AccountSecurity.js";
import "./AccountPage.css";
import {
  useUpdateNameMutation,
  useUpdatePasswordMutation,
} from "../features/api/apiSlice";
import { ChangeName } from "./ChangeName.js";
import SnackBar from "./Snackbar/SnackBar.js";
import SpinnerGIF from "./icons/SpinnerGIF";
import {
  setEmail,
  setFirstName,
  setFullName,
  setInitial,
  setLastName,
} from "../features/avatar/avatarSlice";
import { ChangePassword } from "./ChangePassword.js";

const Loading = () => {
  return (
    <div className="loading-container">
      <SpinnerGIF style={{ width: 50, height: 50 }} />
    </div>
  );
};

const AccountPage = () => {
  const [tabs, setActiveTabs] = useState({
    General: true,
    Security: false,
    Privacy: false,
  });
  const dispatch = useDispatch();
  const [nameChangeQuery, nameChangeStatus] = useUpdateNameMutation();
  const [updatePasswordQuery, updatePassword] = useUpdatePasswordMutation();

  const { error, isSuccess, isLoading, isError, data } = nameChangeStatus;
  const handleName = () => {
    setEdit({ type: "NAME", isEdit: true });
  };
  const handleAvatar = () => {
    setEdit({ type: "EMAIL", isEdit: true });
  };
  const handleEmail = () => {
    setEdit({ type: "AVATAR", isEdit: true });
  };

  const handlePassword = () => {
    setEdit({ type: "PASSWORD", isEdit: true });
  };

  const [edit, setEdit] = useState({ type: undefined, isEdit: false });
  const [notify, setNotify] = useState({
    show: false,
    msg: "",
    severity: null,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const { updated } = data;
      const { first_name, last_name, email } = updated;
      const firstNameInitial = first_name.split("")[0].toUpperCase();
      const lastNameInitial = last_name.split("")[0].toUpperCase();
      const initial = firstNameInitial + lastNameInitial;
      dispatch(setFirstName(first_name));
      dispatch(setLastName(last_name));
      dispatch(setFullName(first_name + " " + last_name));
      dispatch(setInitial(initial));
      dispatch(setEmail(email));
      setNotify({ show: true, severity: "success", msg: data?.msg });
    }
    if (error && error?.status === 404) {
      setNotify({ show: true, severity: "warning", msg: error.data?.msg });
    }
    if (error && error?.originalStatus === 500) {
      setNotify({ show: true, severity: "error", msg: "Something Went Wrong" });
    }
  }, [isLoading, isSuccess, isError, data, dispatch, error]);
  useEffect(() => {
    if (updatePassword.data && updatePassword.isSuccess) {
      setNotify({
        show: true,
        severity: "success",
        msg: updatePassword.data?.msg,
      });
    }
    if (updatePassword.error && updatePassword.error?.status === 404) {
      setNotify({
        show: true,
        severity: "warning",
        msg: updatePassword.error.data?.msg,
      });
    }
    if (updatePassword.error && updatePassword.error?.originalStatus === 500) {
      setNotify({
        show: true,
        severity: "error",
        msg: "something went wrong",
      });
    }
  }, [
    updatePassword.isLoading,
    updatePassword.isError,
    updatePassword.error,
    updatePassword.data,
    updatePassword.isSuccess,
  ]);

  return (
    <div className="accountpage-container">
      <h2 className="accountpage-heading">Personal Account</h2>
      <Tabs tabs={tabs} setActiveTab={setActiveTabs} />
      {(isLoading || updatePassword.isLoading) && <Loading />}
      {!isLoading && tabs.General && (
        <AccountGeneral
          handleAvatar={handleAvatar}
          handleEmail={handleEmail}
          handleName={handleName}
        />
      )}
      {!updatePassword.isLoading && tabs.Security && (
        <AccountSecurity handlePassword={handlePassword} />
      )}
      {edit?.type === "NAME" && edit.isEdit && (
        <ChangeName
          onClose={() => setEdit({ type: undefined, isEdit: false })}
          query={nameChangeQuery}
        />
      )}
      {edit?.type === "PASSWORD" && edit.isEdit && (
        <ChangePassword
          onClose={() => setEdit({ type: undefined, isEdit: false })}
          query={updatePasswordQuery}
        />
      )}
      {notify.show && (
        <SnackBar
          msg={notify.msg}
          severity={notify.severity}
          setMessage={setNotify}
        />
      )}
    </div>
  );
};

export default AccountPage;
