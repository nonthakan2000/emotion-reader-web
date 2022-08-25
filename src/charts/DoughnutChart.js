import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(Tooltip, Legend, ArcElement);

const DoughnutChart = ({ genderData }) => {
  let data = {
    labels: ["เพศชาย", "เพศหญิง", "เพศอื่น ๆ", "ยังไม่ระบุ"],
    datasets: [
      {
        label: "# of Votes",
        data: genderData,
        backgroundColor: [
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
          "#884EA0",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Doughnut className="chart" data={data} />
    </div>
  );
};

export default DoughnutChart;
