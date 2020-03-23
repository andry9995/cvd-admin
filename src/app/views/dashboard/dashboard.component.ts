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

  people = [];
  symptomList = [];
  tous = 0;
  jaune = 0;
  rouge = 0;
  blanc = 0;

  percentTous = 0;
  percentBlanc = 0;
  percentJaune = 0;
  percentRouge = 0;

  constructor(public firebase: AngularFireDatabase) { 
    this.listPeople('tous');
  }

  initialize(){
    this.people = [];
    this.symptomList = [];
    this.tous = 0;
    this.jaune = 0;
    this.rouge = 0;
    this.blanc = 0;

    this.percentTous = 0;
    this.percentBlanc = 0;
    this.percentJaune = 0;
    this.percentRouge = 0;
  }

  listPeople(status){

    this.initialize();

    this.covidSymptom().then((symptomList)=>{

        this.firebase.object('people').valueChanges().subscribe((people:any)=>{
            for(let i in people){
              let surveyKey = i;
              this.firebase.object('survey/' + surveyKey).valueChanges().subscribe((survey:any)=>{
                var mySymptom = [];
                for(let j in survey){
                  var qstKey = j.replace("qst","")
                  if(survey[j] == "oui" && this.symptomList.includes(qstKey)){
                    mySymptom.push(qstKey);
                  }
                }

                var percent   = this.percentage(mySymptom);
                var confirmed = "blanc";

                this.tous += 1;

                if(percent > 49 && percent <= 79){
                  confirmed = "jaune";
                  this.jaune += 1;
                } else {
                  if (percent > 79){
                    confirmed = "rouge";
                    this.rouge += 1;
                  } else {
                    this.blanc += 1;
                  }
                }

                this.statistique();
                
                people[i]['me'] = mySymptom.length;
                people[i]['sick'] = this.symptomList.length;
                people[i]['percent']   = percent;
                people[i]['confirmed'] = confirmed;

                if (status != 'tous') {
                  if (confirmed == status) {
                    this.people.push(people[i]);
                  }

                } else {
                  this.people.push(people[i]);
                }

              })
            }
        })
    })

  }

  statistique(){
    this.percentTous = Math.round((this.tous * 100) / this.tous);
    this.percentBlanc = Math.round((this.blanc * 100) / this.tous);
    this.percentJaune = Math.round((this.jaune * 100) / this.tous);
    this.percentRouge = Math.round((this.rouge * 100) / this.tous);
  }

  covidSymptom(){
    return new Promise((resolve)=>{
      this.firebase.object('questionnaire').valueChanges().subscribe((questionnaires:any)=>{
        for(let key in questionnaires){
          let question = questionnaires[key];
          if(question.symptom == true){
            this.symptomList.push(key);
          }
        }
        resolve(this.symptomList);
      })
    })

  }

  percentage(mySymptom){
    var me = mySymptom.length;
    var sick = this.symptomList.length;

    var percent = Math.round(( me * 100 ) / sick);

    return percent; 
  }

  setMyStyles(percent) {
    let styles = {
      'width': percent + '%'
    };
    return styles;
  }

}
