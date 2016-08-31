import {Component} from "@angular/core";
import {Train, TrainService} from "./trains/model";


@Component({
    selector: "ds-app",
    templateUrl: "./app.component.html"
/*: `
    <div>
      <h2>This is fetched train data</h2>
        <pre>{{train?.title}}</pre>
    </div>
  `*/
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

