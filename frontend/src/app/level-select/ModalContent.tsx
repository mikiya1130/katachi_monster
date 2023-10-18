import { Box, Button, Modal, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

import { TypeSelectedImageInfo } from "@/types";

type Props = {
  selectedImageInfo: TypeSelectedImageInfo;
  handleClose: () => void;
};

const ModalContent = ({ selectedImageInfo, handleClose }: Props) => {
  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    height: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
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
      <Box sx={style}>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          sx={{ position: "absolute", top: 0, right: 0 }}
        >
          ×
        </Button>

        <Typography
          id="modal-modal-description"
          sx={{ mt: 2, textAlign: "center" }}
        >
          これでいい？
        </Typography>

        <Box
          sx={{
            border: "2px solid #000",
            padding: "10px",
            mt: 2,
            ml: 6,
            mr: 6,
          }}
        >
          <Image
            src={selectedImageInfo.url}
            alt={selectedImageInfo.title}
            width={selectedImageInfo.width}
            height={selectedImageInfo.height}
          />
        </Box>

        <Link href="/view-details">
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: "100px",
              height: "50px",
              fontSize: "16px",
              mb: 2,
              ml: 1,
              mt: 2,
            }}
          >
            くわしくみる
          </Button>
        </Link>

        <Link href="/select-silhouette">
          <Button
            variant="contained"
            color="secondary"
            sx={{
              width: "100px",
              height: "50px",
              fontSize: "16px",
              mb: 2,
              ml: 1,
              mt: 2,
            }}
          >
            けってい
          </Button>
        </Link>
      </Box>
    </Modal>
  );
};

export default ModalContent;
