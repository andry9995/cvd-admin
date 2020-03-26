import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertConfig } from 'ngx-bootstrap/alert';


@Component({
  selector: 'app-manage-categorie',
  templateUrl: './manage-categorie.component.html',
  styleUrls: ['./manage-categorie.component.css']
})
export class ManageCategorieComponent implements OnInit {
  	
  key: string;

  categorie = {
  	name: ''
  }

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

	medicaments = [];

  constructor(
		public firebase: AngularFireDatabase,
  	public route: ActivatedRoute,
  	public router: Router,
  ) {
  	this.route.params.subscribe((params)=>{
  		this.key = params.key;
  		// console.log(this.key)
  		this.listMedicaments();
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

  saveCategorie(){
	let ok = this.save('categorie',this.categorie,this.key);
	if (ok) {
		this.showAlertEdit();
	}
  }

  save(path:string,object:any, key?:string){
	  	if (key) {
	  		return this.firebase.list(path).update(key,object);
	  	} else {
	  		return this.firebase.list(path).push(object).key
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

	saveMedicament(){
		let medicamentKey = this.save('categorie/' + this.key + '/medicament', this.medicament);
		if (medicamentKey) {
			this.initialStory(medicamentKey).then((success)=>{
				this.showAlertSave();
				this.reInit();
				this.listMedicaments();
			})
		}
	}

	initialStory(medicamentKey){
		return new Promise((resolve)=>{
			let story = {
				date: this.dateNow(),
				status: 'création',
				qty: this.medicament.qteDispo,
				desc: 'Dépôt initiale'
			};
			let path = 'story/' + medicamentKey + '/activity';
			let saved = this.save(path,story);
			if (saved) {
				resolve(saved);
			}
		});
			
	}



	listMedicaments(){
		this.fetchById('categorie',this.key).then((categorie:any)=>{
				this.medicaments = [];
  			this.categorie.name = categorie['name'];
  			for(let i in categorie.medicament){
  					let medicament = categorie.medicament[i];
  					medicament['key'] = i;
  					this.medicaments.push(medicament);
  				}

  		})
	}

	reInit(){
		this.medicament = {
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
	}

	goToManageMedicament(key){
		this.router.navigate(['manage-medicament/' + this.key + '/' + key]);
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

  	alertEdit: any = [];
  	alertSave: any = [];

  	showAlertEdit(){
	    this.alertEdit.push({
	      type: 'success',
	      msg: 'MODIFICATION ENREGISTRE',
	      timeout: 5000
	    });
	  }

	showAlertSave(){
		this.alertSave.push({
			type: 'success',
			msg: 'MEDICAMENT ENREGISTRE',
			timeout: 5000
		});
	}


}
