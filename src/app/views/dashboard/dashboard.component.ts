import { EventEmitter, Component, OnInit, ViewChild, ElementRef, Input, Output, } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { AngularFireDatabase } from '@angular/fire/database';

import { loadModules } from "esri-loader";
import esri = __esri;

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  ngOnInit() {
    // this.init();
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
  lat          :number = -12.015534;
  lng          :number = 43.899710;
  // zoom         = 10;
  locationList = [];

  principalList = [];
  jauneList = [];
  rougeList = [];

  constructor(public firebase: AngularFireDatabase) { 
    this.listPeople('tous');
  }

  initialize(){
    this.people       = [];
    this.symptomList  = [];
    this.locationList = [];
    this.principalList = [];
    this.jauneList = [];
    this.rougeList = [];
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

    this.createMap();

    this.initialize();

    this.covidSymptom().then((countSymptom)=>{

        this.list().then((people:any)=>{
            for(let i in people){
              let surveyKey = i;
              this.getSurvey(surveyKey).then((survey:any)=>{
                var mySymptom = [];
                var confirmed = "blanc";
                var isSuspect = false;
                var isJaune = false; 
                var isRouge = false;

                for(let j in survey){
                  var qstKey = j.replace("qst","")
                  if(survey[j] == "oui"){

                    if(this.principalList.includes(qstKey) && isSuspect == false){
                      isSuspect = true;
                      isJaune = true;
                    }

                    if(isSuspect == true && this.rougeList.includes(qstKey) && isRouge == false) {
                      isRouge = true;
                    }

                    mySymptom.push(qstKey);
                  }
                }

                var simley    = "icon-emotsmile"
                this.tous     += 1;

                if(isRouge){
                  confirmed = "rouge";
                  this.rouge += 1;
                  simley = "fa fa-frown-o";
                } else {
                  if(isSuspect && isJaune){
                    confirmed = "jaune";
                    this.jaune += 1;
                    simley = "fa fa-meh-o";
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

                this.createPoint(people[i].location);

              })
            }
        })
    }).then(()=>{
      this.displayMap();
    })

  }

  getRadiusColor(status){
    switch (status) {
      case "jaune":
        return "#ffc107";
        break;
      case "rouge":
        return "#f86c6b";
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

        for(let i in questionnaires){
          let symptom = questionnaires[i];
          if(symptom.symptom == "principal"){
            this.principalList.push(i);
          } else {
            if(symptom.symptom == "jaune"){
              this.jauneList.push(i);
            } else {
              this.rougeList.push(i);
            }
          }
        }

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


  // ESRI ARCGIS MAP
  @Output() mapLoadedEvent = new EventEmitter<boolean>();
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  
  private _zoom = 8;
  private _center: Array<number> = [this.lng, this.lat];
  private _basemap = "streets-night-vector";
  private _loaded = false;
  private _view: esri.MapView = null;

  get mapLoaded(): boolean {
    return this._loaded;
  }

  @Input()
  set zoom(zoom: number) {
    this._zoom = zoom;
  }

  get zoom(): number {
    return this._zoom;
  }

  @Input()
  set center(center: Array<number>) {
    this._center = center;
  }

  get center(): Array<number> {
    return this._center;
  }

  @Input()
  set basemap(basemap: string) {
    this._basemap = basemap;
  }

  get basemap(): string {
    return this._basemap;
  }

  map : esri.Map;

  graphicsLayer: any;

  async createMap(){
    const [EsriMap, EsriGraphicsLayer] = await loadModules([
        "esri/Map",
        "esri/layers/GraphicsLayer"
    ]);

    const mapProperties: esri.MapProperties = {
        basemap: this._basemap
    };

    this.graphicsLayer = new EsriGraphicsLayer();
    this.map = new EsriMap(mapProperties);
    this.map.add(this.graphicsLayer);
  }


  async createPoint(location){
    if (location.color) {
      
    const [EsriGraphic] = await loadModules([
        "esri/Graphic",
    ]);

    var point = {
       type: "point",
       longitude: location.lng,
       latitude: location.lat
     };

     var simpleMarkerSymbol = {
       type: "simple-marker",
       color: location.color,  // orange
       outline: {
         color: [255, 255, 255], // white
         width: 1
       }
     };

     var pointGraphic = new EsriGraphic({
       geometry: point,
       symbol: simpleMarkerSymbol
     });

     this.graphicsLayer.add(pointGraphic);
  
    }
  }

  async displayMap(){
    const [EsriMap, EsriMapView, EsriGraphic, EsriGraphicsLayer] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer"
    ]);

    const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: this.map
      };

      this._view = new EsriMapView(mapViewProperties);
      await this._view.when();
      return this._view;
  }


  async initializeMap() {
    try {
      const [EsriMap, EsriMapView, EsriGraphic, EsriGraphicsLayer] = await loadModules([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/layers/GraphicsLayer"
      ]);

      // Configure the Map
      const mapProperties: esri.MapProperties = {
        basemap: this._basemap
      };

      var graphicsLayer = new EsriGraphicsLayer();

      const map: esri.Map = new EsriMap(mapProperties);
      
      map.add(graphicsLayer);

      
      for(let i in this.locationList){

        let location = this.locationList[i];

        var point = {
           type: "point",
           longitude: location.lng,
           latitude: location.lat
         };

         var simpleMarkerSymbol = {
           type: "simple-marker",
           color: "#f86c6b",  // orange
           outline: {
             color: [255, 255, 255], // white
             width: 1
           }
         };

         var pointGraphic = new EsriGraphic({
           geometry: point,
           symbol: simpleMarkerSymbol
         });

         graphicsLayer.add(pointGraphic);
      }


      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this._center,
        zoom: this._zoom,
        map: map
      };

      this._view = new EsriMapView(mapViewProperties);
      await this._view.when();
      return this._view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  initEsriMap(){
    this.initializeMap().then(mapView => {
      // The map has been initialized
      console.log("mapView ready: ", this._view.ready);
      this._loaded = this._view.ready;
      this.mapLoadedEvent.emit(true);
    });
  }

}
