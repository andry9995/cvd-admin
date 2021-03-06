import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertConfig } from 'ngx-bootstrap/alert';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css']
})
export class CategorieComponent implements OnInit {

	categorie: string;
	categorieKey: string;
	categorieList = [];

	constructor(
		public firebase: AngularFireDatabase,
  		public router: Router,
	) {
		this.loadListCategorie();
	}

	ngOnInit(): void {
	}

	save(path:string,object:any, key?:string){
	  	if (key) {
	  		return this.firebase.list(path).update(key,object);
	  	} else {
	  		return this.firebase.list(path).push(object).key
	  	}
	}

	saveCategorie(){
  		let categorie = {
  			name: this.categorie
  		}

  		var key = "";

  		if (this.categorieKey) {
  			key = this.categorieKey;
  		}

  		var ok = this.save('categorie',categorie,key);

  		if (ok) {
        this.showAlertAdd();
  			this.categorie = "";
  			this.categorieKey = "";
  			this.loadListCategorie();
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
  				num += 1;
  				this.categorieList.push(categorie)
  			}
  		})
  	}

  	deleteCategorie(key){
    	this.firebase.list('categorie').remove(key).then((deleted)=>{
        this.showAlertDelete();
    		this.loadListCategorie();
    	});
	}

	goToManageCategorie(key){
		this.router.navigate(['manage-categorie/' + key]);
	}

  alertAdd: any = [];
  alertDelete: any = [];

  showAlertAdd(){
    this.alertAdd.push({
      type: 'success',
      msg: 'NOUVELLE CATEGORIE ENREGISTRE',
      timeout: 5000
    });
  }

  showAlertDelete(){
    this.alertDelete.push({
      type: 'danger',
      msg: 'CATEGORIE SUPPRIME',
      timeout: 5000
    });
  }


}
