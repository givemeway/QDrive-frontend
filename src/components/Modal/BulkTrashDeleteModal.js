import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import FolderIcon from "../icons/FolderIcon";
import CustomizedBadges from "../Badge/Badge";
import { TrashContext } from "../UseContext";
import {
  Button,
  CircularProgress,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from "@mui/material";
import { FixedSizeList } from "react-window";
import useFetchTrashBatch from "../hooks/FetchTrashBatchHook";
import { get_file_icon, svgIconStyle } from "../fileFormats/FileFormat";
import CollapsibleBreadCrumbs from "../breadCrumbs/CollapsibleBreadCrumbs";
import useRestoreItems from "../hooks/RestoreItemHook";
import useDeleteTrashItems from "../hooks/DeleteTrashItemsHook";

const options = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
};

const headingStyle = { fontSize: 18, color: "#1A1918", fontWeight: 600 };

const listItemIconStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "10%",
};

const scrollContainerHeaderStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  height: 50,
  borderBottom: "1px solid #BBB5AE",
};

const scrollContainerHeaderTextStyle = {
  marginLeft: 2,
  fontSize: 16,
  color: "#1A1918",
};

const listItemTextRowStyle = {
  display: "flex",
  flexDirection: "row",
  width: "70%",
  flexGrow: 1,
};

const listItemTextFlexColumn = { display: "flex", flexDirection: "column" };

const listItemStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-evenly",
  alignItems: "center",
  borderBottom: "1px solid #DFDCD8",
};

const mainContainerStyle = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  height: 450,
  bgcolor: "background.paper",
  border: "2px solid #737373",
  //   boxShadow: 10,
  p: 4,
};

const scrollContainerStyle = {
  height: 350,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  overflow: "auto",
  border: "1px solid #BBB5AE",
  borderRadius: "2px",
  marginTop: 2,
};

const cancelButtonStyle = {
  background: "#F5EFE5E0",
  color: "#1A1918",
  textTransform: "none",
  width: 75,
  fontWeight: 900,
  "&:hover": { background: "#F5EFE5" },
};

const restoreAllButtonStyle = {
  background: "#0061FEE0",
  fontWeight: 900,
  color: "#F2F7FF",
  "&:hover": { background: "#0061FE" },
  textTransform: "none",
};

const buttonContainer = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  gap: 1,
  marginTop: 2,
};

function EllipsisTypoGraphy({ children }) {
  return (
    <Typography variant="body2" noWrap={true}>
      {children}
    </Typography>
  );
}

export default function BulkTrashDeleteModal() {
  const {
    openBulkTrashDelete,
    setOpenBulkTrashDelete,
    selectedItems,
    setRestoring,
  } = React.useContext(TrashContext);

  const [loading, setLoading] = React.useState(true);
  const [allItems, setAllItems] = React.useState([]);
  const [deleteTrash, deleteStatus, init] = useDeleteTrashItems(selectedItems);
  const handleRestore = () => {
    // setOpenBulkTrashDelete(false);
    init();
  };

  React.useEffect(() => {
    if (deleteTrash) {
      setRestoring(true);
    } else {
      setRestoring(false);
    }
  }, [deleteTrash, deleteStatus]);

  React.useEffect(() => {
    setAllItems(selectedItems);
    setLoading(false);
  }, []);

  const handleClose = () => setOpenBulkTrashDelete(false);

  const getCount = (item) => {
    let count = 0;
    if (item?.items) {
      item.items.forEach((i) => (count += i.count));
    } else {
      count += item.end - item.begin;
    }
    console.log(count);
    return count;
  };

  function RenderRows({ style, index }) {
    return (
      <ListItem
        style={style}
        key={allItems[index].id}
        component="div"
        disablePadding
        sx={listItemStyle}
      >
        <ListItemIcon sx={listItemIconStyle}>
          {allItems[index]?.item === "folder" && (
            <CustomizedBadges content={getCount(allItems[index])}>
              <FolderIcon style={svgIconStyle} />
            </CustomizedBadges>
          )}
          {allItems[index]?.item == "singleFile" &&
            get_file_icon(allItems[index].name)}

          {allItems[index]?.item == "file" &&
            get_file_icon(allItems[index].name)}
        </ListItemIcon>
        <Stack sx={listItemTextRowStyle}>
          <ListItemText
            primary={
              <Box sx={listItemTextFlexColumn}>
                <EllipsisTypoGraphy>{allItems[index].name}</EllipsisTypoGraphy>
                <CollapsibleBreadCrumbs
                  path={allItems[index]?.path}
                  id={allItems[index].id}
                  style={{ fontSize: 10 }}
                />
              </Box>
            }
            sx={{
              width: "60%",
            }}
          />
          <ListItemText
            primary={
              <EllipsisTypoGraphy>{allItems[index].deleted}</EllipsisTypoGraphy>
            }
            sx={{ width: "40%" }}
          />
        </Stack>
      </ListItem>
    );
  }

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={openBulkTrashDelete}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={openBulkTrashDelete}>
        <Box sx={mainContainerStyle}>
          {/* <Typography sx={headingStyle}>{selectedItems[0].name}</Typography> */}
          <Box sx={scrollContainerStyle}>
            {loading && <CircularProgress />}
            {!loading && (
              <React.Fragment>
                <Box sx={scrollContainerHeaderStyle}>
                  <Typography
                    variant={"span"}
                    sx={scrollContainerHeaderTextStyle}
                  >
                    Name
                  </Typography>
                  <Typography
                    variant={"span"}
                    sx={{ ...scrollContainerHeaderTextStyle, marginRight: 2 }}
                  >
                    Deleted
                  </Typography>
                </Box>
                <FixedSizeList
                  itemCount={allItems.length}
                  itemSize={50}
                  height={300}
                  width={"100%"}
                >
                  {RenderRows}
                </FixedSizeList>
              </React.Fragment>
            )}
          </Box>
          <Box sx={buttonContainer}>
            <Button
              variant="contained"
              disableRipple
              sx={cancelButtonStyle}
              onClick={() => setOpenBulkTrashDelete(false)}
            >
              Cancel
            </Button>
            <Button
              disableRipple
              variant="contained"
              sx={restoreAllButtonStyle}
              onClick={handleRestore}
            >
              Permanently Delete all (or selected) Items
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
