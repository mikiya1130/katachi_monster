import SocketProvider from "@/components/SocketProvider";

type Props = {
  children: React.ReactNode;
};

const BattilePhaseLayout = ({ children }: Props) => {
  return <SocketProvider>{children}</SocketProvider>;
};

export default BattilePhaseLayout;
