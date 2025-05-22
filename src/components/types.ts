import { ReactElement } from "react";
import { ViewStyle } from "react-native";

export type ButtonProps = {
    IconRight?: ReactElement;
    IconLeft?: ReactElement;
    isLoading?: boolean;
    onPress?: () => void;
    label: string;
    style?: ViewStyle;
    disabled?: boolean;
    backgroundColor?: string;
    testId?: string;
    fontColor?: string;
  };