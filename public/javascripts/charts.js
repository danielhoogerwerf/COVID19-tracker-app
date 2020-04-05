console.log('chart file')

var ctx = document.getElementById("barChart").getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["1 feb","2 feb","3 feb","4 feb","5 feb","6 feb","7 feb","8 feb","9 feb","10 feb","11 feb"],
        datasets: [{
            label: 'Hospitalized',
            backgroundColor: "#f6c23",
            data: [1, 1, 2, 3, 5,5, 7, 7, 8,10,16],
        }, {
            label: 'Intensive care',
            backgroundColor: "#e74a3b",
            data: [0, 0, 1, 1, 1,1, 2, 2, 2,3,5],
        }, {
            label: 'Deceased',
            backgroundColor: "#212529",
            data: [0, 0, 0, 0, 1, 1, 1, 1, 1,2,4],
        },
        {
            label: 'Recovered',
            backgroundColor: "#1cc88a",
            data: [0, 0, 0,0, 0, 0, 0, 1, 2,4,7],
        }
    
    ],
    },
options: {
    tooltips: {
      displayColors: true,
      callbacks:{
        mode: 'x',
      },
    },
    scales: {
      xAxes: [{
        stacked: true,
        gridLines: {
          display: false,
        }
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          beginAtZero: true,
        },
        type: 'linear',
      }]
    },
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom' },
    }
});
