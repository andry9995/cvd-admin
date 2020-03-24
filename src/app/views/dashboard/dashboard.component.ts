import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  ngOnInit(): void {
    
  }

  people       = [];
  symptomList  = [];
  tous         = 0;
  jaune        = 0;
  rouge        = 0;
  blanc        = 0;
  percentTous  = 0;
  percentBlanc = 0;
  percentJaune = 0;
  percentRouge = 0;
  countSymptom = 0;
  lat          :number = -11.733308;
  lng          :number = 43.2648763;
  zoom         = 10;
  locationList = [];

  constructor(public firebase: AngularFireDatabase) { 
    this.listPeople('tous');
  }

  initialize(){
    this.people       = [];
    this.symptomList  = [];
    this.locationList = [];
    this.tous         = 0;
    this.jaune        = 0;
    this.rouge        = 0;
    this.blanc        = 0;
    this.percentTous  = 0;
    this.percentBlanc = 0;
    this.percentJaune = 0;
    this.percentRouge = 0;
    this.countSymptom = 0;
  }


  list(){
    return new Promise((resolve)=>{
      this.firebase.object('people').valueChanges().subscribe((people:any)=>{
        resolve(people);
      });
    });
  }

  getSurvey(surveyKey){
    return new Promise((resolve)=>{
      this.firebase.object('survey/' + surveyKey).valueChanges().subscribe((survey:any)=>{
        resolve(survey)
      });
    })
  }

  listPeople(status){

    this.initialize();

    this.covidSymptom().then((countSymptom)=>{

        this.list().then((people:any)=>{
            for(let i in people){
              let surveyKey = i;
              this.getSurvey(surveyKey).then((survey:any)=>{
                var mySymptom = [];
                for(let j in survey){
                  var qstKey = j.replace("qst","")
                  if(survey[j] == "oui"){
                    mySymptom.push(qstKey);
                  }
                }

                var confirmed = "blanc";
                var simley    = "icon-emotsmile"
                this.tous     += 1;

                if(mySymptom.length > 0 && mySymptom.length <= 3){
                  confirmed = "jaune";
                  this.jaune += 1;
                  simley = "fa fa-meh-o";
                } else {
                  if (mySymptom.length > 3){
                    confirmed = "rouge";
                    this.rouge += 1;
                    simley = "fa fa-frown-o";
                  } else {
                    this.blanc += 1;
                  }
                }

                this.statistique();
                
                people[i]['me']        = mySymptom.length;
                people[i]['sick']      = this.countSymptom;
                people[i]['percent']   = this.percentage(mySymptom.length);
                people[i]['confirmed'] = confirmed;
                people[i]['simley']    = simley;

                if (status != 'tous') {
                  if (confirmed == status) {
                    this.people.push(people[i]);
                    if(confirmed != 'blanc' && people[i].location){
                      people[i].location.color = this.getRadiusColor(confirmed)
                      this.locationList.push(people[i].location);
                    }
                  }
                } else {
                  this.people.push(people[i]);
                  if(confirmed != 'blanc' && people[i].location){
                    people[i].location.color = this.getRadiusColor(confirmed)
                    this.locationList.push(people[i].location);
                  }

                }

              })
            }
        })
    })

  }

  getRadiusColor(status){
    switch (status) {
      case "jaune":
        return "#ff9800";
        break;
      case "rouge":
        return "red";
        break;
    }
  }

  percentage(count){
    return Math.round((count * 122) / this.countSymptom);
  }

  statistique(){
    this.percentTous  = Math.round((this.tous * 100) / this.tous);
    this.percentBlanc = Math.round((this.blanc * 100) / this.tous);
    this.percentJaune = Math.round((this.jaune * 100) / this.tous);
    this.percentRouge = Math.round((this.rouge * 100) / this.tous);
  }

  covidSymptom(){
    return new Promise((resolve)=>{
      this.firebase.object('questionnaire').valueChanges().subscribe((questionnaires:any)=>{
        this.countSymptom = questionnaires.length - 1;
        resolve(this.countSymptom);
      })
    })

  }

  setMyStyles(percent) {
    let styles = {
      'width': percent + '%'
    };
    return styles;
  }

  circleRadius:number = 2000;

}
