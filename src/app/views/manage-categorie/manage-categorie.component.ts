import { Component, OnInit } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';


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
	this.save('categorie',this.categorie,this.key);
  }

  save(path:string,object:any, key?:string){
	  	if (key) {
	  		return this.firebase.list(path).update(key,object);
	  	} else {
	  		return this.firebase.list(path).push(object).key
	  	}
	}

	saveMedicament(){
		let ok = this.save('categorie/' + this.key + '/medicament', this.medicament);
		if (ok) {
			this.reInit();
			this.listMedicaments();
		}
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
		};
	}

	goToManageMedicament(key){
		this.router.navigate(['manage-medicament/' + this.key + '/' + key]);
	}

}
