import { useDispatch, useSelector } from "react-redux";
import {
  useCopyItemsMutation,
  useCreateShareMutation,
  useDeleteItemsMutation,
  useDeleteTrashItemsMutation,
  useDownloadItemsMutation,
  useMoveItemsMutation,
  useRenameItemMutation,
  useRestoreTrashItemsMutation,
} from "../features/api/apiSlice";
import { useEffect, useRef, useState } from "react";
import SpinnerGIF from "./icons/SpinnerGIF";
import { Snackbar } from "./Notification/Snackbar";
import { CloseButton } from "./Buttons/CloseButton";
import { setOperation } from "../features/operation/operationSlice";
import { CheckCircle } from "./icons/Check-Circle.jsx";
import { Exclaimation } from "./icons/Exclaimation-triangle.jsx";
import { CustomBlueButton } from "./Buttons/BlueButton.jsx";
import {
  DOWNLOAD,
  MOVE,
  DELETE,
  SHARE,
  COPY,
  RENAME,
  DELETETRASH,
  RESTORETRASH,
  EMPTYTRASH,
  downloadItemsURL,
  server,
} from "../config.js";
import { setRefresh } from "../features/table/updateTableSlice.js";

const CopyToClipBoard = ({ url }) => {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      timer.current = setInterval(() => setCopied(false), 5000);
    } else {
      clearInterval(timer.current);
    }
  }, [copied]);
  useEffect(() => {
    return () => clearInterval(timer.current);
  }, []);

  return (
    <div className="w-full flex flex-row h-[80%]">
      <input
        defaultValue={url}
        className="text-black w-full  focus:outline-none focus:border-2
               focus:border-dropbox-blue"
        autoFocus={true}
        onFocus={(e) => e.target.select()}
        style={{ boxShadow: "inset 0 0 0 1px black" }}
      ></input>
      {!copied && (
        <CustomBlueButton
          onClick={() => copy(url)}
          style={{ width: "100px", height: "40px", marginLeft: 0 }}
          text={"Copy Link"}
        ></CustomBlueButton>
      )}
      {copied && (
        <CustomBlueButton
          onClick={() => copy(url)}
          style={{ width: "100px", height: "40px", marginLeft: 0 }}
          text={"Copied!"}
        ></CustomBlueButton>
      )}
    </div>
  );
};

const DisplayText = ({
  type,
  isLoading,
  isError,
  isSuccess,
  className,
  data,
}) => {
  if (data && type === DOWNLOAD && isSuccess) {
    const { key } = data;
    window.open(`${server}${downloadItemsURL}?key=${key}&dl=1`, "_parent");
  }

  return (
    <>
      {type === DELETETRASH && isLoading && (
        <span className={className}>Deleting Trash..</span>
      )}

      {type === SHARE && isLoading && (
        <span className={className}>Generating Share..</span>
      )}

      {type === RESTORETRASH && isLoading && (
        <span className={className}>Restoring..</span>
      )}

      {type === DOWNLOAD && isLoading && (
        <span className={className}>Getting Download Link..</span>
      )}

      {type === EMPTYTRASH && isLoading && (
        <span className={className}>Emptying Trash..</span>
      )}

      {type === MOVE && isLoading && (
        <span className={className}>Moving..</span>
      )}
      {type === COPY && isLoading && <span className={className}>Copy..</span>}
      {type === DELETE && isLoading && (
        <span className={className}>Deleting..</span>
      )}
      {type === RENAME && isLoading && (
        <span className={className}>Renaming..</span>
      )}

      {type === DELETETRASH && isSuccess && (
        <span className={className}>Deleted Items from Trash</span>
      )}

      {type === DOWNLOAD && isSuccess && (
        <span className={className}>
          Download Initiated. Check Downloads Folder.
        </span>
      )}

      {type === RESTORETRASH && isSuccess && (
        <span className={className}>Restored Items from trash</span>
      )}

      {type === EMPTYTRASH && isSuccess && (
        <span className={className}>Trash Emptied</span>
      )}

      {type === MOVE && isSuccess && <span className={className}>Moved</span>}
      {type === COPY && isSuccess && <span className={className}>Copied.</span>}
      {type === DELETE && isSuccess && (
        <span className={className}>Deleted</span>
      )}
      {type === RENAME && isSuccess && (
        <span className={className}>Renamed</span>
      )}

      {type === SHARE && isSuccess && <CopyToClipBoard url={data.url} />}

      {type === DELETETRASH && isError && (
        <span className={className}>Error Deleting Items from Trash</span>
      )}

      {type === DOWNLOAD && isError && (
        <span className={className}>Error initiating Download</span>
      )}

      {type === RESTORETRASH && isError && (
        <span className={className}>Error restoring items from trash</span>
      )}

      {type === EMPTYTRASH && isError && (
        <span className={className}>Error in emptying trash</span>
      )}

      {type === MOVE && isError && (
        <span className={className}>Error moving</span>
      )}
      {type === COPY && isError && (
        <span className={className}>Error copying.</span>
      )}
      {type === DELETE && isError && (
        <span className={className}>Error deleting</span>
      )}
      {type === RENAME && isError && (
        <span className={className}>Error renaming</span>
      )}
      {type === SHARE && isError && (
        <span className={className}>Error Generating Share</span>
      )}
    </>
  );
};

