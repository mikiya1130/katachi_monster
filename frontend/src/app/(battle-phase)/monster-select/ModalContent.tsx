import { Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { TypeMonster } from "@/app/(battle-phase)/monster-select/types";
import Image from "@/components/Image";
import LinkButton from "@/components/LinkButton";
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
          モンスター名
        </Typography>

        <Stack direction="row" spacing={2}>
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: "black" }} variant="rounded">
                <Typography color="white" fontWeight={600}>
                  HP
                </Typography>
              </Avatar>
            }
            label="100"
            variant="outlined"
            sx={{ borderRadius: "8px", bgcolor: "white" }}
          />
          <Box>
            <Chip
              avatar={<Avatar alt="Gu" src="images/gu.png" />}
              label="32"
              variant="outlined"
            />
          </Box>
          <Chip
            avatar={<Avatar alt="Gu" src="images/choki.png" />}
            label="10"
            variant="outlined"
          />
          <Chip
            avatar={<Avatar alt="Gu" src="images/pa.png" />}
            label="51"
            variant="outlined"
          />
        </Stack>

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
          <LinkButton
            href={`/view-details?monsterId=${monster.id}`}
            variant="outlined"
          >
            くわしくみる
          </LinkButton>

          <LinkButton
            href={`/monster-battle?monsterId=${monster.id}`}
            variant="contained"
          >
            けってい
          </LinkButton>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ModalContent;
