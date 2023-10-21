/**
 * 子コンポーネントを上下左右中央寄せする
 */
import { Stack, StackProps } from "@mui/material";

type CenteringProps = {
  children: React.ReactNode;
};
type Props = StackProps & CenteringProps;

const Centering = ({ children, ...stackProps }: Props) => {
  return (
    <Stack
      width="100%"
      height="100%"
      justifyContent="center"
      alignItems="center"
      {...stackProps}
    >
      {children}
    </Stack>
  );
};

export default Centering;
