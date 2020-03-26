import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertConfig } from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-manage-medicament',
  templateUrl: './manage-medicament.component.html',
  styleUrls: ['./manage-medicament.component.css']
})
export class ManageMedicamentComponent implements OnInit {

  key: string;
  categorieKey: string;

	medicament = {
		name: '',
		qteDispo : 0,
		consAn : 0,
		consMens : 0,
		qteEnAtt : 0,
		datePrev : '',
		moisStockDisp : 0,
		moisStockArt : 0,
		frs : '',
		comment : '',
    sourceFin: ''
	};

  input: number = 0;
  output: number = 0;
  inputDesc: string = "";
  outputDesc: string = "";

  storyList = [];

  constructor(
  	public firebase: AngularFireDatabase,
  	public route: ActivatedRoute,
  	public router: Router,
  ) {
  	this.route.params.subscribe((params)=>{
  		this.key = params.key;
  		this.categorieKey = params.categorieKey;
  		this.fetchById('categorie/' + this.categorieKey + '/medicament/',this.key).then((medicament:any)=>{
        this.medicament =  medicament;
        this.listStory();
      })
  	})
  }

  ngOnInit(): void {
  }

  fetchById(path:string, id:string){
  	return new Promise((resolve)=>{
  		this.firebase.object(`${path}/${id}`).valueChanges().subscribe((object)=>{
  			resolve(object);
  		})
  	})
  }

  saveMedicament(){
    return new Promise((resolve)=>{
      let saved = this.save('categorie/' + this.categorieKey + '/medicament', this.medicament,this.key);
      if (saved) {
        this.showAlertEdit();
        resolve(saved);
      }
    })
  }

  save(path:string,object:any, key?:string){
      if (key) {
        return this.firebase.list(path).update(key,object);
      } else {
        return this.firebase.list(path).push(object).key
      }
  }

  saveInput(){
    this.medicament.qteDispo = Number(this.medicament.qteDispo) + Number(this.input);
    this.saveMedicament().then((saved)=>{
      this.setStory('input').then((success)=>{
        this.showAlertInput();
        this.input = 0;
        this.inputDesc = "";
        this.listStory();
      })
    })
  }

  setStory(activity:string){
    return new Promise((resolve)=>{

      if (activity == 'input') {
        let story = {
           date: this.dateNow(),
           status: 'entrée',
           qty: this.input,
           desc: this.inputDesc 
        };
        
        let path = 'story/' + this.key + '/activity';
        var ok = this.save(path,story);

      } else {
        let story = {
           date: this.dateNow(),
           status: 'sortie',
           qty: this.output,
           desc: this.outputDesc 
        };
        let path = 'story/' + this.key + '/activity';
        var ok = this.save(path,story);
      }

      
      if (ok) {
        resolve(ok);
      }

    })
  }

  dateNow(){
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour = date.getHours();
    let minutes = date.getMinutes();
    return day + "-" + (month < 10 ? '0' + month : month) + "-" + year + " " + (hour < 10 ? '0' + hour : hour) + ":" + (minutes < 10 ? '0' + minutes : minutes);
  }

  saveOutput(){

    if ((Number(this.medicament.qteDispo) - Number(this.output)) > 0) {
      this.medicament.qteDispo = Number(this.medicament.qteDispo) - Number(this.output);
      this.saveMedicament().then((saved)=>{
        this.setStory('output').then((success)=>{
          this.showAlertOutput();
          this.output = 0;
          this.outputDesc = "";
          this.listStory();
        })
      })

    } else {
      this.showAlertOutputError();
    }


  }

  listStory(){
    let path = 'story/' + this.key + '/activity';
    this.fetchAll(path).then((stories:any)=>{
      for(let i in stories){
        this.storyList.push(stories[i]);
      }
    });

  }

  fetchAll(path){
    return new Promise((resolve)=>{
      this.firebase.object(path).valueChanges().subscribe((list)=>{
        this.storyList = [];
        resolve(list);
      })
    })
  }

  alertsDismiss: any = [];

  add(): void {
    this.alertsDismiss.push({
      type: 'info',
      msg: `This alert will be closed in 5 seconds (added: ${new Date().toLocaleTimeString()})`,
      timeout: 5000
    });
  }

  alertEdit: any = [];
  alertInput: any = [];
  alertOutput: any = [];

  showAlertEdit(){
    this.alertEdit.push({
      type: 'success',
      msg: 'MODIFICATION ENREGISTRE',
      timeout: 5000
    });
  }

  showAlertInput(){
    this.alertInput.push({
      type: 'success',
      msg: 'ENTREE ENREGISTRE',
      timeout: 5000
    });
  }

  showAlertOutput(){
    this.alertOutput.push({
      type: 'success',
      msg : 'SORTIE ENREGISTRE',
      timeout: 5000
    })
  }

  calculeSemaineSD(){
    if (this.medicament.qteDispo && this.medicament.consMens) {
      this.medicament.moisStockDisp = Number(this.medicament.qteDispo) / Number(this.medicament.consMens) ;
    } else {
      this.medicament.moisStockDisp = 0;
    }

    if (this.medicament.qteDispo && this.medicament.qteEnAtt && this.medicament.consMens) {
      this.medicament.moisStockArt = (Number(this.medicament.qteDispo) + Number(this.medicament.qteEnAtt)) / Number(this.medicament.consMens);
    } else {
      this.medicament.moisStockArt = 0;
    }
  }

  showAlertOutputError(){
    this.alertOutput.push({
      type: 'danger',
      msg : 'SORTIE SUPERIEUR AU STOCK DISPONIBLE',
      timeout: 5000
    })
  }


    



}
