import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ProtocolloBean, User } from '../_models';
import { ProtocolService } from '../protocol.service';
import { GenerateSecretService } from '../generate-secret.service';
import { GETService } from '../get.service';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../_services/authentication.service';
import { POSTService } from '../post.service';
// import { SchedaSlingAttributeBean } from '../_models/SchedaSlingAttributeBean';
import { UrlConstants } from '../_constants/url.constants';
import { JcrHelper } from '../_helpers/jcrhelper';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isNuovaScheda!: boolean;

  image_nuovo!: string;
  image_cerca!: string;
  image_stats!: string;
  image_admin!: string;
  scheda_aperte!: string;
  public userName!: string;
  public deviceName!: string;
  public salaName!: string;
  public gruppi!: string;
  public user!: User;

  constructor(
    private authenticationService: AuthenticationService,
    private getService: GETService,
    private http: HttpClient,
    private postService: POSTService,
    private protocolService: ProtocolService,
    private route: ActivatedRoute,
    private router: Router) { }

    readonly routerLink1: string = `['/${UrlConstants._1_ACCOGLIENZA}']`;

  ngOnInit(){
    this.getAuth();
    this.getListaSchedeAttive();
    this.image_nuovo = environment.imgPath + "assets/nuovo.png"; // this.getImage("nuovo");
    this.image_cerca = environment.imgPath + "assets/ricerca.png"; // this.getImage("ricerca");
    this.image_stats = environment.imgPath + "assets/stats.png"; // this.getImage("stats");
    this.image_admin = environment.imgPath + "assets/admin.png"; // this.getImage("admin");
    this.protocolService.destroyProtocolNumber();
    this.protocolService.destroyProtocolCardPth();
    // this.initializeService.InitializeTemplates();
    this.user = this.authenticationService.getUser();
    this.userName = this.user.username;
    this.deviceName = this.user.deviceName;
    this.salaName = this.user.sala;
    this.gruppi = this.user.Groups.toString();

  }

  getNuovaSchedaLabel() : string {
    return this.isNuovaScheda ? "Crea nuova scheda" : "Scheda In lavorazione:";
  }

  getListaSchedeAttive(){
    this.getService.getActiveData().subscribe(d => {
      this.isNuovaScheda = d.length < 2;
      var nome = "";
      var cognome = "";
      console.log("valerio:" + JSON.stringify(d));
      console.log(JcrHelper.getJcrStringValue(d, "nome"));
      console.log(JcrHelper.getJcrStringValue(d, "cognome"));
      cognome = JcrHelper.getJcrStringValue(d, "cognome")
      nome= JcrHelper.getJcrStringValue(d, "nome") 
      if (nome == null) {
        nome = ""
      } else {
        this.isNuovaScheda = false;
      }

      if (cognome == null) {
        cognome = ""
      } else {
        this.isNuovaScheda = false;
      }
      this.scheda_aperte = `${nome} ${cognome}`;
    }, error => {
      console.log(error);
    });
    
  }
  getImage(nameImage : string){
    
    return environment.apiUrl + `/content/schedaInf/assets/${nameImage}.png`;
    // return environment.apiUrl + `/content/next-forms/img/schedaInf/${nameImage}.png`;
    //return `http://next2u.myddns.com:8080/content/next-forms/img/schedaInf/${nameImage}.png`;
  }

  onClickNuovaScheda() {
    console.log("onClickNuovaScheda");
  }
  
  isNewVisible()
  {
    return this.authenticationService.isInGroup(environment.gruppoendoSegreteria);
  }

  isSearchVisible()
  {
    return this.authenticationService.isInGroup(environment.gruppoendoSegreteria) || this.authenticationService.isInGroup(environment.gruppoendoAdmin);
  }

  isAdminVisible()
  {
    return this.authenticationService.isInGroup(environment.gruppoendoAdmin);
  }

  isStatsVisible()
  {
    return this.authenticationService.isInGroup(environment.gruppoendoAdmin);
  }

  getAuth(){
    //Invocazione del sevizio di login. 
    this.authenticationService.login('segreteria', 'segreteria')
      //.pipe(first())
      .subscribe(user => {
        console.log(JSON.stringify(user))
      });
    // this.logger.log(logLevelModel.debug, LoginComponent.name, "FINE - Invio dei dati della Form.");

    // this.getService.getAuthentication().subscribe(
    //   res=>{
    //     localStorage.setItem("key", res.secret);
    //   },
    //   error=>{

    //   },
    //   ()=>{
        
    //   }
    // )
  }

  logout()
  {
    this.authenticationService.logout();
  }
}
