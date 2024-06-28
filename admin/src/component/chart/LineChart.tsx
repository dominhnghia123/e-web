import styles from "../../app/admin/admin.module.css";
import {Chart} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
} from "chart.js";
import {useEffect, useRef} from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface IProps {
  monthlySales: [];
}

export default function LineChart(props: IProps) {
  const {monthlySales} = props;
  const chartRef = useRef(null);

  useEffect(() => {
    const currentChartRef: any = chartRef.current;
    return () => {
      if (currentChartRef) {
        currentChartRef.destroy();
      }
    };
  }, []);

  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const totalSales = new Array(12).fill(0);
  monthlySales?.forEach((item: any) => {
    const monthIndex = parseInt(item.month, 10) - 1;
    totalSales[monthIndex] = parseFloat(item.totalSales);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Doanh thu",
        data: totalSales,
        borderColor: "#F49342",
        backgroundColor: "#F49342",
        yAxisID: "y",
      },
    ],
  };

  const options: any = {
    responsive: true,
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ doanh thu hàng tháng",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
      },
    },
  };

  return (
    <div className={styles.line_graph_container}>
      <Chart type="line" data={chartData} options={options} />
    </div>
  );
}
