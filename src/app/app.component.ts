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
  // private pieChart: am4charts.PieChart;
  private lineChart: am4charts.XYChart;

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

    console.log('dataForStackChart', dataForStackChart);

    this.chart.data = dataForStackChart;
    this.lineChart.data = dataForStackChart;

  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {

      let chart = am4core.create("chartdiv", am4charts.XYChart);

    /*   chart.data = [
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
      ]; */

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
      // series3.fill = am4core.color('#189b1b');
      // series3.stroke = am4core.color('#189b1b');
      series3.dataFields.categoryX = "CIPCircuitName";
      series3.name = "Caustic Acid";
      series3.tooltipText = "{name}: [bold]{valueY}[/]";
      series3.stacked = true;

      // Add cursor
      chart.cursor = new am4charts.XYCursor();
      this.chart = chart;


      //----------------------Line Chart--------------------------//

      let lineChart = am4core.create("chartdiv1", am4charts.XYChart);

      // Create axes
      var categoryAxis = lineChart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = "CIPCircuitName";
      categoryAxis.title.text = "CIP Circuit Name";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;

      // Create series
      function createAxisAndSeries(field, name, opposite, bullet) {
        let valueAxis = lineChart.yAxes.push(new am4charts.ValueAxis());
        /*  if (lineChart.yAxes.indexOf(valueAxis) != 0) {
           valueAxis.syncWithAxis = lineChart.yAxes.getIndex(0) as any;
         } */

        valueAxis.title.text = "CIP Counts";
        valueAxis.calculateTotals = true;
        valueAxis.min = 0;

        let series = lineChart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "CIPCircuitName";
        series.strokeWidth = 2;
        series.yAxis = valueAxis;
        series.name = name;
        series.tooltipText = "{name}: [bold]{valueY}[/]";
        series.tensionX = 0.8;
        series.showOnInit = true;

        let interfaceColors = new am4core.InterfaceColorSet();

        switch (bullet) {
          case "triangle":
            let bullet1 = series.bullets.push(new am4charts.Bullet());
            bullet1.width = 12;
            bullet1.height = 12;
            bullet1.horizontalCenter = "middle";
            bullet1.verticalCenter = "middle";

            let triangle = bullet1.createChild(am4core.Triangle);
            triangle.stroke = interfaceColors.getFor("background");
            triangle.strokeWidth = 2;
            triangle.direction = "top";
            triangle.width = 12;
            triangle.height = 12;
            break;
          case "rectangle":
            let bullet2 = series.bullets.push(new am4charts.Bullet());
            bullet2.width = 10;
            bullet2.height = 10;
            bullet2.horizontalCenter = "middle";
            bullet2.verticalCenter = "middle";

            let rectangle = bullet2.createChild(am4core.Rectangle);
            rectangle.stroke = interfaceColors.getFor("background");
            rectangle.strokeWidth = 2;
            rectangle.width = 10;
            rectangle.height = 10;
            break;
          default:
            let bullet3 = series.bullets.push(new am4charts.CircleBullet());
            bullet3.circle.stroke = interfaceColors.getFor("background");
            bullet3.circle.strokeWidth = 2;
            break;
        }

        valueAxis.renderer.line.strokeOpacity = 1;
        valueAxis.renderer.line.strokeWidth = 2;
        valueAxis.renderer.line.stroke = series.stroke;
        valueAxis.renderer.labels.template.fill = series.stroke;
        valueAxis.renderer.opposite = opposite;
      }

      createAxisAndSeries("Caustic", "Caustic", false, "circle");
      createAxisAndSeries("Acid", "Acid", true, "triangle");
      createAxisAndSeries("Caustic Acid", "Caustic Acid", true, "rectangle");

      lineChart.cursor = new am4charts.XYCursor();

      this.lineChart = lineChart;

    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
        // this.pieChart.dispose();
        this.lineChart.dispose();
      }
    });
  }
}
