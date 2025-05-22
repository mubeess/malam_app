import { HisnulImage, MisbahuImage, RiyadImage, TawheedImage } from '@assets/Images';
import { StackNavigationOptions } from '@react-navigation/stack';
export const colors = {
  primary: '#2F50C1',
  disabled: '#EAE7F2',
  gray: '#A7A3B3',
  tertiary: '#306810',
  white: '#ffffff',
  black: '#000000',
  lightGray: '#757281',
  inputBg: '#F4F2F8',
  iconColor: '#58536E',
  primaryLight: '#D9E6FD',
  borderColor: '#000',
  inputBgColor: '#F4F2F8',
};

export const stackScreenOptions: StackNavigationOptions = {
  headerShown: false,
};

export const allBooks = [
  { title: 'Kitabut Tawheed', image: TawheedImage },
  { title: 'Hisnul Muslim', image: HisnulImage },
  { title: 'Misbahus Saliq', image: MisbahuImage },
  { title: 'Riyadus Salihin', image: RiyadImage },
];
