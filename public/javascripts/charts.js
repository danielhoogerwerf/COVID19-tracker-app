const colorScheme = (colour) => {
  switch (colour) {
    case "Deceased": return "#212529";
    case "Home": return "#248db2";
    case "Hospitalized": return "#f6c23";
    case "IC": return "#e74a3b";
    case "Recovered": return "#1cc88a";
    default: return "#6fa24e";
  }
}

const outbreakChart = (datas) => {
  const arrDates = Object.keys(datas);
  //const arrStatusKeys = arrDates.map((x) => Object.keys(datas[x]));
  //const arrStatusValues = arrDates.map((x) => Object.values(datas[x]));
  // console.log(arrDates.length);
  // console.log(arrStatusKeys);
  // console.log(arrStatusValues);
  const deceasedArr = [];
  const homeArr = [];
  const hospitalizedArr = [];
  const icArr = [];
  const recoveredArr = [];

  for (let i=0;i<arrDates.length;i++) {
    console.log('loop')
    deceasedArr.push(!datas[arrDates[i]].Deceased ? 0 : datas[arrDates[i]].Deceased);
    homeArr.push(!datas[arrDates[i]].Home ? 0 : datas[arrDates[i]].Home);
    hospitalizedArr.push(!datas[arrDates[i]].Hospitalized ? 0 : datas[arrDates[i]].Hospitalized);
    icArr.push(!datas[arrDates[i]].IC ? 0 : datas[arrDates[i]].IC);
    recoveredArr.push(!datas[arrDates[i]].Recovered ? 0 : datas[arrDates[i]].Recovered);
  }
  
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


  // const chart = new Chart(ctx, {
  //   type: "bar",
  //   data: {
  //     labels: ["1 feb", "2 feb", "3 feb", "4 feb", "5 feb", "6 feb", "7 feb", "8 feb", "9 feb", "10 feb", "11 feb"],
  //     datasets: [
  //       {
  //         label: "Hospitalized",
  //         backgroundColor: "#f6c23",
  //         data: [1, 1, 2, 3, 5, 5, 7, 7, 8, 10, 16],
  //       },
  //       {
  //         label: "Intensive care",
  //         backgroundColor: "#e74a3b",
  //         data: [0, 0, 1, 1, 1, 1, 2, 2, 2, 3, 5],
  //       },
  //       {
  //         label: "Deceased",
  //         backgroundColor: "#212529",
  //         data: [0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 4],
  //       },
  //       {
  //         label: "Recovered",
  //         backgroundColor: "#1cc88a",
  //         data: [0, 0, 0, 0, 0, 0, 0, 1, 2, 4, 7],
  //       },
  //     ],
  //   },
  //   options: {
  //     tooltips: {
  //       displayColors: true,
  //       callbacks: {
  //         mode: "x",
  //       },
  //     },
  //     scales: {
  //       xAxes: [
  //         {
  //           stacked: true,
  //           gridLines: {
  //             display: false,
  //           },
  //         },
  //       ],
  //       yAxes: [
  //         {
  //           stacked: true,
  //           ticks: {
  //             beginAtZero: true,
  //           },
  //           type: "linear",
  //         },
  //       ],
  //     },
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     legend: { position: "bottom" },
  //   },
  // });
};
