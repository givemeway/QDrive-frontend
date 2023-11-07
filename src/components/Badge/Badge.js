import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

import Badge from "@mui/material/Badge";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 3,
    top: 10,
    left: 10,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}));

export default function CustomizedBadges({ content, children }) {
  return (
    <IconButton aria-label="file">
      <StyledBadge
        badgeContent={content}
        color="primary"
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        max={500}
      >
        {children}
      </StyledBadge>
    </IconButton>
  );
}
