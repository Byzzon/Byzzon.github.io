const ctx = document.getElementById("my-graph");

const data = {
  labels: ["Spent", "Remaining"],
  datasets: [
    {
      label: "EUR",
      data: [userProfile.totalExpenses, userProfile.budget],
      backgroundColor: ["rgb(67, 90, 247)", "rgb(255,195,0)"],
      hoverOffset: 4,
    },
  ],
};

const chart = new Chart(ctx, {
  type: "doughnut",
  data: data,
  options: {
    responsive: true,
    borderColor: "rgba(0, 0, 0, 0)",
    cutout: "80%",
    borderRadius: 35,
    spacing: -12,
    color: "#fff",
    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
          },
        },
        position: "bottom",
        align: "start",
        display: false,
      },
    },
  },
});

export const refreshChart = () => {
  chart.data.datasets[0].data[0] = userProfile.totalExpenses;
  chart.data.datasets[0].data[1] = userProfile.budget;
  chart.update();
};
