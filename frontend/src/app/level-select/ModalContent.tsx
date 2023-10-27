import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";

import { maxWidth } from "@/consts";
import theme from "@/theme";
import { TypeSelectedImageInfo } from "@/types";

type Props = {
  selectedImageInfo: TypeSelectedImageInfo;
  handleClose: () => void;
};

const ModalContent = ({ selectedImageInfo, handleClose }: Props) => {
  const width = useMediaQuery(theme.breakpoints.up(maxWidth))
    ? `${theme.breakpoints.values[maxWidth]}px`
    : "100vw";

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ backgroundColor: "rgb(0,0,0,0.1)" }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={2}
        position="absolute"
        width={`calc(${width} * 0.8)`}
        bgcolor="background.paper"
        border="2px solid #000"
        p={4}
        sx={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <IconButton
          onClick={handleClose}
          color="primary"
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "10%",
            height: "10%",
          }}
        >
          <Close sx={{ width: "100%", height: "100%" }} />
        </IconButton>

        <Typography
          fontSize={24}
          id="modal-modal-description"
          sx={{ textAlign: "center" }}
        >
          これでいい？
        </Typography>

        <Box
          component="img"
          src={selectedImageInfo.url}
          alt={selectedImageInfo.title}
          sx={{
            mt: 2,
            border: 2,
            solid: "#000",
            width: "90%",
            height: "90%",
            aspectRatio: 1,
            objectFit: "contain",
          }}
        />

        <Stack direction="row" spacing={4}>
          <Link href="/view-details">
            <Button variant="outlined">くわしくみる</Button>
          </Link>

          <Link href="/select-silhouette">
            <Button variant="contained">けってい</Button>
          </Link>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ModalContent;
