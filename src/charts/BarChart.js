import { Chart, BarElement, CategoryScale, LinearScale } from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement);

const BarChart = ({ dateOfBirth }) => {
  let data = {
    labels: [""],
    datasets: [
      {
        label: ["อายุ 0-14 ปี"],
        data: [dateOfBirth[0]],
        backgroundColor: ["rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
      {
        label: ["อายุ 15-24 ปี"],
        data: [dateOfBirth[1]],
        backgroundColor: ["rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
      {
        label: ["อายุ 25-59 ปี"],
        data: [dateOfBirth[2]],
        backgroundColor: ["rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
      {
        label: ["อายุ 60 ปีขึ้นไป"],
        data: [dateOfBirth[3]],
        backgroundColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
      {
        label: ["ยังไม่ได้ระบุ"],
        data: [dateOfBirth[4]],
        backgroundColor: ["#884EA0"],
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
