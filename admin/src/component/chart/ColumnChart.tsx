import styles from "../../app/admin/admin.module.css";
import {Chart} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LinearScale,
  LineElement,
  LineController,
  BarController,
} from "chart.js";
import {useEffect, useRef} from "react";

ChartJS.register(
  CategoryScale,
  BarElement,
  BarController,
  LinearScale,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

interface IProps {
  countOrderForEachMonth: [];
}

export default function ColumnChart(props: IProps) {
  const {countOrderForEachMonth} = props;

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

  const totalOrders = new Array(12).fill(0);
  countOrderForEachMonth?.forEach((item: any) => {
    const monthIndex = parseInt(item.month, 10) - 1;
    totalOrders[monthIndex] = parseFloat(item.count);
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of orders",
        data: totalOrders,
        backgroundColor: "#9B6ADF",
        borderWidth: 1,
      },
    ],
  };

  const options: any = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Biểu đồ đơn hàng được đặt hàng tháng",
      },
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div className={styles.column_chart_container}>
      <Chart type="bar" data={chartData} options={options} />
    </div>
  );
}
