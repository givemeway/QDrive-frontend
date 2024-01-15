import { selector } from "recoil";
import { breadCrumbAtom, subpathAtom } from "./atoms";

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
