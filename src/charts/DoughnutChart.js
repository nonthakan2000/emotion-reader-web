import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(Tooltip, Legend, ArcElement);

const DoughnutChart = () => {
  let data = {
    labels: [
      "ไม่แม่นยำ",
      "ช้าเกินไป",
      "ใช้งานยาก",
      "ไม่มีความเสถียร",
      "อื่น ๆ",
    ],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(54, 162, 235, 1)",
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
