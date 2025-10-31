import { Link } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, Toolbar } from "@mui/material";

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          background: "#212121",
          color: "white",
        },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/help">
          <ListItemText primary="Help Requests" />
        </ListItem>
        <ListItem button component={Link} to="/locations">
          <ListItemText primary="Locations" />
        </ListItem>
      </List>
    </Drawer>
  );
}
