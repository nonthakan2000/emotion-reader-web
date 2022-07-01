import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, LineElement, PointElement);

const LineChart = ({ arrLabels, arrGooles, arrAnonymous, arrTotals }) => {
  let data = {
    labels: arrLabels,
    datasets: [
      {
        label: "ผู้ใช้งานด้วย Google",
        data: arrGooles,
        backgroundColor: ["rgba(255, 206, 86, 1)"],
        borderColor: ["rgba(255, 206, 86, 1)"],
        borderWidth: 3,
      },
      {
        label: "ผู้ใช้งานแบบไม่ระบุตัวตน",
        data: arrAnonymous,
        backgroundColor: ["rgba(75, 192, 192, 1)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 3,
      },
      {
        label: "ผู้ใช้งานทั้งหมด",
        data: arrTotals,
        backgroundColor: ["#695CFE"],
        borderColor: ["#695CFE"],
        borderWidth: 3,
      },
    ],
  };

  let options = {
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Line className="chart" data={data} options={options} />
    </div>
  );
};

export default LineChart;
