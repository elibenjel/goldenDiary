import { SunIcon } from 'native-base';
import { FaUser, FaJournalWhills } from 'react-icons/fa';
import { IoFilter, IoClose, IoHome, IoHomeOutline, IoReceipt, IoReceiptOutline, IoBarChart, IoBarChartOutline } from 'react-icons/io5';
import { BsPiggyBankFill, BsPiggyBank } from 'react-icons/bs';
import { MdSearch, MdSwapVert } from 'react-icons/md';
import { FiMoreHorizontal } from 'react-icons/fi';
import { AiFillQuestionCircle, AiOutlineQuestionCircle } from 'react-icons/ai';
import { BiListPlus } from 'react-icons/bi';

const BaseIconFamily = ({ size, color }) => {
  return <SunIcon size={size} color={color} />;
}

const MaterialCommunityIcons = ({ name, size, color }) => {
  if (name === 'swap-vertical') {
    return <MdSwapVert size={size} color={color} />;
  }

  if (name === 'piggy-bank') {
    return <BsPiggyBankFill size={size} color={color} />;
  }

  if (name === 'piggy-bank-outline') {
    return <BsPiggyBank size={size} color={color} />;
  }

  return <BaseIconFamily size={size} color={color} />;
}

const MaterialIcons = ({ name, size, color }) => {
  if (name === 'search') {
    return <MdSearch size={size} color={color} />;
  }

  return <BaseIconFamily size={size} color={color} />;
}

const Feather = ({ name, size, color }) => {
  if (name === 'more-horizontal') {
    return <FiMoreHorizontal size={size} color={color} />;
  }

  return <BaseIconFamily size={size} color={color} />;
}

const Ionicons = ({ name, size, color }) => {
  if (name === 'filter') {
    return <IoFilter size={size} color={color} />;
  }

  if (name === 'home') {
    return <IoHome size={size} color={color} />;
  }

  if (name === 'home-outline') {
    return <IoHomeOutline size={size} color={color} />;
  }

  if (name === 'receipt') {
    return <IoReceipt size={size} color={color} />;
  }

  if (name === 'receipt-outline') {
    return <IoReceiptOutline size={size} color={color} />;
  }

  if (name === 'bar-chart') {
    return <IoBarChart size={size} color={color} />;
  }

  if (name === 'bar-chart-outline') {
    return <IoBarChartOutline size={size} color={color} />;
  }
  
  return <BaseIconFamily size={size} color={color} />;
}

const AntDesign = ({ name, size, color }) => {
  if (name === 'questioncircle') {
    return <AiFillQuestionCircle size={size} color={color} />;
  }

  if (name === 'questioncircleo') {
    return <AiOutlineQuestionCircle size={size} color={color} />;
  }

  return <BaseIconFamily size={size} color={color} />;
}

const Entypo = ({ name, size, color }) => {
  if (name === 'cross') {
    return <IoClose size={size} color={color} />;
  }

  if (name === 'add-to-list') {
    return <BiListPlus size={size} color={color} />;
  }

  return <BaseIconFamily size={size} color={color} />;
}

const FontAwesome = ({ name, size, color }) => {
  if (name === 'user') {
    return <FaUser size={size} color={color} />;
  }

  return <BaseIconFamily size={size} color={color} />;
}

const FontAwesome5 = ({ name, size, color }) => {
  if (name === 'journal-whills') {
    return <FaJournalWhills size={size} color={color} />;
  }

  return <BaseIconFamily size={size} color={color} />;
}

module.exports.MaterialCommunityIcons = MaterialCommunityIcons;
module.exports.MaterialIcons = MaterialIcons;
module.exports.Feather = Feather;
module.exports.Ionicons = Ionicons;
module.exports.AntDesign = AntDesign;
module.exports.Entypo = Entypo;
module.exports.FontAwesome = FontAwesome;
module.exports.FontAwesome5 = FontAwesome5;