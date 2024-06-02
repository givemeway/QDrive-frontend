import * as React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { Button } from "@mui/material";

const ensureToAddKeyToURLString = (layout, link, entry) => {
  if (layout === "transfer" && entry[1] === "/") return link;
  if (layout === "share") return (link += `?k=${entry[0]}&dl=0`);
  return layout === "transfer" ? (link += `?k=${entry[0]}`) : link;
};

// TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

export default function CustomizedBreadcrumbs({
  queue,
  layout,
  link,
  k,
  home,
}) {
  let label;
  return (
    <Breadcrumbs
      maxItems={4}
      separator={"/"}
      aria-label="breadcrumb"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 0,
        height: "100%",
        margin: 0,
        padding: 0,
        ".MuiBreadcrumbs-separator": {
          margin: "0px",
        },
        ".MuiBreadcrumbs-li": {
          margin: 0,
        },
      }}
    >
      {layout === "dashboard" &&
        queue.map((dir, idx) => {
          if (dir === "/") {
            label = "Home";
          } else {
            label = dir;
            if (layout !== "share" || idx !== 0) link += `/${dir}`;
          }

          return (
            <Button
              component={Link}
              disableRipple
              disableElevation
              to={k ? link + "?k=" + k : link}
              key={link}
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                fontFamily: "system-ui",
                color: idx === queue.length - 1 ? "black" : "#736C64",
                "&:hover": {
                  background: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              {label === "home" && <HomeIcon fontSize="small" />}
              {label}
            </Button>
          );
        })}

      {(layout === "transfer" || layout === "share") &&
        Array.from(queue).map((entry, idx) => {
          if (entry[1] === "/") {
            label = "Home";
          } else if (layout === "share" && entry[1] === "h") {
            label = home;
            link += "/h";
          } else {
            label = entry[1];
            link += `/${entry[1]}`;
          }

          return (
            <Button
              component={Link}
              disableRipple
              disableElevation
              to={ensureToAddKeyToURLString(layout, link, entry)}
              key={link}
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                fontFamily: "system-ui",
                color:
                  idx === Array.from(queue).length - 1 ? "black" : "#736C64",
                "&:hover": {
                  background: "transparent",
                  textDecoration: "underline",
                },
              }}
            >
              {label === "Home" && <HomeIcon fontSize="small" />}
              {label}
            </Button>
          );
        })}
    </Breadcrumbs>
  );
}
