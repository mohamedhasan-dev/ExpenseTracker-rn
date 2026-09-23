import { View, Text } from "react-native";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import useTheme from "@/hooks/useTheme";

export type PieChartData = {
  value: number;
  color: string;
  label: string;
};

interface PieChartComponentProps {
  data: PieChartData[];
  total: number;
  centerTitle?: string;
  /** Text in the middle of the donut; defaults to the raw total */
  centerValue?: string;
  radius?: number;
  thickness?: number;
}

const PieChartComponent = ({
  data,
  total,
  centerTitle = "TOTAL",
  centerValue,
  radius = 70,
  thickness = 12,
}: PieChartComponentProps) => {
  const { colors } = useTheme();

  return (
    <View style={{ justifyContent: "center" }}>
      <PieChart
        data={data}
        donut
        radius={radius}
        innerRadius={radius - thickness}
        innerCircleColor={colors.surface}
        centerLabelComponent={() => (
          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                color: colors.text,
                opacity: 0.55,
                fontSize: 10,
                fontWeight: "600",
                letterSpacing: 1,
              }}
            >
              {centerTitle}
            </Text>
            <Text
              style={{ color: colors.text, fontSize: 18, fontWeight: "700" }}
            >
              {centerValue ?? String(total)}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default PieChartComponent;
