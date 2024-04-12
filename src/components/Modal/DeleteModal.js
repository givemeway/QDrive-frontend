import { useRef } from "react";
import { GreyButton } from "../Buttons/GreyButton";
import { CustomBlueButton } from "../Buttons/BlueButton";
import { Modal } from "./Modal";
import useOutSideClick from "../hooks/useOutsideClick";
import { setOperation } from "../../features/operation/operationSlice";
import { useDispatch, useSelector } from "react-redux";

export function DeleteModal({ title, content, open, onClose, onSubmit }) {
  const ref = useRef();
  const dispatch = useDispatch();
  const operation = useSelector((state) => state.operation);

  const handleClose = () => {
    dispatch(
      setOperation({
        ...operation,
        type: "",
        status: "idle",
        data: [],
        open: false,
      })
    );
    onClose("");
  };

  useOutSideClick(ref, handleClose);
  return (
    <>
      {open && (
        <Modal>
          <div
            ref={ref}
            className=" flex flex-col bg-white rounded w-[500px] h-[200px] border-2 border-custom-blue"
          >
            <h2 className="text-xl mt-5 ml-5 text-left">{title}</h2>
            <h6 className="text mt-2 ml-5 text-left">{content}</h6>
            <div className="flex flex-row justify-end items-center gap-2 self-stretch mt-auto mb-5 mr-5">
              <GreyButton
                text={"Cancel"}
                onClick={handleClose}
                style={{ width: "75px", height: "40px" }}
              />
              <CustomBlueButton
                text={"Delete"}
                onClick={onSubmit}
                style={{ width: "75px", height: "40px" }}
              />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
