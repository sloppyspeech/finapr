import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder,FormGroup,FormControl,Validators,FormsModule,ReactiveFormsModule  }  from '@angular/forms';
import { Chart } from "chart.js";
import { ExpenseService } from '../services/expense.service';
import { Subscription } from 'rxjs/Subscription';
import { validateStartEndDate } from '../validators/access.validators';
import { formatDate, DatePipe  } from '@angular/common';

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.page.html",
  styleUrls: ["dashboard.page.scss"],
  providers:[DatePipe]
})
export class DashboardPage implements OnInit {
  @ViewChild("barCanvas",{static:true}) barCanvas: ElementRef;
  @ViewChild("doughnutCanvas",{static:true}) doughnutCanvas: ElementRef;
  @ViewChild("ExpenseToIncomeCanvas",{static:true}) ExpenseToIncomeCanvas: ElementRef;
  @ViewChild("horizontalBarCanvas",{static:true}) horizontalBarCanvas: ElementRef;

  private barChart: Chart;
  private doughnutChart: Chart;
  private lineChart: Chart;
  private horizontalBarChart:Chart;

  barChartSub:Subscription;
  barChartLabel;
  barChartData;
  barChartBackGroundColor;

  doughNutChartSub:Subscription;
  doughNutChartLabel;
  doughNutChartData;
  doughNutChartBackGroundColor;

  hBarChartSub:Subscription;
  hBarChartLabel;
  hBarChartData;
  hBarChartBackGroundColor;
  //
  DashboardSrchFG:FormGroup;
  fctl_start_date:FormControl;
  fctl_end_date:FormControl;
  dateVal;
  bef6MonDateVal;
  defDateFilter;

  constructor(private _expSer:ExpenseService,
              private _date:DatePipe,
              private _formbuilder: FormBuilder) {}

  ngOnInit() {
    this.DashboardSrchFG = this._formbuilder.group({
      fctl_start_date: new FormControl('', [Validators.required]),
      fctl_end_date: new FormControl('', [Validators.required])}
      , { validator: validateStartEndDate }
    );
    console.log(new Date());
    this.dateVal=this._date.transform(new Date(),"yyyy-MM-dd");
    console.log(`${this.dateVal}`);
    this.bef6MonDateVal=this._date.transform(new Date(new Date().setMonth(new Date().getMonth() -12)),"yyyy-MM-dd");
    console.log('------DashBoard----');
    console.log(`${this.bef6MonDateVal} <=> ${this.dateVal}`);
    this.DashboardSrchFG.get('fctl_start_date').setValue(this.bef6MonDateVal);
    this.DashboardSrchFG.get('fctl_end_date').setValue(this.dateVal);
    this.defDateFilter={'startDate':this.bef6MonDateVal,'endDate':this.dateVal};
      

    //Generate doughnut Chart 
    this.generateDoughNutChart(this.defDateFilter);
    //Generate Bar Chart
    this.generateBarChart(this.defDateFilter);
    //Generate Horizontal Bar Chart
    this.generateHBarChart(this.defDateFilter);
    //

    
  }

  getVisual(dashboard_srch_fg:FormGroup){
    console.log('----------getVisual------------');
    // console.log(`${this.bef6MonDateVal} <=> ${this.dateVal}`);
    var start_date=this._date.transform(dashboard_srch_fg.get('fctl_start_date').value,"yyyy-MM-dd");
    var end_date=this._date.transform(dashboard_srch_fg.get('fctl_end_date').value,"yyyy-MM-dd");
    console.log(`start_date : ${start_date}  end_date:${end_date}`);
    var filter={'startDate':start_date,'endDate':end_date};
    this.generateDoughNutChart(filter);
    this.generateBarChart(filter);
    this.generateHBarChart(filter);

  }

