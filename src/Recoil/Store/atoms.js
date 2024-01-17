import { atom } from "recoil";

export const setUpload = atom({
  key: "setUpoad",
  default: null,
});

export const itemsSelectedAtom = atom({
  key: "itemsSelectedAtom",
  default: {
    fileIds: [],
    directories: [],
  },
});

export const itemDeletion = atom({
  key: "itemDeletion",
  default: {
    isOpen: false,
    isDeleting: false,
    isDeleted: false,
    itemsDeleted: 0,
    total: 0,
    itemsFailed: 0,
  },
});

export const editAtom = atom({
  key: "editAtom",
  default: {
    mode: "edit",
    editStart: undefined,
    editStop: undefined,
    edited: undefined,
    editing: undefined,
    val: "",
  },
});

export const dataAtom = atom({
  key: "dataAtom",
  default: [],
});

export const subpathAtom = atom({
  key: "subpathAtom",
  default: "home",
});

export const tabSelectedAtom = atom({
  key: "tabSelectedAtom",
  default: 1,
});

export const breadCrumbAtom = atom({
  key: "breadCrumbAtom",
  default: ["/"],
});

export const folderExplorerAtom = atom({
  key: "folderExplorerAtom",
  default: {
    nodeIDToExpand: "/",
    breadCrumb: [""],
  },
});

export const itemsDeletionAtom = atom({
  key: "itemsDeletionAtom",
  default: {
    isOpen: false,
    isDeleting: false,
    isDeleted: false,
    itemsDeleted: 0,
    total: 0,
    itemsFailed: 0,
  },
});

export const snackBarAtom = atom({
  key: "snackbarAtom",
  default: {
    show: false,
    msg: "",
    severity: null,
  },
});

export const uploadAtom = atom({
  key: "uploadAtom",
  default: null,
});

export const trashDeleteStatusAtom = atom({
  key: "trashDeleteStatusAtom",
  default: {
    status: undefined,
    success: undefined,
    msg: "",
    pass: 0,
    fail: 0,
    total: 0,
  },
});

export const statusNotificationAtom = atom({
  key: "statusNotificationAtom",
  default: {
    open: undefined,
    operation_type: "",
    progress: undefined,
    fn: () => {},
  },
});

export const CSRFTokenAtom = atom({
  key: "CSRFTokenAtom",
  default: "",
});
