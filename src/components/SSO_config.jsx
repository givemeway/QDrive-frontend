import { useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "./2fa.css";
import "./SSOConfig.css";
import useOutSideClick from "./hooks/useOutsideClick";
import {
  useDisableSSOMutation,
  useSsoConfigMutation,
} from "../features/api/apiSlice";
import SpinnerGIF from "./icons/SpinnerGIF";
import { useDispatch, useSelector } from "react-redux";
import { setNotify } from "../features/notification/notifySlice";
import { setisSSO } from "../features/avatar/avatarSlice";

const SSOWindow = ({ onClose }) => {
  const dispatch = useDispatch();
  const { idpIssuer, idpCert, entryPoint } = useSelector((state) => state.sso);
  const { isSSO } = useSelector((state) => state.avatar);
  const [SSOForm, setSSOForm] = useState({
    idpIssuer: "",
    idpCert: "",
    entryPoint: "",
  });

  const [query, status] = useSsoConfigMutation();
  const [disableSSOQuery, disableSSOStatus] = useDisableSSOMutation();

  const { data, error, isError, isSuccess, isLoading } = status;

  useEffect(() => {
    setSSOForm({ idpIssuer, idpCert, entryPoint });
  }, []);

  const handleChange = (e) => {
    setSSOForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = () => {
    if (
      SSOForm.idpCert !== "" &&
      SSOForm.entryPoint !== "" &&
      SSOForm.idpIssuer
    ) {
      const { idpCert, idpIssuer, entryPoint } = SSOForm;
      query({ idpCert, idpIssuer, entryPoint });
    }
  };

  const disableSSO = () => {
    disableSSOQuery();
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      dispatch(setisSSO(false));
      dispatch(
        setNotify({
          show: true,
          severity: "success",
          msg: data?.msg,
        })
      );
    }
    if (isError && error.status === 401) {
      onClose();

      dispatch(
        setNotify({
          show: true,
          severity: "warning",
          msg: error?.data?.msg,
        })
      );
    }
    if (error && error.originalStatus === 500) {
      onClose();
      dispatch(
        setNotify({
          show: true,
          severity: "error",
          msg: "Something went wrong",
        })
      );
    }
  }, [data, isError, error, isSuccess, isLoading]);

  useEffect(() => {
    if (disableSSOStatus.isSuccess) {
      onClose();
      dispatch(
        setNotify({
          show: true,
          severity: "success",
          msg: disableSSOStatus.data?.msg,
        })
      );
    }
    if (disableSSOStatus.isError && disableSSOStatus.error.status === 401) {
      onClose();

      dispatch(
        setNotify({
          show: true,
          severity: "warning",
          msg: disableSSOStatus.error?.data?.msg,
        })
      );
    }
    if (
      disableSSOStatus.error &&
      disableSSOStatus.error.originalStatus === 500
    ) {
      onClose();
      dispatch(
        setNotify({
          show: true,
          severity: "error",
          msg: "Something went wrong",
        })
      );
    }
  }, [
    disableSSOStatus.isSuccess,
    disableSSOStatus.isError,
    disableSSOStatus.isLoading,
    disableSSOStatus.error,
  ]);

  return (
    <div className="sso-container">
      <h2 className="step-one-title">Single Sign-on</h2>
      <CloseIcon className="step-one-close" onClick={onClose} />
      <div className="row">
        <label className="sso-label">Issuer URL</label>
        <input
          onChange={handleChange}
          className="sso-input"
          value={SSOForm.idpIssuer}
          name="idpIssuer"
        />
      </div>
      <div className="row">
        <label className="sso-label">SSO Endpoint</label>
        <input
          onChange={handleChange}
          className="sso-input"
          value={SSOForm.entryPoint}
          name="entryPoint"
        />
      </div>
      <div className="row" style={{ height: "100px" }}>
        <label className="sso-label"> X.509 certificate</label>
        <textarea
          onChange={handleChange}
          className="sso-input"
          value={SSOForm.idpCert}
          name="idpCert"
        />
      </div>
      {isSSO && (
        <button
          className={`sso-disable-btn ${isLoading ? "btn-disable" : ""}`}
          onClick={disableSSO}
        >
          {disableSSOStatus.isLoading && (
            <SpinnerGIF style={{ height: 25, width: 25 }} />
          )}
          {!disableSSOStatus.isLoading && <>Disable SSO</>}
        </button>
      )}
      <button
        className={`sso-btn ${isLoading ? "btn-disable" : ""}`}
        onClick={onSubmit}
        disabled={isLoading ? true : false}
      >
        {isLoading && <SpinnerGIF style={{ height: 25, width: 25 }} />}
        {!isLoading && <>Configure SSO</>}
      </button>
    </div>
  );
};

export const SSOConfig = ({ onClose }) => {
  const ref = useRef(null);
  useOutSideClick(ref, onClose);

  return (
    <div className="modal">
      <div className={`sso-box`} ref={ref}>
        <SSOWindow onClose={onClose} />
      </div>
    </div>
  );
};
