import { Close } from "@mui/icons-material";
import {
  IconButton,
  Modal,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { TypeMonster } from "@/app/(create-phase)/level-select/types";
import Image from "@/components/Image";
import LinkButton from "@/components/LinkButton";
import { useLocale } from "@/components/LocaleProvider";
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

  const locale = useLocale();

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
          {locale.ModalContent.comment}
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
          <LinkButton
            href={`/view-details?monsterId=${monster.id}`}
            variant="outlined"
          >
            {locale.ModalContent.viewDetailsButton}
          </LinkButton>

          <LinkButton
            href={`/select-silhouette?monsterId=${monster.id}`}
            variant="contained"
          >
            {locale.ModalContent.confirmButton}
          </LinkButton>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ModalContent;
