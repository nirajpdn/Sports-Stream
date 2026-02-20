import type { ComponentType, FC } from "react";
import { useEffect, useState } from "react";

type LottieProps = {
  animationData: unknown;
  loop?: boolean;
  autoplay?: boolean;
};

type LottieComponent = ComponentType<LottieProps>;

const ClientLottie: FC<LottieProps> = (props) => {
  const [Lottie, setLottie] = useState<LottieComponent | null>(null);

  useEffect(() => {
    let mounted = true;
    const mod = require("lottie-react");
    if (mounted) {
      setLottie(() => mod.default as LottieComponent);
    }

    return () => {
      mounted = false;
    };
  }, []);

  if (!Lottie) {
    return null;
  }

  return <Lottie {...props} />;
};

export default ClientLottie;
