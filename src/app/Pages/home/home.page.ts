import { UtilService } from "./../../services/util.service";
import { ApiService } from "./../../services/api.service";
import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  data: any = {};
  rdata: any = {};
  err: any = {};

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private util: UtilService
  ) {
    this.getUserDate();
    this.util.startLoad();
    this.api.getDataWithToken("home").subscribe(
      (res: any) => {
        if (res.success) {
          this.util.dismissLoader();
          this.data = res.data;
        }
      },
      (err) => {
        this.util.dismissLoader();
        this.err = err.error.errors;
      }
    );
  }

  ngOnInit() {}
  doRefresh(event) {
    this.api.getDataWithToken("home").subscribe(
      (res: any) => {
        if (res.success) {
          this.data = res.data;
          event.target.complete();
        }
      },
      (err) => {
        event.target.complete();
      }
    );
  }

  viewList(id) {
    this.api.id = id.id;
    this.api.category = id.name;
    this.navCtrl.navigateForward("/salon-list");
  }
  getUserDate() {
    this.util.isUpdateProfile.subscribe((s) => {
      if (!s) {
        this.util.startLoad();
      }

      this.api.getDataWithToken("profile").subscribe(
        (res: any) => {
          this.rdata = res;

          if (!s) {
            this.util.dismissLoader();
          }
        },
        (err) => {
          if (!s) {
            this.util.dismissLoader();
          }
          this.err = err.error.errors;
        }
      );
    });
  }
  viewSlonDetail(id) {
    this.api.id = id;
    this.navCtrl.navigateForward("/salon-detail");
  }
}
