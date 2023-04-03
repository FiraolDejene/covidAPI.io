const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

fetch("https://api.covid19api.com/summary", requestOptions)
    .then(response => response.json())
    .then(data => {
        const globalData = data.Global;

        // Create the chart
        Highcharts.chart('chart', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'COVID-19 Global Summary'
            },
            xAxis: {
                categories: ['Total Confirmed', 'Total Deaths', 'Total Recovered']
            },
            yAxis: {
                title: {
                    text: 'Number of Cases'
                }
            },
            series: [{
                name: 'Global Cases',
                data: [globalData.TotalConfirmed, globalData.TotalDeaths, globalData.TotalRecovered]
            }]
        });


        const countries = data.Countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed).slice(0, 9);
        const countryData = countries.map(country => [country.Country, country.TotalConfirmed]);
        Highcharts.chart('chartcon', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45
                }
            },
            title: {
                text: ' Nine country covid-19 pie chart ',
                align: 'left'
            },
            subtitle: {
                text: '3D donut in Highcharts',
                align: 'left'
            },
            plotOptions: {
                pie: {
                    innerSize: 100,
                    depth: 45
                }
            },
            series: [{
                name: 'Medals',
                data: countryData


            }]
        });



    })
    .catch(error => console.log('error', error));


//card fetching part

function fetchData() {
    fetch('https://api.covid19api.com/summary')
        .then(response => response.json())
        .then(data => {
            // Get the latest global data
            const globalData = data.Global;

            // Set the text content of the paragraphs with the data
            document.getElementById("confirmed-cases").textContent = globalData.TotalConfirmed.toLocaleString();
            document.getElementById("fatal-cases").textContent = globalData.TotalDeaths.toLocaleString();
            document.getElementById("recovered-cases").textContent = globalData.TotalRecovered.toLocaleString();
            document.getElementById("active-cases").textContent = (globalData.TotalConfirmed - globalData.TotalDeaths - globalData.TotalRecovered).toLocaleString();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}
setInterval(fetchData, 10);

// function getData() {
const url = "https://api.covid19api.com/summary";
fetch(url)
    .then(response => response.json())
    .then(data => {
        const global = data.Global;
        const countries = data.Countries;

        // Create a bar chart of total cases by country
        const countryNames = countries.map(country => country.Country);
        const totalCases = countries.map(country => country.TotalConfirmed);


        Highcharts.chart("total-cases-chart", {
            chart: {
                type: "column"
            },
            title: {
                text: "Total Confirmed Cases by Country"
            },
            xAxis: {
                categories: countryNames,
                title: {
                    text: "Country"
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Total Confirmed Cases"
                }
            },
            series: [{
                name: "Total Confirmed Cases",
                data: totalCases
            }]
        });

        // Create a pie chart of global deaths and recoveries
        const deaths = global.TotalDeaths;
        const recoveries = global.TotalRecovered;
        Highcharts.chart("global-data-chart", {
            chart: {
                type: "pie"
            },
            title: {
                text: "Global COVID-19 Data"
            },
            series: [{
                name: "Count",
                data: [{
                    name: "Total Deaths",
                    y: deaths,
                    color: "rgba(255, 99, 132, 0.2)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1
                }, {
                    name: "Total Recoveries",
                    y: recoveries,
                    color: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1
                }]
            }]


        });



    })
    .catch(error => {
        console.error(error);
    });
// }


//map js
// Retrieve data from API
fetch('https://api.covid19api.com/summary')
    .then(response => response.json())
    .then(data => {
        // Format data for Highcharts map
        var mapData = data.Countries.map(country => ({
            name: country.Country,
            value: country.TotalConfirmed,
            code: country.CountryCode
        }));

        // Create Highcharts map
        Highcharts.mapChart('container', {
            chart: {
                map: 'custom/world'
            },
            title: {
                text: 'COVID-19 Cases by Country'
            },
            series: [{
                data: mapData,
                name: 'Cases',
                joinBy: ['iso-a2', 'code'],
                mapData: Highcharts.maps['custom/world'],
                tooltip: {
                    pointFormat: '{point.name}: {point.value}'
                }
            }]
        });
    })
    .catch(error => console.error(error));


//table js
function getData() {
    const url = "https://api.covid19api.com/summary";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const global = data.Global;
            const countries = data.Countries;

            // Create a bar chart of total cases by country
            const countryNames = countries.map(country => country.Country);
            const totalCases = countries.map(country => country.TotalConfirmed);

            const tableRows = countries.map(country => {
                return `
                    <tr>
            <td>${country.Country}</td>
            <td>${country.TotalConfirmed}</td>
            <td>${country.TotalDeaths}</td>
            <td>${country.TotalRecovered}</td>
                   </tr>`;
            });

            const tableBody = document.querySelector("tbody");
            tableBody.innerHTML = tableRows.join("");



            // Add filter search
            const searchInput = document.getElementById("searchInput");
            searchInput.addEventListener("input", () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredRows = countries.filter(country =>
                    country.Country.toLowerCase().includes(searchTerm)
                );
                const filteredTableRows = filteredRows.map(country => {
                    return `
          <tr>
            <td>${country.Country}</td>
            <td>${country.TotalConfirmed}</td>
            <td>${country.TotalDeaths}</td>
            <td>${country.TotalRecovered}</td>
          </tr>
         `;
                });
                tableBody.innerHTML = filteredTableRows.join("");
            });





        })
        .catch(error => {
            console.error(error);
        });
}

//searchpage js part