import { useEffect, useState } from "react";
import Tabs from "./SharedTab";
import { useDispatch, useSelector } from "react-redux";
import { AccountGeneral } from "./AccountGeneral.js";
import { AccountSecurity } from "./AccountSecurity.js";
import "./AccountPage.css";
import {
  useDeleteAvatarMutation,
  useUpdateNameMutation,
  useUpdatePasswordMutation,
  useVerifySessionMutation,
} from "../features/api/apiSlice";
import { ChangeName } from "./ChangeName.js";
import SnackBar from "./Snackbar/SnackBar.js";
import SpinnerGIF from "./icons/SpinnerGIF";
import {
  setAvatarURL,
  setEmail,
  setFirstName,
  setFullName,
  setHasAvatar,
  setInitial,
  setIs2FA,
  setIsEmail,
  setIsSMS,
  setIsTOTP,
  setLastName,
} from "../features/avatar/avatarSlice";
import { ChangePassword } from "./ChangePassword.js";
import { setNotify } from "../features/notification/notifySlice.js";
import { ChangeAvatar } from "./ChangeAvatar.js";
import { DeleteAvatar } from "./DeleteAvatar.js";
import { TwoFA } from "./2fa.js";

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
  const [_2FASwitch, set2FASwitch] = useState(true);
  const dispatch = useDispatch();
  const [nameChangeQuery, nameChangeStatus] = useUpdateNameMutation();
  const [updatePasswordQuery, updatePassword] = useUpdatePasswordMutation();
  const [deleteAvatarQuery, deleteAvatarStatus] = useDeleteAvatarMutation();
  const [session, sessionStatus] = useVerifySessionMutation();
  const [edit, setEdit] = useState({ type: undefined, isEdit: false });
  const notify = useSelector((state) => state.notification);

  const { error, isSuccess, isLoading, isError, data } = nameChangeStatus;
  const handleName = () => {
    setEdit({ type: "NAME", isEdit: true });
  };
  const handleAvatarAdd = () => {
    setEdit({ type: "AVATAR", isEdit: true });
  };

  const handleAvatarDelete = () => {
    setEdit({ type: "AVATARDELETE", isEdit: true });
  };
  const handleEmail = () => {
    setEdit({ type: "EMAIL", isEdit: true });
  };

  const handlePassword = () => {
    setEdit({ type: "PASSWORD", isEdit: true });
  };

  const handleSwitchChange = () => {
    // set2FASwitch((prev) => !prev);
    setEdit({ type: "2FA", isEdit: true });
  };

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
      dispatch(setNotify({ show: true, severity: "success", msg: data?.msg }));
    }
    if (error && error?.status === 404) {
      dispatch(
        setNotify({ show: true, severity: "warning", msg: error.data?.msg })
      );
    }
    if (
      error &&
      (error?.originalStatus === 500 ||
        error?.originalStatus === 404 ||
        error?.status === 500)
    ) {
      dispatch(
        setNotify({
          show: true,
          severity: "error",
          msg: "Something Went Wrong",
        })
      );
    }
  }, [isLoading, isSuccess, isError, data, dispatch, error]);

  useEffect(() => {
    if (updatePassword.data && updatePassword.isSuccess) {
      dispatch(
        setNotify({
          show: true,
          severity: "success",
          msg: updatePassword.data?.msg,
        })
      );
    }
    if (updatePassword.error && updatePassword.error?.status === 404) {
      dispatch(
        setNotify({
          show: true,
          severity: "warning",
          msg: updatePassword.error.data?.msg,
        })
      );
    }
    if (
      updatePassword.error &&
      (updatePassword.error?.originalStatus === 500 ||
        updatePassword.error?.originalStatus === 404 ||
        updatePassword.error?.status === 500)
    ) {
      dispatch(
        setNotify({
          show: true,
          severity: "error",
          msg: "something went wrong",
        })
      );
    }
  }, [
    updatePassword.isLoading,
    updatePassword.isError,
    updatePassword.error,
    updatePassword.data,
    updatePassword.isSuccess,
  ]);

  useEffect(() => {
    if (deleteAvatarStatus.data && deleteAvatarStatus.isSuccess) {
      session();
      dispatch(
        setNotify({
          show: true,
          severity: "success",
          msg: deleteAvatarStatus.data?.msg,
        })
      );
    }
    if (deleteAvatarStatus.error && deleteAvatarStatus.error?.status === 404) {
      dispatch(
        setNotify({
          show: true,
          severity: "warning",
          msg: deleteAvatarStatus.error.data?.msg,
        })
      );
    }
    if (
      deleteAvatarStatus.error &&
      (deleteAvatarStatus.error?.originalStatus === 500 ||
        deleteAvatarStatus.error?.originalStatus === 404 ||
        deleteAvatarStatus.error?.status === 500)
    ) {
      dispatch(
        setNotify({
          show: true,
          severity: "error",
          msg: "something went wrong",
        })
      );
    }
  }, [
    deleteAvatarStatus.isLoading,
    deleteAvatarStatus.isError,
    deleteAvatarStatus.error,
    deleteAvatarStatus.data,
    deleteAvatarStatus.isSuccess,
  ]);

  useEffect(() => {
    if (sessionStatus.isSuccess && sessionStatus.data) {
      const {
        first,
        last,
        email,
        initials,
        avatar_url,
        hasAvatar,
        is2FA,
        isSMS,
        isTOTP,
        isEmail,
      } = sessionStatus?.data;
      dispatch(setFirstName(first));
      dispatch(setLastName(last));
      dispatch(setFullName(first + " " + last));
      dispatch(setInitial(initials));
      dispatch(setEmail(email));
      dispatch(setHasAvatar(hasAvatar));
      dispatch(setAvatarURL(avatar_url));
      dispatch(setIs2FA(is2FA));
      dispatch(setIsSMS(isSMS));
      dispatch(setIsTOTP(isTOTP));
      dispatch(setIsEmail(isEmail));
      set2FASwitch(is2FA);
    }
  }, [
    sessionStatus.isLoading,
    sessionStatus.isError,
    sessionStatus.error,
    sessionStatus.data,
    sessionStatus.isSuccess,
  ]);

  useEffect(() => {
    session();
  }, []);

  return (
    <div className="accountpage-container">
      <h2 className="accountpage-heading">Personal Account</h2>
      <Tabs tabs={tabs} setActiveTab={setActiveTabs} />
      {(isLoading || updatePassword.isLoading || sessionStatus.isLoading) && (
        <Loading />
      )}
      {(!isLoading || !sessionStatus.isLoading) && tabs.General && (
        <AccountGeneral
          handleAvatarAdd={handleAvatarAdd}
          handleEmail={handleEmail}
          handleName={handleName}
          handleAvatarDelete={handleAvatarDelete}
        />
      )}
      {(!updatePassword.isLoading || !sessionStatus.isLoading) &&
        tabs.Security && (
          <AccountSecurity
            handlePassword={handlePassword}
            handleChange={handleSwitchChange}
            _2FA_switch={_2FASwitch}
            _2FA_status={sessionStatus?.data?.is2FA ? "On" : "Off"}
            set2FASwitch={set2FASwitch}
          />
        )}
      {edit?.type === "NAME" && edit.isEdit && (
        <ChangeName
          onClose={() => setEdit({ type: undefined, isEdit: false })}
          query={nameChangeQuery}
        />
      )}
      {edit?.type === "AVATARDELETE" && edit.isEdit && (
        <DeleteAvatar
          onClose={() => setEdit({ type: undefined, isEdit: false })}
          query={deleteAvatarQuery}
        />
      )}
      {edit?.type === "PASSWORD" && edit.isEdit && (
        <ChangePassword
          onClose={() => setEdit({ type: undefined, isEdit: false })}
          query={updatePasswordQuery}
        />
      )}
      {edit?.type === "AVATAR" && edit.isEdit && (
        <ChangeAvatar
          onClose={() => setEdit({ type: undefined, isEdit: false })}
        />
      )}
      {edit?.type === "2FA" && edit.isEdit && (
        <TwoFA
          onClose={() => {
            setEdit({ type: undefined, isEdit: false });
            session();
          }}
          set2FASwitch={set2FASwitch}
          _2FASwitch={_2FASwitch}
        />
      )}
      {notify.show && <SnackBar msg={notify.msg} severity={notify.severity} />}
    </div>
  );
};

export default AccountPage;