  generateBarChart(filter:any){
    console.log(`In Generate Bar Char Filter: ${JSON.stringify(filter)}`);

    //Generate Bar Chart
    if ( this.barChartSub){
      this.barChartSub.unsubscribe();
    }

    this._expSer.getSumAllExpByYearMon(filter);
    this.barChartSub=this._expSer.$allExpByYearMon.subscribe(data=>{
    console.log(JSON.stringify(data));
    this.barChartData=[];
    this.barChartLabel=[];
    this.barChartBackGroundColor=[];

    for (var i=0;i< data.length;i++){
      console.log(data[i]);
      this.barChartLabel.push(data[i]['Month']);
      this.barChartData.push(data[i]['SUM(Amount)']);
      this.barChartBackGroundColor.push("rgba(30,144,255,0.9)")
    }

        this.barChart = new Chart(this.barCanvas.nativeElement, {
              type: "bar",
              data: {
                // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange","a","b","c","d"],
                labels: this.barChartLabel,
                datasets: [
                  {
                    label: "Amount",
                    data: this.barChartData,
                    backgroundColor: this.barChartBackGroundColor,
                    borderWidth: 2
                  }
                ]
              },
              options: {
                scales: {
                  xAxes: [{
                      gridLines: {
                          display:false
                      },
                      ticks: {
                        beginAtZero: false,
                        fontSize:10
                      }
                  }],
                  yAxes: [
                    {
                      gridLines: {
                        display:false
                      },
                      ticks: {
                        beginAtZero: false,
                        fontSize:10
                      }
                    }
                  ]
                }
              }//options Close
            });

      });//barChartSub
  }

  generateHBarChart(filter){
    console.log(`In Generate HBar Char Filter: ${JSON.stringify(filter)}`);

    if(this.hBarChartSub){
      this.hBarChartSub.unsubscribe();
    }

    this._expSer.getSumAllExpByPurpose(filter);
    this.hBarChartSub=this._expSer.$allExpByPurpose.subscribe(data=>{
    let colorPalette= ['#e6194b', '#3cb44b', '#ffe119', '#911eb4', '#46f0f0', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#808080']

    console.log(JSON.stringify(data));
    this.hBarChartData=[];
    this.hBarChartLabel=[];
    this.hBarChartBackGroundColor=[];
    for (var i=0;i< data.length;i++){
      console.log(data[i]);
      this.hBarChartData.push(data[i]['SUM(Amount)']);
      this.hBarChartLabel.push(data[i]['Purpose']);
      this.hBarChartBackGroundColor.push(colorPalette[i]);
    }

    Chart.defaults.global.legend.display=false;

          // this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
          //   type: "doughnut",
          //   data: {
          //     labels: this.doughNutChartLabel,
          //     datasets: [
          //       {
          //         label: "# of Votes",
          //         data:this.doughNutChartData,
          //         backgroundColor:this.doughNutChartBackGroundColor,
          //         hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"]
          //       }
          //     ]
          //   }
          // });

          this.hBarChartData = new Chart(this.horizontalBarCanvas.nativeElement, {
            type: "horizontalBar",
            data: {
              labels: this.hBarChartLabel,
              datasets: [
                {
                  label: "Exp",
                  data:this.hBarChartData,
                  backgroundColor:this.hBarChartBackGroundColor,
                  hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"]
                }
              ]
            },
            options: {
                scales: {
                  xAxes: [{
                      gridLines: {
                          display:false
                      },
                      ticks: {
                        beginAtZero: false,
                        fontSize:10
                      }
                  }],
                  yAxes: [
                    {
                      gridLines: {
                        display:false
                      },
                      ticks: {
                        beginAtZero: false,
                        fontSize:10
                      }
                    }
                  ]
                }
              }
          });


      });
      Chart.defaults.global.legend.display=true;

  }

  generateDoughNutChart(filter){
    this._expSer.getExpIncomeDataForApartment(filter);

    this.doughNutChartSub=this._expSer.$TotExpenseIncomeForApartmentByYear
                              .subscribe(res=>{
          
          console.log('--------------generateDoughNutChart----------');
          console.log(res);
          var inpData=[res[0]['TotalPaymentByOccupants'],res[1]['TotalApartmentExpense']]
          console.log(inpData);
          this.doughnutChart = new Chart(this.ExpenseToIncomeCanvas.nativeElement, {
            type: "doughnut",
            data: {
              labels: ["Income","Expense"],
              datasets: [
                {
                  label: "My First dataset",
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor:['#3cb44b','#e6194b'],
                  // borderColor: "rgba(75,192,192,1)",
                  borderCapStyle: "butt",
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: "miter",
                  pointBorderColor: "rgba(75,192,192,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(75,192,192,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: inpData,
                  spanGaps: false
                }
              ]
            }
          });
        });
  }
}