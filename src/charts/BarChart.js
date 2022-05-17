import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement);

const BarChart = () => {
  let data = {
    labels: [""],
    datasets: [
      {
        label: ["ไม่แม่นยำ"],
        data: [9],
        backgroundColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
      {
        label: ["ช้าเกินไป"],
        data: [4],
        backgroundColor: ["rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
      {
        label: ["ใช้งานยาก"],
        data: [12],
        backgroundColor: ["rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
      {
        label: ["ไม่มีความเสถียร"],
        data: [19],
        backgroundColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
      {
        label: ["อื่น ๆ"],
        data: [5],
        backgroundColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  let options = {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar className="chart" data={data} options={options} />
    </div>
  );
};

export default BarChart;
