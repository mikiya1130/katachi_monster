import { Close } from "@mui/icons-material";
import {
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Link from "next/link";

import { TypeMonster } from "@/app/level-select/types";
import Image from "@/components/Image";
import { maxWidth } from "@/consts";
import theme from "@/theme";

type Props = {
  monster: TypeMonster;
  handleClose: () => void;
};

const ModalContent = ({ monster, handleClose }: Props) => {
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

        <Typography fontSize={24} textAlign="center">
          これでいい？
        </Typography>

        <Image
          src={monster.base64image}
          alt={`monster_${monster.id}`}
          width="90%"
          sx={{
            border: 2,
            solid: "#000",
          }}
        />

        <Stack direction="row" spacing={4}>
          <Link href={`/view-details?monsterId=${monster.id}`}>
            <Button variant="outlined">くわしくみる</Button>
          </Link>

          <Link href={`/select-silhouette?monsterId=${monster.id}`}>
            <Button variant="contained">けってい</Button>
          </Link>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ModalContent;
