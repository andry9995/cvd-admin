import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router, Params, ActivatedRoute } from '@angular/router';

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
    return this.save('categorie/' + this.categorieKey + '/medicament', this.medicament,this.key);
  }

  save(path:string,object:any, key?:string){
      if (key) {
        return this.firebase.list(path).update(key,object);
      } else {
        return this.firebase.list(path).push(object).key
      }
  }

  saveInput(){
    let story = {
       date: this.dateNow(),
       status: 'entrée',
       qty: this.input,
       desc: this.inputDesc 
    };
    let path = 'categorie/' + this.categorieKey + '/medicament/' + this.key + '/story';
    var ok = this.save(path,story);

    if (ok) {
      this.medicament.qteDispo = Number(this.medicament.qteDispo) + Number(this.input);
      let saved = this.saveMedicament();

      if (saved) {
        this.input = 0;
        this.inputDesc = ""
        this.listStory();
      }

    }
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
      let story = {
         date: this.dateNow(),
         status: 'sortie',
         qty: this.output,
         desc: this.outputDesc 
      };
      let path = 'categorie/' + this.categorieKey + '/medicament/' + this.key + '/story';
      var ok = this.save(path,story);

      if (ok) {
        this.medicament.qteDispo = Number(this.medicament.qteDispo) - Number(this.output);
        let saved = this.saveMedicament();
        if (saved) {
          this.output = 0;
          this.outputDesc = "";
          this.listStory();
        }
      }
    } else {
      // tsy ampy
    }
  }

  listStory(){
    let path = 'categorie/' + this.categorieKey + '/medicament/' + this.key + '/story';
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



}
