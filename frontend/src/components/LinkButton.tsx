/**
 * 他のページへの遷移先を持つボタン
 */
import { Button, ButtonProps } from "@mui/material";
import Link from "next/link";

type LinkButtonProps = {
  href: string;
  variant: "text" | "contained" | "outlined";
  disabled?: boolean;
  children: React.ReactNode;
};
type Props = ButtonProps & LinkButtonProps;

const LinkButton = ({
  href,
  variant,
  disabled = false,
  children,
  ...buttonProps
}: Props) => {
  return (
    <>
      {disabled ? (
        <Button variant={variant} disabled {...buttonProps}>
          {children}
        </Button>
      ) : (
        <Link href={href}>
          <Button variant={variant} {...buttonProps}>
            {children}
          </Button>
        </Link>
      )}
    </>
  );
};

export default LinkButton;
