import { MenuWidget } from "@/widgets/MenuWidget";
import { useScreen } from "@/shared/hooks/useScreenSize";

const Home = () => {
  const { width, height } = useScreen();
  return(
    <MenuWidget width={width} height={height}/>
  );
};

export default Home;
