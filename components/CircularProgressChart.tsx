import React from "react";
import { PieChart, ProgressChart } from "react-native-chart-kit";

const CircularProgressChart = ({
  data,
}: {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
}) => {
  return (
    <PieChart
      data={data}
      width={330}
      height={200}
      accessor="value"
      backgroundColor="transparent"
      paddingLeft="0"
      chartConfig={{
        backgroundColor: "#f9f9fc",
        backgroundGradientFrom: "#f9f9fc",
        backgroundGradientTo: "#f9f9fc",
        decimalPlaces: 0,
        color: (opacity, index) =>
          index
            ? data[index].color
            : "#1a1464" + (opacity < 9 ? "0" + opacity : opacity),
      }}
    />
  );
};

export default CircularProgressChart;
