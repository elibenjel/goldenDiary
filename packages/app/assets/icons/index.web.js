import { SunIcon } from "native-base";

const BaseIconFamily = ({ name, size, color }) => {
  return <SunIcon size={size} color={color} />;
}

module.exports.MaterialCommunityIcons = BaseIconFamily;
module.exports.Feather = BaseIconFamily;
module.exports.Ionicons = BaseIconFamily;
module.exports.AntDesign = BaseIconFamily;
module.exports.FontAwesome5 = BaseIconFamily;
module.exports.FontAwesome = BaseIconFamily;