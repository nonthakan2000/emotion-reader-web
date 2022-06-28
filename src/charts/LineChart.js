import {
  Chart,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Line } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, LineElement, PointElement);

const LineChart = () => {
  let data = {
    labels: [
      "1 กุมภาพันธ์",
      "2 กุมภาพันธ์",
      "3 กุมภาพันธ์",
      "4 กุมภาพันธ์",
      "5 กุมภาพันธ์",
      "6 กุมภาพันธ์",
      "7 กุมภาพันธ์",
    ],
    datasets: [
      {
        label: "ผู้ใช้งานด้วย Google",
        data: [40, 30, 70, 60, 55, 20, 35],
        backgroundColor: ["rgba(255, 206, 86, 1)"],
        borderColor: ["rgba(255, 206, 86, 1)"],
        borderWidth: 3,
      },
      {
        label: "ผู้ใช้งานแบบไม่ระบุตัวตน",
        data: [20, 50, 70, 65, 23, 42, 65],
        backgroundColor: ["rgba(75, 192, 192, 1)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 3,
      },
      {
        label: "ผู้ใช้งานทั้งหมด",
        data: [60, 80, 140, 125, 78, 62, 100],
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
