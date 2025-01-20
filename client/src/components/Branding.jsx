import { Box, Typography } from "@mui/material";
import { ClipboardList } from "lucide-react";

export default function Branding(props) {
  return (
    <Box sx={{ textAlign: "center", mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <ClipboardList size={48} color={props.theme.palette.primary.main} />
      </Box>
      <Typography variant="h3" component="h1" gutterBottom>
        Task Tracker
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Manage your tasks efficiently
      </Typography>
    </Box>
  );
}
