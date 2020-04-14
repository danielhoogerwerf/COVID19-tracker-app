// Colour scheme for the stacked bar chart
const colorScheme = (colour) => {
  switch (colour) {
    case "Deceased":
      return "#212529";
    case "Home":
      return "#248db2";
    case "Hospitalized":
      return "#f6c23";
    case "IC":
      return "#e74a3b";
    case "Recovered":
      return "#1cc88a";
    default:
      return "#6fa24e";
  }
};

const outbreakChart = (datas) => {
  const arrDates = Object.keys(datas);
  const deceasedArr = [];
  const homeArr = [];
  const hospitalizedArr = [];
  const icArr = [];
  const recoveredArr = [];

  // take the number of dates, then go through the Objects to retrieve datas[date[iteration]].STATE
  // Check for undefined and if so, return a 0. Necessary if not all STATEs have data.
  for (let i = 0; i < arrDates.length; i++) {
    deceasedArr.push(!datas[arrDates[i]].Deceased ? 0 : datas[arrDates[i]].Deceased);
    homeArr.push(!datas[arrDates[i]].Home ? 0 : datas[arrDates[i]].Home);
    hospitalizedArr.push(!datas[arrDates[i]].Hospitalized ? 0 : datas[arrDates[i]].Hospitalized);
    icArr.push(!datas[arrDates[i]].IC ? 0 : datas[arrDates[i]].IC);
    recoveredArr.push(!datas[arrDates[i]].Recovered ? 0 : datas[arrDates[i]].Recovered);
  }

  // Make the stacked bar chart using the above arrays for the data
  const ctx = document.getElementById("barChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: arrDates,
      datasets: [
        {
          label: "Deceased",
          backgroundColor: colorScheme("Deceased"),
          data: deceasedArr,
        },
        {
          label: "Home",
          backgroundColor: colorScheme("Home"),
          data: homeArr,
        },
        {
          label: "Hospitalized",
          backgroundColor: colorScheme("Hospitalized"),
          data: hospitalizedArr,
        },
        {
          label: "IC",
          backgroundColor: colorScheme("IC"),
          data: icArr,
        },
        {
          label: "Recovered",
          backgroundColor: colorScheme("Recovered"),
          data: recoveredArr,
        },
      ],
    },
    options: {
      tooltips: {
        displayColors: true,
        callbacks: {
          mode: "x",
        },
      },
      scales: {
        xAxes: [
          {
            stacked: true,
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            stacked: true,
            ticks: {
              beginAtZero: true,
            },
            type: "linear",
          },
        ],
      },
      responsive: true,
      maintainAspectRatio: false,
      legend: { position: "bottom" },
    },
  });
};
