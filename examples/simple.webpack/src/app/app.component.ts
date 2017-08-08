import {Component} from "@angular/core";
import {Train, TrainService} from "./trains/model";


@Component({
    selector: "ds-app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]

})
export class AppComponent {
    public train1: Train;
    public train2: Train;
    public train3: Train;
    public train4: Train;
    public train5: Train;
    public train6: Train;
    public train7: Train;

    constructor(private _trains: TrainService) {
        let coll = this._trains.getCollection();
        coll.get(1, {}).subscribe((t: Train) => {
            console.log("Got train", t);
            this.train1 = t;

        });

        coll.create({title: "chugginton"}, {save: true})
            .subscribe((t: Train) => {
                console.log("Saved train 5", t);
                this.train5 = t;
                coll.get(5, {fromcache: true}).subscribe((ct) => {
                    console.log("From cache", ct);
                    this.train6 = ct;
                });
            });

        coll.get(2, {}).subscribe((t: Train) => {
            console.log("Got train 2", t);
            this.train2 = t;
            coll.remove(4).subscribe(() => {
                console.log("Removed train 4");
                t.title = "Modified train 2";
                t.save().subscribe((nt: Train) => {
                    console.log("Modified train", nt);
                    console.log("Orig train", t);
                    this.train3 = nt;
                    coll.get(2, {}).subscribe((ct: Train) => {
                        console.log("Got train 2", ct);
                        this.train4 = ct;
                        this.train4.refresh().subscribe((rt) => {
                            console.log("Refreshed from db", rt);
                            this.train7 = rt;
                        })
                    });
                });
            });

        });



    }
}

