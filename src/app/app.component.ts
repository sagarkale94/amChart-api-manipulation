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

  //Feature 1
  //Feature 2

  /* chart.data = [
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

  private stackedChart: am4charts.XYChart;
  private lineChart: am4charts.XYChart;

  constructor(
    private zone: NgZone,
    private dataService: DataService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.getMockData();
  }

  getMockData() {
    this.dataService.getMockData().subscribe(
      resp => {

        let xAxisHeader = "CIPCircuitName";
        let xAxisHeaderAlias = "CIP Circuit Name";

        let yAxisHeader = "CIPProgram";
        let yAxisHeaderAlias = "CIP Program";

        this.formatAPIDataForStackChart(resp.Data, xAxisHeader, xAxisHeaderAlias, yAxisHeader, yAxisHeaderAlias);
        this.formatAPIDataForLineChart(resp.Data, xAxisHeader, xAxisHeaderAlias, yAxisHeader, yAxisHeaderAlias);

      }
    );
  }

  formatAPIDataForStackChart(
    apiData,
    xAxisHeader: string,
    xAxisHeaderAlias: string,
    yAxisHeader: string,
    yAxisHeaderAlias: string
  ) {

    let uniqueXAxis = [...new Set(apiData.map(item => item[xAxisHeader]))];
    let uniqueYAxis = [...new Set(apiData.map(item => item[yAxisHeader]))];

    let dataForStackChart = [];

    for (let i = 0; i < uniqueXAxis.length; i++) {
      dataForStackChart.push({});
      dataForStackChart[i][xAxisHeader] = uniqueXAxis[i];
      for (let j = 0; j < uniqueYAxis.length; j++) {
        dataForStackChart[i][(uniqueYAxis[j]).toString()] = 0;
      }
    }

    for (let crrApiData of apiData) {
      for (let crrDataForStackChart of dataForStackChart) {
        if (crrDataForStackChart[xAxisHeader] == crrApiData[xAxisHeader]) { //CIPCircuitName matches
          for (let yAxisValue of uniqueYAxis) {
            if (crrApiData[yAxisHeader] == yAxisValue) { //CIPProgramName matches
              crrDataForStackChart[yAxisValue.toString()] = crrDataForStackChart[yAxisValue.toString()] + 1;
            }
          }
        }
      }
    }

    this.renderStackChart(
      dataForStackChart,
      xAxisHeader,
      xAxisHeaderAlias,
      yAxisHeader,
      yAxisHeaderAlias,
      uniqueYAxis
    );

  }

  formatAPIDataForLineChart(
    apiData,
    xAxisHeader: string,
    xAxisHeaderAlias: string,
    yAxisHeader: string,
    yAxisHeaderAlias: string
  ) {

    let uniqueXAxis = [...new Set(apiData.map(item => item[xAxisHeader]))];
    let uniqueYAxis = [...new Set(apiData.map(item => item[yAxisHeader]))];

    let dataForLineChart = [];

    for (let i = 0; i < uniqueXAxis.length; i++) {
      dataForLineChart.push({});
      dataForLineChart[i][xAxisHeader] = uniqueXAxis[i];
      for (let j = 0; j < uniqueYAxis.length; j++) {
        dataForLineChart[i][(uniqueYAxis[j]).toString()] = 0;
      }
    }

    for (let crrApiData of apiData) {
      for (let crrDataForStackChart of dataForLineChart) {
        if (crrDataForStackChart[xAxisHeader] == crrApiData[xAxisHeader]) { //CIPCircuitName matches
          for (let yAxisValue of uniqueYAxis) {
            if (crrApiData[yAxisHeader] == yAxisValue) { //CIPProgramName matches
              crrDataForStackChart[yAxisValue.toString()] = crrDataForStackChart[yAxisValue.toString()] + 1;
            }
          }
        }
      }
    }

    this.renderLineChart(
      dataForLineChart,
      xAxisHeader,
      xAxisHeaderAlias,
      yAxisHeader,
      yAxisHeaderAlias,
      uniqueYAxis
    );

  }

  renderStackChart(
    dataForStackChart,
    xAxisHeader: string,
    xAxisHeaderAlias: string,
    yAxisHeader: string,
    yAxisHeaderAlias: string,
    uniqueYAxis
  ) {

    this.zone.runOutsideAngular(() => {

      let stackedChart = am4core.create("chartdiv", am4charts.XYChart);

      stackedChart.data = dataForStackChart;

      var categoryAxis = stackedChart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = xAxisHeader;
      categoryAxis.title.text = xAxisHeaderAlias;
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.minGridDistance = 20;

      var valueAxis = stackedChart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = yAxisHeaderAlias;
      valueAxis.calculateTotals = true;
      valueAxis.min = 0;

      let arrSeriesVariables = [];
      for (let k = 0; k < uniqueYAxis.length; k++) {
        arrSeriesVariables.push(stackedChart.series.push(new am4charts.ColumnSeries()));
        arrSeriesVariables[k].dataFields.valueY = uniqueYAxis[k];
        arrSeriesVariables[k].dataFields.categoryX = xAxisHeader;
        arrSeriesVariables[k].name = uniqueYAxis[k];
        arrSeriesVariables[k].tooltipText = "{name}: [bold]{valueY}[/]";
        arrSeriesVariables[k].stacked = true;
      }

      stackedChart.cursor = new am4charts.XYCursor();
      this.stackedChart = stackedChart;

    });
  }

  renderLineChart(
    dataForLineChart,
    xAxisHeader: string,
    xAxisHeaderAlias: string,
    yAxisHeader: string,
    yAxisHeaderAlias: string,
    uniqueYAxis
  ) {

    let lineChart = am4core.create("chartdiv1", am4charts.XYChart);

    lineChart.data = dataForLineChart

    var categoryAxis = lineChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = xAxisHeader;
    categoryAxis.title.text = xAxisHeaderAlias;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;

    for (let l = 0; l < uniqueYAxis.length; l++) {
      this.createAxisAndSeries(
        lineChart,
        yAxisHeaderAlias,
        xAxisHeader,
        uniqueYAxis[l],
        uniqueYAxis[l],
        (l == 0 ? false : true),
        "circle"
      );
    }

    lineChart.cursor = new am4charts.XYCursor();
    this.lineChart = lineChart;

  }

  createAxisAndSeries(lineChart, yAxisHeaderAlias, xAxisHeader, field, name, opposite, bullet) {

    let valueAxis = lineChart.yAxes.push(new am4charts.ValueAxis());

    valueAxis.title.text = yAxisHeaderAlias;
    valueAxis.calculateTotals = true;
    valueAxis.min = 0;

    let series = lineChart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = field;
    series.dataFields.categoryX = xAxisHeader;
    series.strokeWidth = 2;
    // series.yAxisHeader = valueAxis;
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

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.stackedChart) {
        this.stackedChart.dispose();
      }
      if (this.lineChart) {
        this.lineChart.dispose();
      }
    });
  }
}