export function StatusNotification() {
  const operation = useSelector((state) => state.operation);
  const refresh = useSelector((state) => state.updateTable);
  const { CSRFToken } = useSelector((state) => state.csrfToken);
  const dispath = useDispatch();
  let init_operation;
  const moveItemsMutation = useMoveItemsMutation();
  const copyItemsMutation = useCopyItemsMutation();
  const deleteTrashMutation = useDeleteTrashItemsMutation();
  const deleteItemsMutation = useDeleteItemsMutation();
  const restoreTrashMutation = useRestoreTrashItemsMutation();
  const renameItemMutation = useRenameItemMutation();
  const createShareMutation = useCreateShareMutation();
  const downloadItemsMutation = useDownloadItemsMutation();

  const [open, setOpen] = useState(false);
  const timer = useRef();
  const refreshTimer = useRef();
  const count = useRef(1);

  switch (operation.type) {
    case DELETETRASH:
      init_operation = deleteTrashMutation;
      break;
    case RESTORETRASH:
      init_operation = restoreTrashMutation;
      break;
    case MOVE:
      init_operation = moveItemsMutation;
      break;
    case COPY:
      init_operation = copyItemsMutation;
      break;
    case DELETE:
      init_operation = deleteItemsMutation;
      break;
    case RENAME:
      init_operation = renameItemMutation;
      break;
    case SHARE:
      init_operation = createShareMutation;
      break;
    case DOWNLOAD:
      init_operation = downloadItemsMutation;
      break;
    default:
      init_operation = [
        () => {},
        {
          isLoading: false,
          isSuccess: false,
          isError: false,
          data: [],
          status: "idle",
          error: "",
        },
      ];
      break;
  }
  const { isLoading, isSuccess, isError, status, data } = init_operation[1];
  const handleClose = () => {
    setOpen(false);
    dispath(
      setOperation({
        type: "",
        status: "idle",
        isSuccess: false,
        isError: false,
        isLoading: false,
        data: [],
      })
    );
  };

  useEffect(() => {
    if (operation.status === "initialized" && CSRFToken.length > 0) {
      setOpen(true);
      switch (operation.type) {
        case DELETETRASH:
          console.log("trash initialilzed");
          init_operation[0]({ items: operation.data, CSRFToken });
          break;
        case RESTORETRASH:
          console.log("restore trash initialilzed");

          init_operation[0]({ items: operation.data, CSRFToken });
          break;
        case MOVE:
          init_operation[0]({
            items: operation.data.body,
            to: operation.data.to,
            CSRFToken,
          });
          break;
        case COPY:
          init_operation[0]({
            items: operation.data.body,
            to: operation.data.to,
            CSRFToken,
          });
          break;
        case DELETE:
          const body = {
            fileIds: operation.data.fileIds,
            directories: operation.data.directories,
          };
          init_operation[0]({
            items: body,
            CSRFToken,
          });
          break;
        case RENAME:
          init_operation[0]({ items: operation.data, CSRFToken });
          break;
        case SHARE:
          init_operation[0]({
            items: operation.data.body,
            type: operation.data.type,
            CSRFToken,
          });
          break;
        case DOWNLOAD:
          init_operation[0]({ items: operation.data, CSRFToken });
          break;
      }
    }
  }, [operation.type, operation.status, CSRFToken]);

  // useEffect(() => {
  //   if (isError || isSuccess) {
  //     timer.current = setInterval(() => {
  //       handleClose();
  //     }, timeout);
  //   }
  // }, [isSuccess, isError]);

  // useEffect(() => {
  //   return () => clearInterval(timer.current);
  // }, []);
  useEffect(() => {}, []);

  useEffect(() => {
    console.log(operation);
    console.log({ isLoading, isSuccess, isError, status, data });
    if (isLoading) {
      refreshTimer.current = setInterval(() => {
        dispath(setRefresh({ toggle: !refresh.toggle, refresh: true }));
      }, 2000);
    }
    if ((isSuccess || isError) && status !== "uninitialized") {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current);
      }

      dispath(setRefresh({ toggle: !refresh.toggle, refresh: true }));
      dispath(
        setOperation({
          type: operation.type,
          status: "idle",
          isSuccess: false,
          isError: false,
          isLoading: false,
          data: [],
        })
      );
    }
  }, [isLoading, isError, isSuccess, status]);

  return (
    <>
      <Snackbar open={open}>
        {isLoading && <SpinnerGIF style={{ width: "50px", height: "50px" }} />}
        {isSuccess && (
          <div className="col-span-1 flex items-center ml-2">
            <CheckCircle />
          </div>
        )}
        {isError && (
          <div className="col-span-1 flex items-center ml-2">
            <Exclaimation />
          </div>
        )}
        <div className="col-span-6 flex items-center mx-1">
          <DisplayText
            type={operation.type}
            isLoading={isLoading}
            isError={isError}
            isSuccess={isSuccess}
            data={data}
            className="text-left text-black"
          />
        </div>
        {(isSuccess || isError) && (
          <CloseButton handleClose={handleClose} timeout={5000}></CloseButton>
        )}
      </Snackbar>
    </>
  );
}
