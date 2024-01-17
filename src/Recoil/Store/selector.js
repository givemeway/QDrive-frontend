/* global axios */

import { selector, selectorFamily } from "recoil";
import {
  CSRFTokenAtom,
  breadCrumbAtom,
  subpathAtom,
  trashDeleteStatusAtom,
} from "./atoms";
import { csrftokenURL, deleteTrashURL } from "../../config";

export const folderExplorerSelector = selector({
  key: "folderExplorerSelector",
  get: ({ get }) => {
    const subpath = get(subpathAtom);
    const breadCrumb = get(breadCrumbAtom);
    const folderExplorerValue = {
      nodeIDToExpand: "/" + subpath.split("/").slice(1).join("/"),
      breadCrumb: breadCrumb,
    };
    return folderExplorerValue;
  },
});

export const deleteTrashItemsSelector = selectorFamily({
  key: "deleteTrashItemsSelector",
  // get: ({ get }) => {
  //   return get(trashDeleteStatusAtom);
  // },
  get: (value) => async () => {
    try {
      // const CSRFToken = get(CSRFTokenSelector);
      const { items, CSRFToken } = value;
      console.log(items, CSRFToken);
      const headers = {
        "X-CSRF-Token": CSRFToken,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      const body = { items: JSON.stringify(items) };
      const response = await axios.post(deleteTrashURL, body, {
        headers: headers,
      });
      console.log(response.data);
      return response.data;
      // set(trashDeleteStatusAtom, response.data);
    } catch (err) {
      console.error(err);
      return err;
      // set(trashDeleteStatusAtom, "");
    }
  },
});

export const CSRFTokenSelector = selector({
  key: "CSRFTokenSelector",
  // get: ({ get }) => {
  //   return get(CSRFTokenAtom);
  // },
  get: async () => {
    try {
      const response = await fetch(csrftokenURL);
      const { CSRFToken } = await response.json();

      // set(CSRFTokenAtom, CSRFToken);
      return CSRFToken;
    } catch (err) {
      console.error(err);
      // set(CSRFTokenAtom, "");
      return "";
    }
  },
});
