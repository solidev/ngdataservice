import {Component} from "@angular/core";
import {Train, TrainService} from "./trains/model";


@Component({
    selector: "ds-app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]

})
export class AppComponent {
    public train: Train;

    constructor(private _trains: TrainService) {
        this._trains.getCollection().get(1,{}).subscribe((t: Train) => {
            console.log("Got train", t);
            this.train = t;
        });
    }
}

