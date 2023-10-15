import { Box, Modal, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

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
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
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
        <Image
          src={selectedImageInfo.url}
          alt={selectedImageInfo.title}
          width={selectedImageInfo.width}
          height={selectedImageInfo.height}
        />
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  );
};

export default ModalContent;
