import * as React from "react";
import { emphasize, styled } from "@mui/material/styles";
import { useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    cursor: "pointer",
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}); // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

function handleClick(event) {
  event.preventDefault();
}

export default function CustomizedBreadcrumbs({ queue }) {
  let label;
  let link = "/dashboard/home";
  return (
    <div
      role="presentation"
      onClick={handleClick}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 2,
        height: "33%",
        margin: 0,
        padding: 0,
      }}
    >
      <Breadcrumbs aria-label="breadcrumb">
        {queue.map((path) => {
          if (path === "/") {
            label = "Home";
          } else {
            label = path;
            link += `/${path}`;
          }

          return (
            <StyledBreadcrumb
              component={Link}
              to={link}
              label={label}
              key={link}
              icon={label === "Home" ? <HomeIcon fontSize="small" /> : <></>}
            />
          );
        })}
      </Breadcrumbs>
    </div>
  );
}
