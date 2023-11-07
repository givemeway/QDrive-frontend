import { Breadcrumbs, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
const typoGraphyStyle = {
  flexGrow: 1,
  textAlign: "left",
  padding: 0,
  margin: 0,
  fontWeight: 450,
  fontFamily: "system-ui",
  fontSize: 12,
  color: "#736C64",
};

export default function CollapsibleBreadCrumbs({ path, id, style }) {
  const breadCrumbs = path.split("/").filter((subpath) => subpath.length > 0);
  return (
    <Breadcrumbs
      maxItems={3}
      separator={<NavigateNextIcon sx={{ fontSize: 15, ...style }} />}
      aria-label="breadcrumb"
      sx={{
        "& .MuiBreadcrumbs-separator": { padding: 0, margin: 0 },
      }}
    >
      {breadCrumbs.map((subpath) => {
        return (
          <Typography
            sx={{ ...typoGraphyStyle, ...style }}
            key={`${id};${path};${subpath}`}
          >
            {subpath}
          </Typography>
        );
      })}
    </Breadcrumbs>
  );
}
