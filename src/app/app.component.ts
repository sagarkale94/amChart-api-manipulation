import { Component, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DataService } from './data.service';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private chart: am4charts.XYChart;
  private pieChart: am4charts.PieChart;

  constructor(
    private zone: NgZone,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getMockData();
  }

  getMockData() {
    this.dataService.getMockData().subscribe(
      resp => {
        this.formatAPIDataForStackChart(resp.Data, "CIPCircuitName", "CIPProgram");
      }
    );
  }

  formatAPIDataForStackChart(apiData, xAxis: string, yAxis: string) {

    let uniqueXAxis = [...new Set(apiData.map(item => item[xAxis]))];
    let uniqueYAxis = [...new Set(apiData.map(item => item[yAxis]))];

    let dataForStackChart = [];

    for (let index = 0; index < uniqueXAxis.length; index++) {
      dataForStackChart.push({});
      dataForStackChart[index][xAxis] = uniqueXAxis[index];
      for (let index1 = 0; index1 < uniqueYAxis.length; index1++) {
        dataForStackChart[index][(uniqueYAxis[index1]).toString()] = 0;
      }
    }

    for (let crrApiData of apiData) {
      for (let crrDataForStackChart of dataForStackChart) {
        if (crrDataForStackChart[xAxis] == crrApiData[xAxis]) { //CIPCircuitName matches
          for (let yAxisValue of uniqueYAxis) {
            if (crrApiData[yAxis] == yAxisValue) { //CIPProgramName matches
              crrDataForStackChart[yAxisValue.toString()] = crrDataForStackChart[yAxisValue.toString()] + 1;
            }
          }
        }
      }
    }

    console.log('dataForStackChart  :  ', dataForStackChart);
    this.chart.data = dataForStackChart;

  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {

      let chart = am4core.create("chartdiv", am4charts.XYChart);

      chart.data = [
        {
          "CIPCircuitName": "TestCircuit1",
          "Caustic": 36,
          "Acid": 15,
          "Caustic Acid": 8
        },
        {
          "CIPCircuitName": "TestCircuit2",
          "Caustic": 21,
          "Acid": 15,
          "Caustic Acid": 55
        },
        {
          "CIPCircuitName": "TestCircuit3",
          "Caustic": 5,
          "Acid": 45,
          "Caustic Acid": 29
        }
      ];

      // Create axes
      var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "CIPCircuitName";
      categoryAxis.title.text = "CIP Circuit Name";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;


      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = "CIP Counts";
      valueAxis.calculateTotals = true;
      valueAxis.min = 0;

      // Create series
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "Caustic";
      // series.dataFields.valueYShow = "total";
      series.dataFields.categoryX = "CIPCircuitName";
      series.name = "Caustic";
      series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = true;

      var series2 = chart.series.push(new am4charts.ColumnSeries());
      series2.dataFields.valueY = "Acid";
      // series2.dataFields.valueYShow = "total";
      series2.dataFields.categoryX = "CIPCircuitName";
      series2.name = "Acid";
      series2.tooltipText = "{name}: [bold]{valueY}[/]";
      series2.stacked = true;

      var series3 = chart.series.push(new am4charts.ColumnSeries());
      series3.dataFields.valueY = "Caustic Acid";
      // series3.dataFields.valueYShow = "total";
      series3.fill = am4core.color('#eee');
      series3.stroke = am4core.color('#eee');
      series3.dataFields.categoryX = "CIPCircuitName";
      series3.name = "Caustic Acid";
      series3.tooltipText = "{name}: [bold]{valueY}[/]";
      series3.stacked = true;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      this.chart = chart;

      // Create chart instance
      let pieChart = am4core.create("chartdiv1", am4charts.PieChart);
      pieChart.data = [
        {
          "CIPProgram": "Caustic",
          "Count": 36
        },
        {
          "CIPProgram": "Acid",
          "Count": 5
        },
        {
          "CIPProgram": "Caustic Acid",
          "Count": 25
        }
      ];

      pieChart.radius = 135;

      let title = pieChart.titles.create();
      title.text = "TestCircuit1";

      let pieSeries = pieChart.series.push(new am4charts.PieSeries());
      pieSeries.dataFields.value = "Count";
      pieSeries.dataFields.category = "CIPProgram";
      pieSeries.colors.list = ["#388E3C", "#FBC02D", "#0288d1"].map(function (color) {
        return am4core.color(color);
      });

      pieSeries.labels.template.text = "{category}: {value.value}";
      pieSeries.slices.template.tooltipText = "{category}: {value.value}";

      this.pieChart = pieChart;

    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
        this.pieChart.dispose();
      }
    });
  }
}
