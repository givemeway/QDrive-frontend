import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";

export default function CustomizedBreadcrumbs({ queue, layout, link, k }) {
  let label;
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 2,
        height: "100%",
        margin: 0,
        padding: 0,
      }}
    >
      {(layout === "share" || layout === "dashboard") &&
        queue.map((dir, idx) => {
          if (dir === "/") {
            label = "Home";
          } else {
            label = dir;
            if (layout !== "share" || idx !== 0) link += `/${dir}`;
          }

          return (
            <Link
              to={k ? link + "?k=" + k : link}
              onClick={(e) => e.stopPropagation()}
              className={`flex flex-row justify-start items-center text-[#736C64] font-sans hover:underline font-semibold ${
                idx === queue.length - 1 ? "text-[black]" : ""
              }`}
            >
              {label === "Home" ? "All Files" : label}
            </Link>
          );
        })}
    </Breadcrumbs>
  );
}
