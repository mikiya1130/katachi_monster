import { Close } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Chip,
  IconButton,
  Modal,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { TypeMonster } from "@/app/(battle-phase)/monster-select/types";
import Image from "@/components/Image";
import { useLocale } from "@/components/LocaleProvider";
import Text from "@/components/Text";
import { images, maxWidth } from "@/consts";
import theme from "@/theme";
import { TypeImage } from "@/types";

type Props = {
  monster: TypeMonster;
  handleClose: () => void;
};

const ModalContent = ({ monster, handleClose }: Props) => {
  const router = useRouter();

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

        <Text fontSize={24}>{monster.name}</Text>

        <Stack direction="row" spacing={2}>
          {images.map(({ url, hand }: TypeImage) => {
            return (
              <Chip
                key={hand}
                avatar={<Avatar alt={hand} src={url} />}
                label={
                  hand === "gu"
                    ? monster.gu
                    : hand === "choki"
                      ? monster.choki
                      : hand === "pa"
                        ? monster.pa
                        : "-"
                }
                variant="outlined"
                sx={{ bgcolor: "white", fontSize: "1.5rem" }}
              />
            );
          })}
        </Stack>

        <Image
          src={monster.base64image}
          alt={`monster_${monster.id}`}
          width="90%"
          sx={{ border: 2, solid: "#000" }}
        />

        <Stack direction="row" spacing={4}>
          {/* <LinkButton
            href={`/view-details?monsterId=${monster.id}`}
            variant="outlined"
          >
            {locale.ModalContent.viewDetailsButton}
          </LinkButton> */}

          <Button
            variant="contained"
            onClick={() => router.replace(`/battle?monsterId=${monster.id}`)}
          >
            {locale.ModalContent.confirmButton}
          </Button>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default ModalContent;
