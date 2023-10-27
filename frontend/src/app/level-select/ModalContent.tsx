import { Close } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";

import { TypeSelectedImageInfo } from "@/types";

type Props = {
  selectedImageInfo: TypeSelectedImageInfo;
  handleClose: () => void;
};

const ModalContent = ({ selectedImageInfo, handleClose }: Props) => {
  const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(100svh * 0.8)",
    height: "calc(100svh * 0.8)",
    bgcolor: "background.paper",
    border: 2,
    solid: "#000",
    boxShadow: 21,
    p: 4,
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={modalStyle}
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
          fontSize={40}
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
            width: "60%",
            height: "60%",
            aspectRatio: 1,
            objectFit: "contain",
          }}
        />

        <Stack direction="row" spacing={4}>
          <Link href="/view-details">
            <Button variant="outlined" size="large">
              くわしくみる
            </Button>
          </Link>

          <Link href="/select-silhouette">
            <Button variant="contained" size="large">
              けってい
            </Button>
          </Link>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ModalContent;
