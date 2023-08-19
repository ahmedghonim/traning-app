import UsersInfo from "shared/UserInfo";
import NutritionInfo from "./NutritionInfo";
import HeathInfo from "./HeathInfo";
import TrainingInfo from "./TrainingInfo";

function SideBar() {
  return (
    <>
      <UsersInfo showUserInfo={false} />
      <HeathInfo />
      <NutritionInfo />
      <TrainingInfo />
    </>
  );
}

export default SideBar;