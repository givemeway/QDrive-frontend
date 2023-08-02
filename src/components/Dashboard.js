import { Grid } from "@mui/material";
import NavigatePanel from "./Panel";
import Header from "./Header";
import MainPanel from "./MainPanel";

const Dashboard = () => {
  return (
    <Grid container columns={2} wrap="nowrap">
      <Grid item sx={{ width: 200 }}>
        <NavigatePanel />
      </Grid>
      <Grid item sx={{ flexGrow: 1 }}>
        <Grid container sx={{ height: "100%" }}>
          <Grid item xs={12} sx={{ height: "20%" }}>
            <Header></Header>
          </Grid>
          <Grid item xs={12} sx={{ height: "80%" }}>
            <MainPanel />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
