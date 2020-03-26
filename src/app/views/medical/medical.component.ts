import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.css']
})
export class MedicalComponent implements OnInit {

	categorie: string;

	categorieList = [];

	categorieKey: string;
	categorieName: string;

	selectedCategorie: string;

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

	constructor(public firebase: AngularFireDatabase) {
		this.loadListCategorie();
	}

	ngOnInit(): void {
  	}

  	saveCategorie(){
  		// console.log(this.categorie);
  		let categorie = {
  			name: this.categorie
  		}

  		var key = "";

  		if (this.categorieKey) {
  			key = this.categorieKey;
  		}

  		var ok = this.save('categorie',categorie,key);

  		if (ok) {
  			this.categorie = "";
  			this.categorieKey = "";
  			this.loadListCategorie();
  		}


  	};

  	save(path:string,object:any, key?:string){
	  	if (key) {
	  		return this.firebase.list(path).update(key,object);
	  	} else {
	  		return this.firebase.list(path).push(object).key
	  	}
	}

	loadListCategorie(){
  		this.firebase.object('categorie').valueChanges().subscribe((list:any)=>{
			this.categorieList = [];
			let num = 1;
  			for(let key in list){
  				let categorie = list[key];
  				categorie['key'] = key;
  				categorie['num'] = num;
  				var medicaments = [];
  				num += 1;
  				// console.log(categorie.medicament)

  				for(let i in categorie.medicament){
  					let medicament = categorie.medicament[i];
  					medicament['key'] = i;
  					medicaments.push(medicament);
  				}

  				categorie['medicaments'] = medicaments;

  				this.categorieList.push(categorie)
  			}
  		})
	}

	deleteCategorie(key){
    	this.firebase.list('categorie').remove(key).then((deleted)=>{
    		this.loadListCategorie();
    	});
	}

	editCategorie(key){
		this.categorieKey = key;
		this.fetchById('categorie',key).then((categorie)=>{
			this.categorie = categorie['name'];
		})
	}

	fetchById(path:string, id:string){
	  	return new Promise((resolve)=>{
	  		this.firebase.object(`${path}/${id}`).valueChanges().subscribe((object)=>{
	  			resolve(object);
	  		})
	  	})
	}

	saveMedicament(){
		this.save('categorie/' + this.selectedCategorie + '/medicament', this.medicament);
		// console.log(this.medicament);
	}



}
